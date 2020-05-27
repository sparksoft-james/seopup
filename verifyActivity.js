const { initPage } = require('./libs/utils');

async function verifyActivity(browser, verifyDetails, version) {
  const page = await initPage(browser, true);
  try {
    await page.goto(verifyDetails.action_link, {waitUntil: 'load', timeout: 0});

    console.log('successful onboard verify activity page');

    console.log('start verify desktop version data');

    const post = await page.$eval('.profileLink', el => el.getAttribute('data-hovercard'));

    if (post.includes(verifyDetails.facebook_id)) {
      console.log('user id found: verify success');
      page.close();
      return;
    } else {
      console.log('user id not found');
      return;
    }
  } catch (e) {
    throw (e);
  }
}

module.exports = verifyActivity;