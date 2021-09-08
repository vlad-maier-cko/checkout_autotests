var testParameters = require("../environment/TestParameters");
const request = require("supertest")(testParameters.mainURL);
const expect = require("chai").expect;
const puppeteer = require('puppeteer');

var qpayRequests = require("../environment/qpay-request");

describe("Test creates and finalizes a QPay payment", function () {
    this.timeout(20000);
    it("should create and endorse the QPay payment", async function () {
        console.log("Create QPay payment");
        const redirectLink = await qpayRequests.createPayment();

        console.log("Link: "+redirectLink);

        console.log("Endorsement QPay payment");
        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(redirectLink);

            await page.waitForNavigation();

            await page.type("#cardNumber", testParameters.cardNumber);
            page.select('select[name="expiryDatemm"]', testParameters.cardMonth);
            page.select('select[name="expiryDateyy"]', testParameters.cardYear);
            page.click('input[name="btnSubmit"]');

            await page.waitForNavigation();

            for(var i=0; i<4; i++)
                await page.mouse.click(500, 200);
            page.click("#pay");

            await page.waitForNavigation();

            page.click('input[name="Continue"]');

            await page.waitForNavigation();
            await page.waitForNavigation();

            await browser.close();
          })();
    });
});