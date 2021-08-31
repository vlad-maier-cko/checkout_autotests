var testParameters = require("../environment/TestParameters");
const request = require("supertest")(testParameters.mainURL);
const expect = require("chai").expect;

var payment_id = null;
var link_approval = null;
var reference_number = null;

describe("Test a successful flow of requesting and capturing a payment with the Fawry payment method", function () {
  it("should request a payment", async function () {
      const response = await request
        .post("/payments")
        .set({ 'Authorization': testParameters.authorization, 'Content-Type': testParameters.contentType })
        .send(testParameters.paymentBody);
  
      expect(response.status).to.eql(202);
      expect(response.body.status).to.eql("Pending");

      expect(response.body.id).to.not.eql(null);
      expect(response.body._links.approve.href).to.not.eql(null);
      payment_id = response.body.id;
      link_approval = response.body._links.approve.href;
      console.log(link_approval);
    });

    it("takes detail of payment", async function () {
      const response = await request
        .get("/payments/"+payment_id)
        .set({ 'Authorization': testParameters.authorization, 'Content-Type': testParameters.contentType })
  
      expect(response.status).to.eql(200);

      expect(response.body.source.reference_number).to.not.eql(null);
      reference_number = response.body.source.reference_number;

      console.log("payment_id: "+payment_id);
      console.log("reference_number: "+reference_number);
    });

    it("should approve the payment", async function () {
      const response = await request
        .put("/fawry/payments/"+reference_number+"/approval")
        .set({ 'Authorization': testParameters.authorization, 'Content-Type': testParameters.contentType })

      expect(response.status).to.eql(200);
    });

    it("confirms approval status", async function () {
      const response = await request
        .get("/payments/"+payment_id)
        .set({ 'Authorization': testParameters.authorization, 'Content-Type': testParameters.contentType })
  
      expect(response.status).to.eql(200);
      expect(response.body.status).to.eql("Captured");
    });
});