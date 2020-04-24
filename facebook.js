const puppeteer = require('puppeteer');
const options = require('./config.js') || {};
const { delay, initPage, rejectVerify } = require('./libs/utils');
const axios = require('axios');
const login = require('./login');
const verifyComment = require('./verifyComment');
const verifyLike = require('./verfiyLike');

const base_url = options.base_url;

(async () => {
  //
  const verifyDetails = {
    user_id: 13,
    sub_id: 1,
    post_id: 10157176632651485,
    action_name: 'facebook_like',
    username: 'Pearly Lam'
  };


  async function getVerifyData() {
    return new Promise((resolve, reject) => {
      const payload = { device_name: 'puppet_1' };
      axios.post(base_url + '/lua/weibo_calling', payload)
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
  await login(page, options.credential);
  pass = true;

  // relogin function;
  // do {
  //   try {
  //     await login(page, options.credential);
  //     pass = true;
  //   } catch (e) {
  //     console.log('ERROR', e);
  //     console.log('');
  //     console.error('login failed');
  //     console.error('retrying login...');
  //     pass = false;
  //   }
  // }
  // while (!pass);

  // calling the api from backend
  // const loop = false;
  // let completed = true;
  // await getVerifyData();
  // do {
  //   if (completed) {
  //     if (verifyDetails === 'no task') {
  //       // await delay(60000);
  //       await getVerifyData();
  //     } else {
  //       // await delay(60000);
  //       await getVerifyData();
  //     }
  //   }
  // }
  // while (!loop);

  if (verifyDetails.action_name === 'facebook_comment') {
    try { 
      console.log('starting verify comment');
      await verifyComment(browser, verifyDetails);
      completed = true;
    } catch (e) {
      if (e && e.rejectCode === 1) {
        console.log('---------------------');
        console.log(e.message);
        console.log('---------------------');
        // await rejectVerify(verifyDetails);
        completed = true;
      } else {
        console.log('ERROR', e);
        console.error('retrying verifyComment...');
        completed = false;
      }
    }
  } else if (verifyDetails.action_name === 'facebook_like') {
    try {
      console.log('starting verify like');
      await verifyLike(browser, verifyDetails);
      completed = true;
    } catch (e) {
      if (e && e.rejectCode === 1) {
        console.log('---------------------');
        console.log(e.message);
        console.log('---------------------');
        // await rejectVerify(verifyDetails);
        completed = true;
      } else {
        console.log('ERROR', e);
        console.error('retrying verifyLike...');
        completed = false;
      }
    }
  }

})();