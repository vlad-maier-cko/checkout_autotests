var testParameters = require("../environment/TestParameters");
const request = require("supertest")(testParameters.mainURL);
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
        .send(testParameters.paymentBody)
        .expect(202);

        var expectedSchema = await getSchema("create-payment-response");

        expect(response.body).to.be.jsonSchema(expectedSchema);

        return response.body.id;
    },
    getPaymentDetails: async function(paymentID){
        const responseGet = await request
        .get("/payments/"+paymentID)
        .set({ "Authorization": testParameters.authorization, "Content-Type": testParameters.contentType })
        .expect(200);

        var expectedSchemaGet = await getSchema("get-payment-response");

        expect(responseGet.body).to.be.jsonSchema(expectedSchemaGet);

        return responseGet.body.source.reference_number;
    },
    approve_cancelPayment: async function(referenceNumber, option){
        await request
        .put("/fawry/payments/"+referenceNumber+option)
        .set({ "Authorization": testParameters.authorization, "Content-Type": testParameters.contentType })
        .expect(200);
    },
    refund_Payment: async function(paymentID, amount, flag){
        const responseRefund = await request
        .post( "/payments/"+paymentID+"/refunds" )
        .set({ "Authorization": testParameters.authorization })
        .send({ "amount": amount });

        var expectedSchemaRefund;

        if ( flag ) {
            expect(responseRefund.status).to.eql(202);
            expectedSchemaRefund = await getSchema("refund-response");
        }else{
            expect(responseRefund.status).to.eql(422);
            expectedSchemaRefund = await getSchema("refund-error-response");
        }

        expect(responseRefund.body).to.be.jsonSchema(expectedSchemaRefund);
    },
    refund_allPayment: async function(paymentID){
        const responseRefund1 = await request
        .post( "/payments/"+paymentID+"/refunds" )
        .set({ "Authorization": testParameters.authorization });
      
        expect(responseRefund1.status).to.eql(202);

        var expectedSchemaRefund = await getSchema("refund-response");

        expect(responseRefund1.body).to.be.jsonSchema(expectedSchemaRefund);
    }
};