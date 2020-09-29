const axios = require('axios');

const { initPage } = require('./libs/utils');
const { base_url } = require('./config');

async function completeVerify(status, payload) {
  return new Promise(function (resolve, reject) {

    const apiKey = status === 'success' ? 'deviceComplete' : 'reject'
    const obj = { user_id: payload.user_id, sub_id: payload.sub_id };
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

async function verifyActivityWeb(browser, verifyDetails) {
  const page = await initPage(browser, true);
  try {
    console.log('go to activity link: ', verifyDetails.action_link);

    await page.authenticate({
      username: 'lum-customer-hl_8acf1767-zone-static',
      password: 'gqq6sghvkmlb'
    });

    await page.goto(verifyDetails.action_link, { waitUntil: 'load'});

    console.log('successful onboard verify activity page');

    const dom = await page.$eval('body', el => el.innerHTML);

      if (verifyDetails.action_name == 'post_like' || verifyDetails.action_name == 'post_comment') {
        if (verifyDetails.action_name == 'post_like') {
          console.log('start verify like action');
          verifyPostFunction(page, dom, verifyDetails, 'EntLikeEdgeStory',);
        } else if (verifyDetails.action_name == 'post_comment') {
          console.log('start verify like comment');
          await verifyPostFunction(page, dom, verifyDetails, 'EntCommentNodeBasedEdgeStory');
        }
      } else if (verifyDetails.action_name == 'post_share') {
        console.log('start verify share');
        await verifySharePostFunction(page, dom, verifyDetails, 'EntStatusCreationStory','EntLikeEdgeStory');

      } else if (verifyDetails.action_name == 'page_like') {
        console.log('start verify page like');
        const likeItem = await page.$eval('a[data-sigil=show-save-caret-nux-on-click]', el => el.getAttribute('href'));
        console.log(likeItem)
        await verifyPageFunction(page, dom, verifyDetails, 'EntFanPageEdgeStory', likeItem);

      } else if (verifyDetails.action_name == 'page_share') {
        console.log('start verify page share');
        const likeItem = await page.$eval('a[data-sigil=show-save-caret-nux-on-click]', el => el.getAttribute('href'));
        await verifyPageShareFunction(page, dom, verifyDetails, likeItem , 'EntStatusCreationStory', 'EntLikeEdgeStory');
      }

  } catch (e) {
    console.log('catch error:', e)
    completeVerify('fail', verifyDetails, FACEBOOK_ERROR_STATUS.LINK_INVALID);
    await page.close();
    throw (e);
  }
}

// include 3 things (user facebook_id, post id, keyword)
// keyword type: EntLikeEdgeStory (post_like), EntCommentNodeBasedEdgeStory (post_comment), EntStatusCreationStory (post_share, page_share), EntFanPageEdgeStory (page_like)

async function verifyPostFunction(page, post, verifyDetails, keyword) {
  if (post.includes(verifyDetails.facebook_id) && post.includes(keyword) && post.includes(verifyDetails.criteria)) {
    console.log('verify post success');
    completeVerify('success', verifyDetails);
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

async function verifySharePostFunction(page, post, verifyDetails, shareKeyword, likeKeyword) {
  // include 3 item and not include like item
  if (post.includes(verifyDetails.facebook_id) && post.includes(verifyDetails.criteria) && post.includes(shareKeyword) && !post.includes(likeKeyword)) {
    console.log('verify post success');
    completeVerify('success', verifyDetails);
    await page.close();
  } else if (!post.includes(shareKeyword) || post.includes(likeKeyword)) {
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
    completeVerify('success', verifyDetails);
    await page.close();
  } else if (post.includes(keyword) == false) {
    completeVerify('fail', verifyDetails, FACEBOOK_ERROR_STATUS.LINK_INVALID);
  } else {
    console.log('user id not found: verify fail');
    completeVerify('fail', verifyDetails, FACEBOOK_ERROR_STATUS.FACEBOOK_ID_INVALID);
    await page.close();
    throw ({ rejectCode: 1, message: 'user not found' });
  }
}

async function verifyPageShareFunction(page, post, verifyDetails, likeItem, shareKeyword, likeKeyword) {
  if (dom.includes(verifyDetails.facebook_id) && likeItem.includes(decodeURI(verifyDetails.criteria) && dom.includes(shareKeyword) && !dom.includes(likeKeyword))) {
    console.log(`verify ${verifyDetails.action_name} success`);
    completeVerify('success', verifyDetails);
    await page.close();
  } else if (!post.includes(shareKeyword) || post.includes(likeKeyword)) {
    completeVerify('fail', verifyDetails, FACEBOOK_ERROR_STATUS.LINK_INVALID);
  } else {
    console.log('user id not found: verify fail');
    completeVerify('fail', verifyDetails, FACEBOOK_ERROR_STATUS.FACEBOOK_ID_INVALID);
    await page.close();
    throw ({ rejectCode: 1, message: 'user not found' });
  }
}

module.exports = verifyActivityWeb;