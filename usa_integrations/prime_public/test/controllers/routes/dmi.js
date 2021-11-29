const source = require('../../testHelper');
const request = require('supertest');
const { assert } = require('chai');
const {describe, it, before} = require('mocha');
const expect = require('chai').expect;
const token = require('./auth')


describe('testing dmi functions', function(){ 
    // this.timeout(4000);
    
    it('testing recieveEMandateDetails', (done) => { 
        request(source.app)
            .post('/financepartners/dmi/receiveEMandateDetails')
            .set({
                'client-id': source.clientID,
                'content-type':source.contentType,
                'hmac-signature':source.hmacSignature,
                'x-date':source.xDate,
                'x-host':source.xHost,
                'client-session-id': token()
            })
            .send({
                "ReferenceID": "O8M7IBJBSATO",    
                "DecisionStatusCode": "Initiated",    
                "DecisionStatusReason": ""
            })
             .end((err, response) => {
                if (err) throw err;
                assert.typeOf(response.body.data, "object", "data is data type object");
                assert.deepEqual(response.body.status, 200);
                assert.deepEqual(response.body.success, true)
                done();
          })

    })

    it('testing recieveOfferDetails', (done) => { 
        request(source.app)
            .post('/financepartners/dmi/receiveOfferDetails')
            .set({
                'client-id': source.clientID,
                'content-type':source.contentType,
                'hmac-signature':source.hmacSignature,
                'x-date':source.xDate,
                'x-host':source.xHost,
                'client-session-id': token()
            })
            .send({
                "LeadID": "00Q0w000002Sp2EEAS",
                "ReferenceID": "EC8T4M3QV7AI",
                "DecisionStatusCode": "Success",
                "DecisionStatusReason": "",
                "Offer": [
                    {
                        "Amount": "6293",
                        "LoanStartDate": "2021-03-09",
                        "Tenure": "8.0",
                        "DownPayment": "3146",
                        "MonthlyEMI": "826",
                        "ProcessingFee": "147.5",
                        "OfferValidity": "2021-04-09",
                        "WarrantyPrice": "9439",
                        "SanctionLoanAmount": "6293"
                    }
                ]
            })
             .end((err, response) => {
                if (err) throw err;
                assert.typeOf(response.body.data, "object", "data is data type object");
                assert.deepEqual(response.body.status, 400);
                assert.deepEqual(response.body.success, false)
                done();
          })

    })

    it('testing receiveKYCDetails', (done) => { 
        request(source.app)
            .post('/financepartners/dmi/receiveKYCDetails')
            .set({
                'client-id': source.clientID,
                'content-type':source.contentType,
                'hmac-signature':source.hmacSignature,
                'x-date':source.xDate,
                'x-host':source.xHost,
                'client-session-id': token()
            })
            .send({    
                "ReferenceID": "O8M7IBJBSATN",    
                "DecisionStatusCode": "Success",    
                "DecisionStatusReason": "",    
                "KYCDetails": {        
                    "AadhaarReferenceID": "FN1423526140",        
                    "EKYCData": {            
                        "ContactID": "0030p00000Cg1KMAAZ",            
                        "PostOffice": "null",            
                        "Address": "D/O Shekhar,364, ,Ramdurg,Ramdurg,Belgaum,Karnataka,India,591123",            
                        "State": "Karnataka",            
                        "Photo": "https://ecs-okyc.s3.ap-south-1.amazonaws.com/DMI/e/BorrowerPhoto/FN1423526140_faceAuth.jpg",            
                        "PinCode": "591123",            
                        "DOB": "1996-03-14 00:00:00",            
                        "Name": "Shreelakshmi Shekhar Sherigar",            
                        "Gender ": "F",            
                        "District": "Belgaum",            
                        "EKYCStatus": "Success",            
                        "TransactionID": "FN1423526140",            
                        "ErrorNumber": "null",            
                        "OtpStatus": "null"       
                    }   
                }
            })
             .end((err, response) => {
                if (err) throw err;
                assert.typeOf(response.body.data, "object", "data is data type object");
                assert.deepEqual(response.body.status, 400);
                assert.deepEqual(response.body.success, false)
                done();
          })

    })


})