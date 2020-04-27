const { initPage, waitToGo, getParameterByName, delay, getRandomArbitrary } = require('./libs/utils');

async function verifyLike(browser, verifyDetails) {
  const page = await initPage(browser, true);

  try {
    // go to the page 
    let url = `https://facebook.com/${verifyDetails.post_id}`;
    await page.goto(url);

    await page.waitForSelector("._3dlf");
    await page.$eval('._3dlf', btn => btn.click());

    // await delay(10000);
    // console.log('delayed');

    await page.waitForSelector("._3qw");
    console.log('element render');

    await page.waitForSelector("#reaction_profile_pager a[href].uiMorePagerPrimary");
    console.log('see more button render');

    // page.$eval(selector, pageFunction[, ...args])
    // pageFunction <function(Element)> Function to be evaluated in browser context

    for (i = 0; i < 1000; i++) {
      const randDelayTime = getRandomArbitrary(10000, 12000);
      console.log("randDelayTime:", randDelayTime)
      await delay(randDelayTime);
      try {
        await page.$eval('#reaction_profile_pager a[href].uiMorePagerPrimary', btn => btn.click());
        console.log('button click times...' + i);
      } catch {
        console.log('no more see more');
        break;
      }
    }

    console.log('loop exit');

    // const selectorForLoadMoreButton = '#reaction_profile_pager a[href].uiMorePagerPrimary';

    // const isElementVisible = async (page, cssSelector) => {
    //   let visible = true;
    //   await page
    //     .waitForSelector(cssSelector, { visible: true, timeout: 2000 })
    //     .catch(() => {
    //       visible = false;
    //     });
    //   return visible;
    // };

    // let loadMoreVisible = await isElementVisible(page, selectorForLoadMoreButton);

    // while (loadMoreVisible) {
    //   await setTimeout(function () {
    //     console.log('loadMoreVisible:', loadMoreVisible);
    //     page.$eval('.uiMorePagerPrimary', btn => btn.click())
    //   }, 3000);

    //   loadMoreVisible = await isElementVisible(page, selectorForLoadMoreButton);
    // };
  } catch (e) {
    throw (e);
  }
}

module.exports = verifyLike;