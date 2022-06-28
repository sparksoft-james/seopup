const puppeteer = require("puppeteer-extra");
require("dotenv").config();

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const { delay } = require("./libs/utils");
const axios = require("axios");

// const base_url = options.base_url;

(async () => {
  // call api for get data
  const searchQuery = [
    "time coverage",
    "time fibre coverage",
    "apply time internet",
  ];
  // const searchQuery = "time fibre coverage";
  console.log(
    "random searchQuery",
    searchQuery[Math.floor(Math.random() * searchQuery.length)]
  );

  // calling the api from backend
  let loop = 0;
  let completed = true;
  const targetLink = "https://timeinternet.my";

  do {
    // const options = require("./config.js") || {};
    const vpnpool = [
      // "https://my46.nordvpn.com:89",
      "https://my47.nordvpn.com:89",
      // "https://my37.nordvpn.com:89",
      // "https://my48.nordvpn.com:89",
      "https://my41.nordvpn.com:89",
      "https://my45.nordvpn.com:89",
      "https://my38.nordvpn.com:89",
      // "https://my39.nordvpn.com:89",
    ];

    const chosenVpn = vpnpool[Math.floor(Math.random() * vpnpool.length)];

    console.log("chosen vpn:", chosenVpn);
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--incognito",
        "--disable-gpu",
        `-proxy-server=${chosenVpn}`,
      ],
      // args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito', "--disable-gpu", `--proxy-server=zproxy.lum-superproxy.io:22225`],
      executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome",
    });

    const [page] = await browser.pages();

    await page.authenticate({
      username: "matt.muir@me.com",
      password: "6617Kennedy!",
    });

    try {
      await page.goto("https://www.google.com/", {
        waitUntil: "domcontentloaded",
      });
    } catch (e) {
      console.log("keep process");
      continue; 
    }

    try {
      await page.waitForSelector("#L2AGLb", { timeout: 5000 });
      page.$eval("#L2AGLb", (btn) => btn.click());
    } catch (e) {
      console.log("keep process");
    }
    await page.waitForSelector('input[aria-label="Search"]', {
      visible: true,
    });

    await page.type(
      'input[aria-label="Search"]',
      searchQuery[Math.floor(Math.random() * searchQuery.length)]
    );
    // await page.type('input[aria-label="Search"]', searchQuery);
    await Promise.all([page.waitForNavigation(), page.keyboard.press("Enter")]);
    await delay(3000);
    // await page.solveRecaptchas();

    try {
      let bodyHTML = await page.evaluate(
        () => document.documentElement.outerHTML
      );
      // const link = await page.evaluate(body => body.innerHTML.includes(targetLink));

      console.log("evaluate link");

      if (bodyHTML.includes("https://timeinternet.my")) {
        await page.$$eval(
          ".LC20lb",
          (els) =>
            els
              .find((e) =>
                e.parentNode.href.includes("https://timeinternet.my")
              )
              .click()
          // { timeout: 5000 }
        );
      } else {
        for (i = 0; i < 4; i++) {
          page.$eval(
            "#pnnext",
            (btn) => {
              btn.click();
            }
            // { timeout: 5000 }
          );
          console.log("clicked next page");
          await delay(2000);
          let bodyHTMLNextPage = await page.evaluate(
            () => document.documentElement.outerHTML
          );
          await delay(2000);
          console.log("evaluate finsih");
          if (bodyHTMLNextPage.includes("https://timeinternet.my")) {
            console.log("find target link");
            await page.$$eval(
              ".LC20lb",
              (els) =>
                els
                  .find((e) =>
                    e.parentNode.href.includes("https://timeinternet.my")
                  )
                  .click(),
              { timeout: 5000 }
            );

            await delay(2000);

            break;
          }
        }
      }
    } catch (e) {
      console.log("exception", e);
    }

    await delay(5000);
    browser.close();
    // process.exit();
  } while (true);
})();
