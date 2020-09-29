const puppeteer = require('puppeteer-extra');
require('dotenv').config();

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const options = require('./config.js') || {};
const { initPage, delay } = require('./libs/utils');
const axios = require('axios');
// const login = require('./login');
const verifyActivityMobile = require('./verifyActivityMobile');
const verifyActivityWeb = require('./verifyActivityWeb');

const base_url = options.base_url;
const facebook_error_status = options.FACEBOOK_ERROR_STATUS;

const device_name = process.env.DEVICE_NAME;

console.log('device_name:', device_name);

const device_name = process.env.DEVICE_NAME;

(async () => {
  // call api for get data
  let verifyDetails = {
    user_id: 13,
    sub_id: 1,
    action_name: 'post_share',
    action_link: 'https://m.facebook.com/james.chin0531/posts/1178389305875668 ',
    criteria: '3195373690511802',
    facebook_id:'100011138286242',
  }

  // let verifyDetails = {}

  async function getVerifyData() {
    return new Promise((resolve, reject) => {
      const payload = { device_name };
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
  async function completeVerify(status, payload, $errorMessage = '') {
    return new Promise(function (resolve, reject) {
      const apiKey = status === 'success' ? 'deviceComplete' : 'reject'
      const obj = { user_id: payload.user_id, sub_id: payload.sub_id, error_msg: $errorMessage };
      console.log(obj)
      axios.post(base_url + `/main-mission/${apiKey}`, obj)
        .then(function (response) {
          console.log('response.data');
          console.log(response.data);
          resolve();
        })
        .catch(function (error) {
          // handle error
          console.log('error');
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
    // if (completed) {
    //   if (verifyDetails === 'no task') {
    //     await delay(60000);
    //     await getVerifyData();
    //   } else {
    //     await delay(3000);
    //     await getVerifyData();
    //   }
    // }

    await delay(2000);
    if (verifyDetails !== 'no task') {
      try {
        
        console.log('starting verify activity process');
        console.log(verifyDetails.action_link);

        if(verifyDetails.action_link.includes('facebook')) {
          if (!verifyDetails.action_link.includes('m.facebook.com')) {
            console.log('desktop version link');
            await verifyActivityWeb(browser, verifyDetails);
          } else {
            console.log('mobile version link change to web version');
            verifyDetails.action_link = verifyDetails.action_link.replace('m.facebook.com', 'www.facebook.com');
            await verifyActivityWeb(browser, verifyDetails);
            // await verifyActivityMobile(browser, verifyDetails);
          }
          console.log('complete verify activity process');
          // completed = true;
        } else {
          console.log('fail verify activity process ERROR');

          await completeVerify('fail', verifyDetails, facebook_error_status.LINK_INVALID);
        
        } 
      } catch (e) {
        console.log('ERROR', e);
        await completeVerify('fail', verifyDetails, facebook_error_status.INTERNAL_ERROR);
        completed = true;
      }
    } 
    loop++
  }
  while (loop < 10);
  process.exit();
})();