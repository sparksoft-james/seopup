const path = require('path');
const fs = require('fs');
const pathToRegexp = require('path-to-regexp');
const options = require('./config.js') || {};
const { getRandomArbitrary } = require('./libs/utils');


async function login(page) {
  // random choose account to login
  const ranNum = getRandomArbitrary(0, 3);
  console.log('using account:', ranNum);
  const credential = options.credential[ranNum];

  console.log('browsing to https://www.facebook.com/...');
  await page.goto('https://facebook.com/', {waitUntil: 'load', timeout: 0});

  page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  await page.$eval('#email', (el, value) => { el.value = value }, credential.username);
  await page.$eval('#pass', (el, value) => { el.value = value }, credential.pwd);
  console.log('credential input completed');

  await Promise.all([
    page.$eval('#loginbutton', btn => btn.click()),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);
  
  console.log('login success');
}

module.exports = login;
