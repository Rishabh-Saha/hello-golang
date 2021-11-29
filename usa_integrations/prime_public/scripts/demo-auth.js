/* eslint-disable indent */
/* jshint node: true */
// Public keys === Encrypt & Verify
// Private keys === Sign & Decrypt

var request = require('request');
var NodeRSA = require('node-rsa');
var fs = require('fs');
var crypto = require("crypto");
var moment = require("moment");
var rsaKeys = require("./../server/credentials/module-creds.json");

setTimeout(() => {
    getSignature({
        'x-date':moment().format("ddd, DD MMM YYYY HH:mm:ss") + ' GMT', //'Mon, 17 May 2021 08:55:06 GMT', //Thu Sep 03 2020 12:56:39 GMT
        'x-host': 'croma.com'
    })
},1000)
//Generating Hmac signature
function getSignature(headers) {
	console.log('headers ===>', headers);
	var secret = 'CKa2yEzdFKTGR5ZT8wmysS88Mrutze8N7bDKcvpKPsb22ZfrncaPPf46CCCNseL5';
	var stringToSign = 'x-date: ' + headers['x-date'] + '\n' + 'x-host: ' + headers['x-host'];

	console.log(stringToSign);
	var encodedSignature = crypto.createHmac("sha256", secret).update(stringToSign).digest("base64");
	console.log('encodedSignature', encodedSignature);
	return encodedSignature;
}


setTimeout(()=>{
    const data = {
        "Remark": " | UNMATCHED CLAIM - OUTSIDE OF COVER",
        "SoldPlanExternalCode": "FE82ED6AE3C75141",
        "ExternalReferenceID": "CO0JL1E2JN5O",
        "CoverageType": "EW",
        "Name": "MSFT Customer",
        "ProductUniqueID": "26647380553",
        "CountryCode": "IN",
        "EmailID": "khaitan.ankit10@gmail.com",
        "Customer_Phone": "8300024296",
        "IssueID": "310",
        "IssueRemark": "Display Issue",
        "DamageCode": "",
        "LossDateTime": "2021-JUN-16",
        "CustomerAddress": {
            "Address": "THIRUNALLAR ROAD",
            "Landmark": "B9A, ONGC COLONY",
            "Zipcode": "609607",
            "City": "KARAIKAL",
            "State": "Puducherry"
        }
    };
    console.log("encryptRequest=====>",encryptRequest(data,'RSA'))
},1000)

//Encrypting RequestBody
var encryptRequest = (requestBody, algo) => {
    var dataString;
	if (typeof requestBody === 'object') {
		dataString = Buffer.from(JSON.stringify(requestBody));
	} else {
		dataString = Buffer.from(requestBody);
	}
	if (algo === 'RSA') {
		//Netsuite's Private Key
		var publicKeyContent = fs.readFileSync('/Users/Servify/repo/usa_integrations/op_benefit/servify_pub_key.pem');

		//Servify's Public Key
		var servifyPublicKey = new NodeRSA(publicKeyContent);
		var encryptedBuffer = servifyPublicKey.encrypt(dataString);
		var encryptedBase64 = encryptedBuffer.toString('base64');
		return {
			'$data': encryptedBase64
		};

	} else if (algo === 'AES-256-GCM') {
		var masterkey = '3zTvzr3p67VC61jmV54rIYu1545x4TlY';
		// random initialization vector
		const iv = crypto.randomBytes(16);

		// random salt
		const salt = crypto.randomBytes(64);

		// derive encryption key: 32 byte key length
		// in assumption the masterkey is a cryptographic and NOT a password there is no need for
		// a large number of iterations. It may can replaced by HKDF
		// the value of 2145 is randomly chosen!
		const key = crypto.pbkdf2Sync(masterkey, salt, 2145, 32, 'sha512');

		// AES 256 GCM Mode
		const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

		// encrypt the given text
		const encrypted = Buffer.concat([cipher.update(dataString, 'utf8'), cipher.final()]);

		// extract the auth tag
		const tag = cipher.getAuthTag();
		// console.log("encrypted =>", encrypted);
		// generate output

		const encryptedBase64 = Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
		console.log('encryptedBase64 AES-256-GCM===>', encryptedBase64);
		return {
			'$data': encryptedBase64
		};
	} else {
		return 'Invalid Algo !';
	}
};
setTimeout(()=> {
    const data = {
        "$data": "Qo5n6HKEsLfyt1ZxNEF2n0QdYX8N8OhntpdGIRAzteKTPYW7wV7t0ZEOrI7CdtbVeY93jvwQtfUyeP67HjVv47A4hYdtuG1dn41UMr9Yp1ZmFFFk9uf2MtZvG9fTksUiKHZR5yD6+eZRIX7LUn9kqM0X0kyO2mw774IVW56tyJbvv7Y+qvMrFv+YuXwdAlDszsliffT7Fndsh7TimRuNH9zvTIardW+mcim8hFzRsMXaVYTK8uubAQ32sWcjZ9Ks3KkV8/3ZiM1A8ozz6Y+tAdDvU2pG/zA2ghRG8lesuIT4nJ+t7v5tAuunHlqvrfDDxI/mQtQl/1VOutCJBwt3IA=="
    }
    console.log("decrypted response====>",JSON.stringify(decryptResponse(data,'RSA')));
},1000)
var decryptResponse = (responseBody, algo) => {
	if (algo === 'RSA') {
		//Netsuite's Private Key
		var clientPrivateKey = new NodeRSA(fs.readFileSync('/Users/Servify/repo/usa_integrations/op_benefit/servify_private1.pem'));

		var buf = Buffer.from(responseBody['$data'], 'base64');
		var decryptedString = clientPrivateKey.decrypt(buf);
		decryptedString = JSON.parse(decryptedString);
		return decryptedString;
	} else if (algo === 'AES-256-GCM') {
		var masterkey = '3zTvzr3p67VC61jmV54rIYu1545x4TlY';
		const bData = Buffer.from(responseBody['$data'], 'base64');

		// convert data to buffers
		const salt = bData.slice(0, 64);
		const iv = bData.slice(64, 80);
		const tag = bData.slice(80, 96);
		const text = bData.slice(96);

		// derive key using; 32 byte key length
		const key = crypto.pbkdf2Sync(masterkey, salt, 2145, 32, 'sha512');

		// AES 256 GCM Mode
		const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
		decipher.setAuthTag(tag);

		// encrypt the given text
		const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
		console.log("decrypted =>", decrypted);
		decryptedString = JSON.parse(decrypted);

		return decryptedString;
	} else {
		return 'Invalid Algo !';
	}
};

