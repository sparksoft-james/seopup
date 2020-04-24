const path = require('path');
const fs = require('fs');
const pathToRegexp = require('path-to-regexp');
const options = require('./config.js') || {};
const { waitToInput } = require('./libs/utils');

async function login(page, credential) {
  console.log('browsing to https://www.facebook.com/...');
  await page.goto('https://mbasic.facebook.com/');
  page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  // --- for m. --- //
  await waitToInput(page, '#m_login_email', credential.username);
  await waitToInput(page, '.bo', credential.pwd);
  // await page.$eval('#m_login_email', (el, value) => { el.value = value }, credential.username);
  // await page.$eval('.bo', (el, value) => { el.value = value }, credential.pwd);
  console.log('credential input completed');

  await Promise.all([
    page.$eval('.br', btn => btn.click()),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);


  console.log('login button clicked');

  await page.$eval('.bp', btn => btn.click()),

    console.log('login completed');

  // const cookies = await page.cookies();
}

module.exports = login;
