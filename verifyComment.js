const { initPage } = require('./libs/utils');

async function verifyComment(browser, verifyDetails) {
  const page = await initPage(browser, true);
  try {
    await page.goto(`https://www.facebook.com/${verifyDetails.post_id}`);
    console.log('successful onboard verify comment page')
    await page.waitForSelector("._7791");
    console.log('successful found comment');

    const comments = await page.$$eval('._6qw4', comments => comments.map(element => element.innerHTML.trim()));
    console.log(comments);
    const findComment = comments.find(comment => comment === verifyDetails.username);

    if (findComment) {
      console.log('comment find success')
    } else {
      console.log('cannot find comment')
    }

  } catch (e) {
    throw (e);
  }
}

module.exports = verifyComment;