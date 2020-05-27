const axios = require('axios');

const { initPage } = require('./libs/utils');
const { base_url } = require('./config');

async function completeVerify(status, payload) {
  return new Promise(function (resolve, reject) {
    const apiKey = status === 'success' ? 'deviceComplete' : 'reject'
    const obj = { user_id: payload.user_id, sub_id: payload.sub_id };
    console.log(obj)
    axios.post(base_url + `/main-mission/${apiKey}`, obj)
      .then(function (response) {
        console.log(response.data);
        resolve();
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        reject();
      })
  })
}

async function verifyActivityMobile(browser, verifyDetails) {
  const page = await initPage(browser, true);
  try {

    console.log(verifyDetails.action_link);
    await page.goto(verifyDetails.action_link, {waitUntil: 'load', timeout: 0});

    console.log('successful onboard verify activity page');

    console.log('start verify mobile version data');

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

      await verifyPostFunction(page, post, verifyDetails, 'EntStatusCreationStory');

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
  } catch (e) {
    completeVerify('fail', verifyDetails);
    console.log('link not valid')
    await page.close();
    throw (e);
  }
}

async function verifyPostFunction(page, post, verifyDetails, keyword) {
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

  if (post.includes(verifyDetails.facebook_id) && post.includes(keyword) && likeItem.includes(verifyDetails.criteria)) {
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