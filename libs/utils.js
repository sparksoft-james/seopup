const options = require('../config.js') || {};

function delay(time) {
  if (isNaN(time)) time = 0;
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function initPage(browser, acceptCss, acceptImg) {
  const page = await browser.newPage();
  page.setDefaultTimeout(240000);
  await page.setViewport({
    ...options.viewport_options,
  });
  console.log('reset viewport completed');
  // to abort image and css request
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if ((acceptCss ? '' : req.resourceType() == 'stylesheet') || req.resourceType() == 'font' || (acceptImg ? '' : req.resourceType() === 'image')) {
      req.abort();
    }
    else if (req._headers.referer === 'https://www.weibo.com/sorry?pagenotfound') {
      throw ({
        rejectCode: 1,
        message: 'Reject to verify follow'
      });
      // await rejectVerify(verifyDetails);
    }
    else {
      req.continue();
    }
  });
  return page;
}
async function rejectVerify(payload) {
  console.log('#### firing reject...');
  return new Promise(function (resolve, reject) {
    const obj = { user_id: payload.user_id, sub_id: payload.sub_id };
    axios.post(options.base_url + '/main-mission/reject', obj)
      .then(function (response) {
        console.log('success rejected: ', response.data);
        resolve();
      })
      .catch(function (error) {
        console.log('failed to reject: ', error);
        reject();
      })
  })
}

function randGenNumber() {
  return Math.floor(Math.random() * 300) + 100;
}

async function waitToInput(page, selector, inputVal) {
  console.log(selector, inputVal);
  await setTimeout(function () { page.$eval(selector, (el, value) => { el.value = value }, inputVal) }, randGenNumber());
}

async function waitToClick(page, url) {
  await setTimeout(function () { page.goto(url); }, randGenNumber());
}

async function waitToGo(page, url) {
  await setTimeout(function () { page.goto(url); }, randGenNumber());
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getStringFromLastSlash(string) {
  return /[^/]*$/.exec(string)[0].replace('?fref=pb','');
}

module.exports = {
  initPage,
  rejectVerify,
  delay,
  randGenNumber,
  waitToInput,
  waitToClick,
  waitToGo,
  getParameterByName,
  getRandomArbitrary,
  getStringFromLastSlash
}