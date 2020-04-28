const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const options = require('./config.js') || {};
const { delay, initPage, rejectVerify, changeVPN } = require('./libs/utils');
const axios = require('axios');
const login = require('./login');
const verifyComment = require('./verifyComment');
const verifyLike = require('./verfiyLike');

const base_url = options.base_url;

(async () => {
  // data list
  const verifyData = [
    // jj lin post --> play on fest
    {
      user_id: 13,
      sub_id: 1,
      post_id: '10157236421491485',
      action_name: 'facebook_like',
      username: '100023556156309'
    },
    // jchou post --> zhou you ji
    {
      user_id: 13,
      sub_id: 1,
      post_id: '10159449649268976',
      action_name: 'facebook_like',
      username: '100028429980340'
    },
    // obama post --> hills
    {
      user_id: 13,
      sub_id: 1,
      post_id: '10157671215226749',
      action_name: 'facebook_like',
      username: 'kimario.temba'
    },
    // gem post --> new pet
    {
      user_id: 13,
      sub_id: 1,
      post_id: '10159820668856038',
      action_name: 'facebook_like',
      username: 'suiyi.shum'
    },
    // happy2u --> dalgona shoes
    {
      user_id: 13,
      sub_id: 1,
      post_id: '2939039776142289',
      action_name: 'facebook_like',
      username: 'NFA7397'
    },
    // exo --> lucky seven
    {
      user_id: 13,
      sub_id: 1,
      post_id: '3408192165875520',
      action_name: 'facebook_like',
      username: '100049251972716'
    },
  ];
  // call api
  // async function getVerifyData() {
  //   return new Promise((resolve, reject) => {
  //     const payload = { device_name: 'puppet_1' };
  //     axios.post(base_url + '/lua/weibo_calling', payload)
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

  const browser = await puppeteer.launch({
    ...options.launch_options
  });

  console.log('initializing...');
  let page = await initPage(browser, false, true);
  let pass = false;
  await login(page);
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
  let i = 0;
  do {
    console.log('start new verification process...');

    console.log(verifyData[i]);
    if (verifyData[i].action_name === 'facebook_comment') {
      try {
        console.log('starting verify comment');
        await verifyComment(browser, verifyData[i]);
        i++;

        completed = true;
      } catch (e) {
        if (e && e.rejectCode === 1) {
          console.log('---------------------');
          console.log(e.message);
          console.log('---------------------');
          // await rejectVerify(verifyData);
          completed = true;
        } else {
          console.log('ERROR', e);
          console.error('retrying verifyComment...');
          completed = false;
        }
      }
    } else if (verifyData[i].action_name === 'facebook_like') {
      try {
        console.log('starting verify like');
        await verifyLike(browser, verifyData[i]);
        console.log('end verify like');
        completed = true;

      } catch (e) {
        if (e && e.rejectCode === 1) {
          console.log('---------------------');
          console.log(e.message);
          console.log('---------------------');
          // await rejectVerify(verifyData);
          completed = true;
        } else {
          console.log('ERROR', e);
          console.error('retrying verifyLike...');
          completed = false;
        }
      }
    }
  } while (i === verifyData.length - 1);
})();