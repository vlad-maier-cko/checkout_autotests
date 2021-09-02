var testParameters = require("../environment/TestParameters");
const request = require("supertest")(testParameters.mainURL);
const expect = require("chai").expect;

var fawryRequests = require("../environment/FawryRequests");

var payment_id = null;
var reference_number = null;

describe("Test a different flow of refunding a payment with the Fawry payment method", function () {
  it("tries to refund a pending and canceled payment", async function () {
    payment_id = await fawryRequests.createPayment();
    console.log("Payment ID: "+payment_id);

    console.log("Check to refund the pending payment");

    request
    .post( "/payments/"+payment_id+"/refunds" )
    .set({ "Authorization": testParameters.authorization })
    .expect(403);

    reference_number = await fawryRequests.getPaymentDetails(payment_id);
    console.log("Ref number: "+reference_number);

    console.log("Check to refund the canceled payment");
    const response1 = await request
    .put("/fawry/payments/"+reference_number+"/cancellation")
    .set({ "Authorization": testParameters.authorization, "Content-Type": testParameters.contentType });

    expect(response1.status).to.eql(200);

    request
    .post( "/payments/"+payment_id+"/refunds" )
    .set({ "Authorization": testParameters.authorization })
    .expect(403);
  });

  /*it("tries to refund more amount than it is and normal refunding", async function () {
    payment_id = await fawryRequests.createPayment();
    console.log("Payment ID: "+payment_id);

    reference_number = await fawryRequests.getPaymentDetails(payment_id);
    console.log("Ref number: "+reference_number);
  
    const response = await request
    .put("/fawry/payments/"+reference_number+"/approval")
    .set({ "Authorization": testParameters.authorization, "Content-Type": testParameters.contentType })

    expect(response.status).to.eql(200);

    console.log("Check to refund more amount than it is");

    request
    .post( "/payments/"+payment_id+"/refunds" )
    .set({ "Authorization": testParameters.authorization })
    .send({ "amount": testParameters.paymentBody.amount+1 })
    .expect(422)
    .expect((res) => {
    console.log("!"+res.body+"!")
    });

  });
*/
});