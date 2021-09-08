var testParameters = require("../environment/TestParameters");
const request = require("supertest")(testParameters.qpayURL);
var chai = require("chai");
chai.use(require("chai-json-schema"));
var expect = chai.expect;

var upath = require("upath");
var fs = require("fs");
const loader = require("speccy/lib/loader");

function getSchema (fileName) {
    const options = {
        resolve: true,
        jsonSchema: true
    };
      
    let path = upath.join(upath.normalize(__dirname), `../schemas/${fileName}.yml`);

    return loader.loadSpec(path, options);
}

module.exports = {
    createPayment: async function(){
        const response = await request
        .post("/payments")
        .set({ "Authorization": testParameters.authorization, "Content-Type": testParameters.contentType })
        .send(testParameters.paymentBodyQPay)
        .expect(202);

        var expectedSchema = await getSchema("create-payment-response-qpay");

        expect(response.body).to.be.jsonSchema(expectedSchema);
        expect(response.body.status).to.eql("Pending");

        return response.body;
    },
    getPaymentDetails: async function(paymentID){
        const responseGet = await request
        .get("/payments/"+paymentID)
        .set({ "Authorization": testParameters.authorization, "Content-Type": testParameters.contentType })
        .expect(200);

        var expectedSchemaGet = await getSchema("get-payment-response-qpay");

        console.log("Status: "+responseGet.body.status)
        expect(responseGet.body).to.be.jsonSchema(expectedSchemaGet);
    }
};