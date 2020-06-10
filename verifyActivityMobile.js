const axios = require('axios');

const { initPage } = require('./libs/utils');
const { base_url } = require('./config');

async function completeVerify(status, payload) {
  return new Promise(function (resolve, reject) {

    const apiKey = status === 'success' ? 'deviceComplete' : 'reject'
    const obj = { user_id: payload.user_id, sub_id: payload.sub_id };
    console.log('firing api payload', obj)

    // axios.post(base_url + `/main-mission/${apiKey}`, obj)
    //   .then(function (response) {
    //     console.log(response.data);
    //     resolve();
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //     reject();
    //   })
  })
}

async function verifyActivityMobile(browser, verifyDetails) {
  const page = await initPage(browser, true);
  try {
    console.log('go to activity link: ', verifyDetails.action_link);

    await page.goto(verifyDetails.action_link, { waitUntil: 'load', timeout: 0 });

    console.log('successful onboard verify activity page');

    const tagAndKeyword = await checkKeywordOrTagPeople(page, verifyDetails)

    console.log('tagAndKeyword:', tagAndKeyword);

    if (tagAndKeyword) {
      if (verifyDetails.action_name == 'post_like' || verifyDetails.action_name == 'post_comment') {
        const post = await page.$eval('article', el => el.getAttribute('data-store'));
        if (verifyDetails.action_name == 'post_like') {
          console.log('start verify like action');
          verifyPostFunction(page, post, verifyDetails, 'EntLikeEdgeStory');
        } else if (verifyDetails.action_name == 'post_comment') {
          console.log('start verify like comment');
          await verifyPostFunction(page, post, verifyDetails, 'EntCommentNodeBasedEdgeStory');
        }
      } else if (verifyDetails.action_name == 'post_share') {
        console.log('start verify share');
        const post = await page.$eval('.async_like', el => el.getAttribute('data-store'));
        await verifyPostFunction(page, post, verifyDetails, 'share_id');

      } else if (verifyDetails.action_name == 'page_like') {
        console.log('start verify page like');
        const post = await page.$eval('.async_like', el => el.getAttribute('data-store'));
        const likeItem = await page.$eval('a[data-sigil=show-save-caret-nux-on-click]', el => el.getAttribute('href'));
        console.log(likeItem)
        await verifyPageFunction(page, post, verifyDetails, 'EntFanPageEdgeStory', likeItem);

      } else if (verifyDetails.action_name == 'page_share') {
        console.log('start verify page share');
        const post = await page.$eval('.async_like', el => el.getAttribute('data-store'));
        const likeItem = await page.$eval('a[data-sigil=show-save-caret-nux-on-click]', el => el.getAttribute('href'));
        await verifyPageFunction(page, post, verifyDetails, 'share_id', likeItem);
      }

    } else {
      console.log('fail at tag or keyword');
      completeVerify('fail', verifyDetails);
    }
  } catch (e) {
    console.log('catch error:', e)
    completeVerify('fail', verifyDetails);
    await page.close();
    throw (e);
  }
}

async function checkKeywordOrTagPeople(page, verifyDetails) {
  let keyword = true
  let tag = true
  if (verifyDetails.keyword) {
    console.log('need check slogan');
    const words = await page.$eval('._5rgt', el => el.innerHTML);
    console.log('retrive words:', words)
    if (words.includes(verifyDetails.keyword)) {
      keyword = true;
    } else {
      console.log('cannot find slogan');
      keyword = false;
    }
  }
  // got tag people
  if (verifyDetails.tag_people) {
    console.log('need to check tag people');
    const taggedPeople = await page.$$eval('._5rgt > p > a', a => a.map(element => element.innerHTML.trim()));
    let tagCount = 0

    taggedPeople.map(tag => {
      console.log('tag:', tag);

      //  filter out special character
      if (!(tag.includes('https') || tag.includes('<') || tag.includes('/') || tag.includes('.'))) {
        tagCount += 1
      }
    })
    console.log('tagCount:', tagCount);
    if (tagCount >= verifyDetails.tag_people) {
      tag = true;
    } else {
      tag = false;
    }
  }
  if (keyword && tag) {
    return true
  } else {
    return false
  }
}

async function verifyPostFunction(page, post, verifyDetails, keyword) {
  console.log('post:', post);
  if (post.includes(verifyDetails.facebook_id) && post.includes(verifyDetails.criteria) && post.includes(keyword)) {
    console.log('verify post success');
    completeVerify('success', verifyDetails);
    await page.close();
  } else {
    console.log('user id not found: verify post fail');
    completeVerify('fail', verifyDetails);
    await page.close();
    throw ({ rejectCode: 1, message: 'user not found' });
  }
}

async function verifyPageFunction(page, post, verifyDetails, keyword, likeItem) {
  if (post.includes(verifyDetails.facebook_id) && post.includes(keyword) && likeItem.includes(decodeURI(verifyDetails.criteria))) {
    console.log(`verify ${verifyDetails.action_name} success`);
    completeVerify('success', verifyDetails);
    await page.close();
  } else {
    console.log('user id not found: verify fail');
    completeVerify('fail', verifyDetails);
    await page.close();
    throw ({ rejectCode: 1, message: 'user not found' });
  }
}


module.exports = verifyActivityMobile;