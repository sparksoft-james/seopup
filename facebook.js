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
  // call api
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

  const browser = await puppeteer.launch({
    ...options.launch_options
  });

  console.log('initializing...');
  let page = await initPage(browser, false, true);
  let pass = false;
  await login(page);
  pass = true;

  // calling the api from backend
  const loop = false;
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
        console.error(' id not found...');
        completed = true;
      }
    }
  }
  while (!loop);
})();