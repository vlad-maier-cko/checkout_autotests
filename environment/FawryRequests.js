var testParameters = require("../environment/TestParameters");
const request = require("supertest")(testParameters.mainURL);

module.exports = {
    createPayment: async function(){
        const response = await request
        .post("/payments")
        .set({ 'Authorization': testParameters.authorization, 'Content-Type': testParameters.contentType })
        .send(testParameters.paymentBody);

        return response.body.id;
    },
    getPaymentDetails: async function(paymentID){
        const responseGet = await request
        .get("/payments/"+paymentID)
        .set({ 'Authorization': testParameters.authorization, 'Content-Type': testParameters.contentType })

        return responseGet.body.source.reference_number;
    }
};