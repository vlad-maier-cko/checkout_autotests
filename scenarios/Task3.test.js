var testParameters = require("../environment/TestParameters");
const request = require("supertest")(testParameters.mainURL);
const expect = require("chai").expect;

var fawryRequests = require("../environment/fawry-requests");

var payment_id = null;
var reference_number = null;

describe("Test a different flow of refunding a payment with the Fawry payment method", function () {
  this.timeout(20000);
  function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
  
  it("tries to refund a pending and canceled payment", async function () {
    payment_id = await fawryRequests.createPayment();
    //console.log("Payment ID: "+payment_id);

    await Sleep(10000);

    console.log("Check to refund the pending payment");

    const response = await request
    .post( "/payments/"+payment_id+"/refunds" )
    .set({ "Authorization": testParameters.authorization });

    expect(response.status).to.eql(403);

    reference_number = await fawryRequests.getPaymentDetails(payment_id);
    //console.log("Ref number: "+reference_number);

    console.log("Check to refund the canceled payment");
    await fawryRequests.approve_cancelPayment(reference_number, "/cancellation")

    const response1 = await request
    .post( "/payments/"+payment_id+"/refunds" )
    .set({ "Authorization": testParameters.authorization });

    expect(response1.status).to.eql(403);
  });

 it("tries to refund more amount than it is and normal refunding", async function () {
    payment_id = await fawryRequests.createPayment();
    //console.log("Payment ID: "+payment_id);
    reference_number = await fawryRequests.getPaymentDetails(payment_id);
    //console.log("Ref number: "+reference_number);
  
    await fawryRequests.approve_cancelPayment(reference_number, "/approval");

    console.log("Check to refund more amount than it is");
    await fawryRequests.refund_Payment(payment_id, testParameters.paymentBody.amount+1, false);

    console.log("Check to refund the payment");
    await fawryRequests.refund_allPayment(payment_id);
  });
});