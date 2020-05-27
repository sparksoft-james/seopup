const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const options = require('./config.js') || {};
const { initPage, delay } = require('./libs/utils');
const axios = require('axios');
const login = require('./login');
const verifyActivity = require('./verifyActivity');
const verifyActivityMobile = require('./verifyActivityMobile');

const base_url = options.base_url;

(async () => {
  // call api for get data
  // let verifyDetails = {}
  // async function getVerifyData() {
  //   return new Promise((resolve, reject) => {
  //     const payload = { device_name: 'facebook_1' };
  //     axios.post(base_url + '/lua/facebook_calling', payload)
  //       .then((response) => {
  //         verifyDetails = response.data;
  //         console.log(verifyDetails);
  //         resolve();
  //       })
  //       .catch((error) => {
  //         // handle error
  //         console.log(error);
  //         reject();
  //       })
  //   })
  // }
  let verifyDetails = {
    user_id: 501,
    sub_id: 39,
    action_link: 'https://www.facebook.com/profile.php?id=100023973350933&lst=100023973350933%3A100023973350933%3A1590548381&sk=about',
    facebook_id: '100023973350933',
    action_name: 'page_like',
    criteria: 'Ki%E1%BA%BFm-Ti%E1%BB%81n-3s-106156554366493'
  }
  // fire api for fail
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

  const browser = await puppeteer.launch({
    ...options.launch_options
  });

  console.log('initializing...');
  let page = await initPage(browser, false, true);
  let pass = false;
  await login(page);
  pass = true;

  // calling the api from backend
  let loop = 0;
  let completed = true;

  do {
    if (completed) {
      if (verifyDetails === 'no task') {
        await delay(60000);
        await getVerifyData();
      } else {
        await delay(3000);
        await getVerifyData();
      }
    }

    await delay(4000);
    if (verifyDetails !== 'no task') {
      try {
        console.log('starting verify activity process');
        if (!verifyDetails.action_link.includes('m.facebook.com')) {
          console.log('the link is desktop version, change to m.facebook');
          verifyDetails.action_link = verifyDetails.action_link.replace('www.facebook.com', 'm.facebook.com');
          console.log('action_link:', verifyDetails.action_link);
        }

        await verifyActivityMobile(browser, verifyDetails);
        console.log('complete verify activity process');
        completed = true;
      } catch (e) {
        console.log('ERROR', e);
        console.error(' action link not found...');
        await completeVerify('fail', verifyDetails);
        completed = true;
      }
    }
    loop++
  }
  while (loop < 10);
})();