const path = require('path');
const fs = require('fs');
const pathToRegexp = require('path-to-regexp');
const options = require('./config.js') || {};
const { randGenNumber } = require('./libs/utils');

async function login(page, credential) {
  console.log('browsing to https://www.facebook.com/...');
  await page.goto('https://facebook.com/');
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
