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
  // data list
  const verifyData = [
    // warro like vin diesel
    {
      user_id: 13,
      sub_id: 1,
      action_name: 'like',
      facebook_id: '100050630166518',
      post_id: '10158513238923313',
      action_link: 'https://www.facebook.com/warro.mario.9/posts/107890880908584:6'
    },
    // // waffle jam like (happy post)
    {
      user_id: 13,
      sub_id: 1,
      action_name: 'like',
      facebook_id: '100049949943171',
      post_id: '2939039776142289',
      action_link: 'https://www.facebook.com/waffle.jam.773/posts/118795473128784:3'
    },
    //  waffle jam comment (happy post)
    {
      user_id: 13,
      sub_id: 1,
      action_name: 'comment',
      facebook_id: '100049949943171',
      action_link: 'https://www.facebook.com/waffle.jam.773/posts/2955944024451864:0'
    },
    // // waffle penault like gem post
    {
      user_id: 13,
      sub_id: 1,
      action_name: 'like',
      facebook_id: '100050514467209',
      action_link: 'https://www.facebook.com/waffle.penaut.1/posts/112528420440973:2'
    },
    // waffle penault comment gem post
    {
      user_id: 13,
      sub_id: 1,
      action_name: 'comment',
      facebook_id: '100050514467209',
      action_link: 'https://www.facebook.com/waffle.jam.773/posts/2955944024451864:0'
    },
    // waffle penault share gem post
    {
      user_id: 13,
      sub_id: 1,
      action_name: 'share',
      facebook_id: '100050514467209',
      action_link: 'https://www.facebook.com/waffle.penaut.1/posts/112634920430323'
    },
    // keneedy like vin diesel post
    {
      user_id: 13,
      sub_id: 1,
      action_name: 'like',
      facebook_id: '1133377454',
      action_link: 'https://m.facebook.com/story.php?story_fbid=10220981838792362&substory_index=0&id=1133377454&ref=bookmarks'
    },
    // waffle jam like vin diesel post
    {
      user_id: 13,
      sub_id: 1,
      action_name: 'like',
      facebook_id: '100049949942171',
      post_id: '10158513238923313',
      action_link: 'https://m.facebook.com/story.php?story_fbid=118795473128784&substory_index=0&id=100049949943171&ref=bookmarks'
    },
    //  waffle jam comment vin diesel post
    {
      user_id: 13,
      sub_id: 1,
      action_name: 'comment',
      facebook_id: '100049949943171',
      post_id: '10158513238923313',
      action_link: 'https://m.facebook.com/story.php?story_fbid=2955944024451864&substory_index=1&id=100049949943171&ref=bookmarks'
    },
    //  waffle jam share vin diesel post
    {
      user_id: 13,
      sub_id: 1,
      action_name: 'share',
      facebook_id: '100049949943171',
      post_id: '10158513238923313',
      action_link: 'https://m.facebook.com/story.php?story_fbid=119109453097386&id=100049949943171&ref=bookmarks'
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
    await delay(4000);
    console.log('this is ', i + 1, 'times');
    console.log('start new verification process...');
    console.log(verifyData[i]);
    try {
      console.log('starting verify activity process');
      if (!verifyData[i].action_link.includes('m.facebook.com')) {
        console.log('the link is desktop version, change to m.facebook');
        verifyData[i].action_link = verifyData[i].action_link.replace('www.facebook.com', 'm.facebook.com');
        console.log('action_link:', verifyData[i].action_link);
      }

      await verifyActivityMobile(browser, verifyData[i]);
      console.log('complete verify activity process');

    } catch (e) {
      if (e && e.rejectCode === 1) {
        console.log('---------------------');
        console.log(e.message);
        console.log('---------------------');
        // await rejectVerify(verifyData);
        completed = true;
      } else {
        console.log('ERROR', e);
        console.error(' id not found...');
        completed = false;
      }
    }
    i++;
  } while (i < verifyData.length);
})();