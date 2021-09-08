const puppeteer = require('puppeteer');
var qpayRequests = require("../environment/qpay-request");
var testParameters = require("../environment/TestParameters");

module.exports = {
    finalizePayment: async function(redirectLink, id){
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

            console.log("Checking QPay payment is captured");
            await qpayRequests.getPaymentDetails(id);
        })();
    }
};