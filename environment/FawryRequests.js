var testParameters = require("../environment/TestParameters");
const request = require("supertest")(testParameters.mainURL);
const expect = require("chai").expect;

module.exports = {
    createPayment: async function(){
        const response = await request
        .post("/payments")
        .set({ "Authorization": testParameters.authorization, "Content-Type": testParameters.contentType })
        .send(testParameters.paymentBody)
        .expect(202);

        expect(response.body).to.have.all.keys("id", "status", "customer", "_links");
        expect(response.body).to.have.nested.property("customer.id");
        expect(response.body._links).to.have.all.keys("self", "approve", "cancel");
        expect(response.body._links).to.have.nested.property("self.href");
        expect(response.body._links).to.have.nested.property("approve.href");
        expect(response.body._links).to.have.nested.property("cancel.href");

        return response.body.id;
    },
    getPaymentDetails: async function(paymentID){
        const responseGet = await request
        .get("/payments/"+paymentID)
        .set({ "Authorization": testParameters.authorization, "Content-Type": testParameters.contentType })
        .expect(200);
        expect(responseGet.body).to.have.all.keys("id", "requested_on", "source", "amount", "currency", "payment_type", "status", "risk", "customer", "_links");
        expect(responseGet.body.source).to.have.all.keys("type", "description", "reference_number");
        expect(responseGet.body).to.have.nested.property("risk.flagged");
        expect(responseGet.body).to.have.nested.property("customer.id");
        expect(responseGet.body._links).to.have.all.keys("self", "approve", "cancel");
        expect(responseGet.body._links).to.have.nested.property("self.href");
        expect(responseGet.body._links).to.have.nested.property("approve.href");
        expect(responseGet.body._links).to.have.nested.property("cancel.href");

        return responseGet.body.source.reference_number;
    },
    approve_cancelPayment: async function(referenceNumber, option){
        await request
        .put("/fawry/payments/"+referenceNumber+option)
        .set({ "Authorization": testParameters.authorization, "Content-Type": testParameters.contentType })
        .expect(200);
    }
};