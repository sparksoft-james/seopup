const { initPage, waitToGo, getParameterByName, delay, getRandomArbitrary, getStringFromLastSlash } = require('./libs/utils');

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
    // page.$eval(selector, pageFunction[, ...args])
    // pageFunction <function(Element)> Function to be evaluated in browser context

    // for (i = 0; i < 1000; i++) {
    //   const randDelayTime = getRandomArbitrary(10000, 12000);
    //   console.log("randDelayTime:", randDelayTime)
    //   await delay(randDelayTime);
    //   try {
    //     await page.$eval('#reaction_profile_pager a[href].uiMorePagerPrimary', btn => btn.click());
    //     console.log('button click times...' + i);
    //   } catch {
    //     console.log('no more see more');
    //     break;
    //   }
    // }

    const seeMoreButtonSelector = '#reaction_profile_pager a[href].uiMorePagerPrimary';

    let i = 1;
    do {
      await page.waitForSelector(seeMoreButtonSelector);
      console.log('see more button render');

      console.log('crawl time:', i);

      const elements = await page.evaluateHandle(() => {
        return Array.from(document.getElementsByTagName('a')).map(a => a.href.match(/^https:\/\/(.*fref=pb)/gm)).filter(val => !!val).map(user => user[0]);
      });

      const listOfUser = await elements.jsonValue();

      const removeDuplicate = listOfUser.filter((val, index, self) => index == self.indexOf(val));


      const userList = removeDuplicate.map((val) => {
        return getParameterByName('id', val) || getStringFromLastSlash(val);
      });

      // console.log(userList.slice(userList.length - 50));
      console.log(userList);

      if (userList.includes(verifyDetails.username)) {
        console.log('user found')
        break;
      } else {
        const randDelayTime = getRandomArbitrary(10000, 12000);
        await delay(randDelayTime);

        await page.$eval(seeMoreButtonSelector, (btn) => btn.click());
        i++;
      }

    } while (await page.$(seeMoreButtonSelector) !== null);

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