var testParameters = require("../environment/TestParameters");
const request = require("supertest")(testParameters.mainURL);

var qpayRequests = require("../environment/qpay-request");
var qpayUI = require("../environment/qpay-UI");

describe("Test creates and finalizes a QPay payment", function () {
    this.timeout(20000);
    it("should create and endorse the QPay payment", async function () {
        console.log("Create QPay payment");
        const responseBody = await qpayRequests.createPayment();
        const redirectLink = responseBody._links.redirect.href;
        console.log("Pay ID: " + responseBody.id);
        console.log("Link: " + redirectLink);

        console.log("Endorsement QPay payment");
        await qpayUI.finalizePayment(redirectLink, responseBody.id);
    });
});