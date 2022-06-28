const path = require("path");
require("dotenv").config();

const base_url = process.env.BASE_URL;

const vpnpool = ["https://my46.nordvpn.com:89","https://my47.nordvpn.com:89","https://my37.nordvpn.com:89","https://my48.nordvpn.com:89","https://my41.nordvpn.com:89","https://my45.nordvpn.com:89","https://my38.nordvpn.com:89","https://my39.nordvpn.com:89"];

const chosenVpn = vpnpool[Math.floor(Math.random() * vpnpool.length)];

console.log('chosen vpn:', chosenVpn);

module.exports = {
  base_url: "https://api.luca4u.com/hu-pan-backend/hupan/public/api",
  launch_options: {
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--incognito",
      "--disable-gpu",
      `-proxy-server=${chosenVpn}`
    ],
    // args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito', "--disable-gpu", `--proxy-server=zproxy.lum-superproxy.io:22225`],
    executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome'
  },
  viewport_options: {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  },
  pageToGo: "https://www.facebook.com",
  credential: [
    {
      username: "james.chin@sparksoft.co",
      pwd: "sparksoft",
    },
    {
      username: "jameschin3498@gmail.com",
      pwd: "sparksoft",
    },
    {
      username: "jameschin5131@gmail.com",
      pwd: "sparksoft",
    },
    {
      username: "sparks0531@gmail.com",
      pwd: "sparksoft",
    },
  ],
};
