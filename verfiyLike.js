const { initPage, waitToGo } = require('./libs/utils');

async function verifyLike(browser, verifyDetails) {
  const page = await initPage(browser, true);
  try {
    // go to the page 
    const url = `https://mbasic.facebook.com/${verifyDetails.post_id}`;
    waitToGo(page, url)

    // click on the like button
    await page.$eval('.di', btn => btn.click());

    const hrefs1 = await page.evaluate(
      () => Array.from(
        document.querySelectorAll('.bt a[href]'),
        a => a.getAttribute('href')
      )
    );

    console.log('the link:', hrefs1)

    // console.log(page.url());

    const limit = 1000;
    const total_count = 1000;

    const url = ` https://mbasic.facebook.com/ufi/reaction/profile/browser/fetch/?limit=10000&total_count=15000&ft_ent_identifier=`;
    await page.goto(`https://www.facebook.com/${verifyDetails.post_id}`);


    console.log('successful onboard verify comment page')
    await page.waitForSelector("._81hb");
    console.log('successful found post like button');

    page.$eval('._81hb', btn => btn.click());

    await page.waitForSelector("._5j0e");

    const likes = await page.$$eval('._5j0e > a', likes => likes.map(element => element.innerHTML.trim()));

    console.log(likes);

  } catch (e) {
    throw (e);
  }
}

module.exports = verifyLike;