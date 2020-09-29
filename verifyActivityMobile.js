const axios = require('axios');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

const { initPage } = require('./libs/utils');
const { base_url, FACEBOOK_ERROR_STATUS } = require('./config');

async function completeVerify(status, payload, $errorMessage = '') {
  return new Promise(function (resolve, reject) {

    const apiKey = status === 'success' ? 'deviceComplete' : 'reject'
    const obj = { user_id: payload.user_id, sub_id: payload.sub_id, error_msg: $errorMessage };
    console.log('firing api payload', obj)

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
    console.log('go to activity link: ', verifyDetails.action_link);

    await page.authenticate({
      username: 'lum-customer-hl_8acf1767-zone-static',
      password: 'gqq6sghvkmlb'
    });

    await page.goto(verifyDetails.action_link, { waitUntil: 'load'});

    console.log('successful onboard verify activity page');
      if (verifyDetails.action_name == 'post_like' || verifyDetails.action_name == 'post_comment') {
        const post = await page.$eval('article', el => el.getAttribute('data-store'));
        console.log(post);
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
        await verifySharePostFunction(page, post, verifyDetails, 'EntStatusCreationStory', 'EntLikeEdgeStory');

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
        await verifyPageFunction(page, post, verifyDetails, likeItem, 'EntStatusCreationStory', 'EntLikeEdgeStory');
      }
  } catch (e) {
    console.log('catch error:', e)
    completeVerify('fail', verifyDetails, FACEBOOK_ERROR_STATUS.LINK_INVALID);
    await page.close();
    throw (e);
  }
}

async function verifyPostFunction(page, post, verifyDetails, keyword) {
  console.log('post:', post);
  if (post.includes(verifyDetails.facebook_id) && post.includes(keyword)) {
    console.log('verify post success');
    // completeVerify('success', verifyDetails);
    await page.close();
  } else {
    console.log('user id not found: verify post fail');
    // completeVerify('fail', verifyDetails);
    await page.close();
    throw ({ rejectCode: 1, message: 'user not found' });
  }
}


async function verifySharePostFunction(page, post, verifyDetails, shareKeyword, likeKeyword) {
  // include 3 item and not include like item
  if (post.includes(verifyDetails.facebook_id) && post.includes(verifyDetails.criteria) && post.includes(shareKeyword) && !post.includes(likeKeyword)) {
    console.log('verify post success');
    // completeVerify('success', verifyDetails);
    await page.close();
  } else if (!post.includes(keyword)) {
    completeVerify('fail', verifyDetails, FACEBOOK_ERROR_STATUS.LINK_INVALID);
  } else {
    console.log('user id not found: verify post fail');
    completeVerify('fail', verifyDetails, FACEBOOK_ERROR_STATUS.FACEBOOK_ID_INVALID);
    await page.close();
    throw ({ rejectCode: 1, message: 'user not found' });
  }
}

async function verifyPageFunction(page, post, verifyDetails, keyword, likeItem) {
  if (post.includes(verifyDetails.facebook_id) && post.includes(keyword) && likeItem.includes(decodeURI(verifyDetails.criteria))) {
    console.log(`verify ${verifyDetails.action_name} success`);
    // completeVerify('success', verifyDetails);
    await page.close();
  } else if (post.includes(keyword) == false || likeItem.includes(decodeURI(verifyDetails.criteria)) == false) {
    completeVerify('fail', verifyDetails, FACEBOOK_ERROR_STATUS.LINK_INVALID);
  } else {
    console.log('user id not found: verify fail');
    completeVerify('fail', verifyDetails, FACEBOOK_ERROR_STATUS.FACEBOOK_ID_INVALID);
    await page.close();
    throw ({ rejectCode: 1, message: 'user not found' });
  }
}

async function verifyPageShareFunction(page, dom, verifyDetails, likeItem, shareKeyword, likeKeyword) {
  if (dom.includes(verifyDetails.facebook_id) && likeItem.includes(decodeURI(verifyDetails.criteria) && dom.includes(shareKeyword) && !dom.includes(likeKeyword))) {
    console.log(`verify ${verifyDetails.action_name} success`);
    // completeVerify('success', verifyDetails);
    await page.close();
  } else {
    console.log('user id not found: verify fail');
    // completeVerify('fail', verifyDetails);
    await page.close();
    throw ({ rejectCode: 1, message: 'user not found' });
  }
}



module.exports = verifyActivityMobile;