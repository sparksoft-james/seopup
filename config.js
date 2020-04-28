const path = require('path');

module.exports = {
  base_url : 'https://tgp399.com/hu-pan-backend/hupan/public/api',
  launch_options: {
    headless: false,
    args: ['--disable-web-security'],
    // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome'
  },
  viewport_options: {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  },
  pageToGo: 'https://www.facebook.com',
  credential: {
    username: 'james.chin@sparksoft.co',
    pwd: 'sparksoft'
  }
}