const path = require('path');

module.exports = {
  base_url: 'https://tgp399.com/hu-pan-backend/hupan/public/api',
  launch_options: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito', "--disable-gpu", `--proxy-server=zproxy.lum-superproxy.io:22225`],
    // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome'
  },
  viewport_options: {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  },
  pageToGo: 'https://www.facebook.com',
  credential: [
    {
      username: 'james.chin@sparksoft.co',
      pwd: 'sparksoft'
    },
    {
      username: 'jameschin3498@gmail.com',
      pwd: 'sparksoft'
    },
    {
      username: 'jameschin5131@gmail.com',
      pwd: 'sparksoft'
    },
    {
      username: 'sparks0531@gmail.com',
      pwd: 'sparksoft'
    }
  ]
}