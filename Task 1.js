var link1
describe("Test a successful flow of requesting and capturing a payment with the Fawry payment method", () => {
    it("Should request a payment", () => {
        cy.fixture("someConsts").then(data =>{
            cy.log("POST request")
            cy.request({
              method: "POST",
              url: data.main_url+"/payments",
              headers: {
                  "Authorization": data.Authorization,
                  "Content-Type": data.ContentType
              },
              body: {
                "amount": 30000,
                "currency": "EGP",
                "source": {
                  "type": "fawry",
                  "description": "Fawry Demo Payment",
                  "customer_mobile": "01058375055",
                  "customer_email": "bruce@wayne-enterprises.com",
                  "products": [
                    {
                      "product_id": "0123456789",
                      "quantity": 1,
                      "price": 30000,
                      "description": "Fawry Demo Product"
                    }
                  ]
                }
              }
            }).then((responsePost) => {
                cy.log(JSON.stringify(responsePost.body))
                expect(responsePost.status).to.eq(202)
                expect(responsePost.body).to.have.property("status", "Pending")
                const payment_id = responsePost.body["id"]
                const link_approval = responsePost.body._links.approve["href"]

                cy.log("GET request")
                cy.request({
                    method: "GET",
                    url: data.main_url+"/payments/"+payment_id,
                    headers: {
                        "Authorization": data.Authorization,
                        "Content-Type": data.ContentType
                    }
                }).then((responseGet) => {
                    cy.log(JSON.stringify(responseGet.body))
                    expect(responseGet.status).to.eq(200)
                    expect(responseGet.body.source["reference_number"]).to.not.be.null
                    const reference_number = responseGet.body.source["reference_number"]

                    cy.log("PUT approval request")
                    cy.request({
                        method: "PUT",
//                        url: link_approval,
                        url: data.main_url+"/fawry/payments/"+reference_number+"/approval",
                        headers: {
                            "Authorization": data.Authorization,
                            "Content-Type": data.ContentType
                        }
                    }).then((responsePut) => {
                        cy.log(JSON.stringify(responsePut.body))
                        expect(responsePut.status).to.eq(200)

                        cy.log("GET checking status of Payment")
                        cy.request({
                            method: "GET",
                            url: data.main_url+"/payments/"+payment_id,
                            headers: {
                                "Authorization": data.Authorization,
                                "Content-Type": data.ContentType
                            }
                        }).then((responseGet1) => {
                            cy.log(JSON.stringify(responseGet1.body))
                            expect(responseGet1.status).to.eq(200)
                            expect(responseGet1.body).to.have.property("status", "Captured")
                        })
                    })
                })
            })    
        })
    })
})