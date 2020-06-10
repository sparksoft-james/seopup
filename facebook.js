const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const options = require('./config.js') || {};
const { initPage, delay } = require('./libs/utils');
const axios = require('axios');
// const login = require('./login');
const verifyActivityMobile = require('./verifyActivityMobile');

const base_url = options.base_url;

(async () => {
  // call api for get data
  // let verifyDetails = {
  //   user_id: 13,
  //   sub_id: 1,
  //   action_name: 'page_share',
  //   action_link: 'https://www.facebook.com/waffle.jam.773/posts/137084427966555',
  //   criteria: 'najibrazak',
  //   facebook_id:'100049949943171',
  //   keyword:"wow",
  //   tag_count: 3
  // }

  let verifyDetails = {}

  async function getVerifyData() {
    return new Promise((resolve, reject) => {
      const payload = { device_name: 'facebook_1' };
      axios.post(base_url + '/lua/facebook_calling', payload)
        .then((response) => {
          verifyDetails = response.data;
          console.log(verifyDetails);
          resolve();
        })
        .catch((error) => {
          // handle error
          console.log(error);
          reject();
        })
    })
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

    await delay(2000);
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
        // await completeVerify('fail', verifyDetails);
        completed = true;
      }
    }
    loop++
  }
  while (true);
})();