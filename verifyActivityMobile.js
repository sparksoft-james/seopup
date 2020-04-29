const { initPage } = require('./libs/utils');

async function verifyActivityMobile(browser, verifyDetails) {
  const page = await initPage(browser, true);
  try {
    console.log(verifyDetails.action_link);
    await page.goto(verifyDetails.action_link);

    console.log('successful onboard verify activity page');

    console.log('start verify mobile version data');

    if (verifyDetails.action_name == 'like' || verifyDetails.action_name == 'comment') {

      const post = await page.$eval('article', el => el.getAttribute('data-store'));

      if (verifyDetails.action_name == 'like') {
        console.log('start verify like action');
        verifyFunction(page, post, verifyDetails, 'EntLikeEdgeStory');
      } else if (verifyDetails.action_name == 'comment') {
        console.log('start verify like comment');
        await verifyFunction(page, post, verifyDetails, 'EntCommentNodeBasedEdgeStory');
      }
    } else if (verifyDetails.action_name == 'share') {
      console.log('start verify share');
      const post = await page.$eval('.async_like', el => el.getAttribute('data-store'));
      await verifyFunction(page, post, verifyDetails, 'EntStatusCreationStory');
    }
  } catch (e) {
    throw (e);
  }
}

async function verifyFunction(page, post, verifyDetails, keyword) {
  if (post.includes(verifyDetails.facebook_id) && post.includes(verifyDetails.post_id) && post.includes(keyword)) {
    console.log('verify success');
    await page.close();
  } else {
    console.log('user id not found: verify fail');
    await page.close();
    throw ({ rejectCode: 1, message: 'user not found' });
  }
}

module.exports = verifyActivityMobile;