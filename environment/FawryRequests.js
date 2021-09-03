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

        return response.body.id;
    },
    getPaymentDetails: async function(paymentID){
        const responseGet = await request
        .get("/payments/"+paymentID)
        .set({ "Authorization": testParameters.authorization, "Content-Type": testParameters.contentType })
        .expect(200);

        return responseGet.body.source.reference_number;
    },
    approve_cancelPayment: async function(referenceNumber, option){
        await request
        .put("/fawry/payments/"+referenceNumber+option)
        .set({ "Authorization": testParameters.authorization, "Content-Type": testParameters.contentType })
        .expect(200);
    }
};