var demoAuth = (algo) => {
	var requestUrl = 'https://netsuite-uat.servify.tech/ns-public/v1/Auth/generateToken';
	var dateString = moment().format('ddd, DD MMM YYYY HH:mm:ss') + ' GMT'; //Fri, 10 Jun 2016 18:14:49 GMT
	console.log('requestHeaders ===>', requestHeaders); //Mon, 14 Jan 2019 09:40:43 GMT
	var requestHeaders = {
		'x-host': 'servify.in',
		'x-date': dateString.toString(),
		'client-id': 'ServifyTest'
	};

	// var requestHeaders = {
	// 	'x-host': 'servify.in',
	// 	'x-date': 'Mon, 14 Jan 2019 17:43:26 GMT',
	// 	'client-id': 'ServifyTest'
	// };

	var authHeader = getSignature(requestHeaders);
	requestHeaders['hmac-signature'] = authHeader;
	var requestBody = {};
	console.log('requestHeaders ===>', requestHeaders);

	var encryptedRequestBody = encryptRequest(requestBody, algo);
	console.log('encryptedRequestBody ===>', encryptedRequestBody);

	var requestOptions = {
		url: requestUrl,
		json: encryptedRequestBody,
		headers: requestHeaders,
		method: 'POST'
	};

	console.log('requestOptions ===>', requestOptions);
	request(requestOptions, (error, response, body) => {
		console.log('demoAuth error ===>', error);
		// console.log('demoAuth response ===>', response);
		console.log('demoAuth body ===>', body);
		var decryptedRes = decryptResponse(body, algo);
		console.log('demoAuth decryptedRes ===>', decryptedRes);
	});
};

var demoPartsCall = (algo) => {
	var requestUrl = 'https://netsuite-uat.servify.tech/ns-public/v1/Open/inventoryManagement';
	var dateString = moment().format('ddd, DD MMM YYYY HH:mm:ss') + ' GMT'; //Fri, 10 Jun 2016 18:14:49 GMT
	console.log('requestHeaders ===>', requestHeaders); //Mon, 14 Jan 2019 09:40:43 GMT
	var requestHeaders = {
		'x-host': 'servify.in',
		'x-date': dateString.toString(),
		'client-id': 'ServifyTest',
		'client-session-id': 'b4255430-1989-11e9-a099-43366d2212a8',
		'rest-action': 'STO_AUDIT'
	};

	var authHeader = getSignature(requestHeaders);
	requestHeaders['hmac-signature'] = authHeader;
	var requestBody = {
		"SubscriptionCode": "ONS",
		"OrderReferenceID": "UUYYIMNB",
		"parts": [{
			"PartCode": "412001501",
			"PartState": "FRESH",
			"Quantity": 4
		}, {
			"PartCode": "412001401",
			"PartState": "FRESH",
			"Quantity": 2
		}]
	};
	console.log('requestHeaders ===>', requestHeaders);

	var encryptedRequestBody = encryptRequest(requestBody, algo);
	console.log('encryptedRequestBody ===>', encryptedRequestBody);

	var requestOptions = {
		url: requestUrl,
		json: encryptedRequestBody,
		headers: requestHeaders,
		method: 'POST'
	};

	request(requestOptions, (error, response, body) => {
		console.log('demoAuth error ===>', error);
		// console.log('demoAuth response ===>', response);
		console.log('demoAuth body ===>', body);
		var decryptedRes = decryptResponse(body, algo);
		console.log('demoAuth decryptedRes ===>', decryptedRes);
	});
};

// setTimeout( () =>{
// demoAuth('RSA');
// }, 3000);
