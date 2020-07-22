const path = require('path');

const FACEBOOK_ERROR_STATUS = {
  LINK_INVALID: "link_invalid",
  FACEBOOK_ID_INVALID: "facebook_id_invalid",
  TAG_KEYWORD_INVALID: "tag_or_keyword_invalid",
  INTERNAL_ERROR: "internal_error",
};

module.exports = {
  FACEBOOK_ERROR_STATUS,
  base_url: 'https://api.luca4u.com/hu-pan-backend/hupan/public/api',
  launch_options: {
    headless: true,
    args: ['--disable-web-security', '--no-sandbox'],
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