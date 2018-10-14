const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const docusign = require('docusign-esign');
const app = express();
const apiClient = new docusign.ApiClient();
const fs = require('fs');



const OAuthToken = 'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQkAAAABAAUABwAA-X9RyjHWSAgAADmjXw0y1kgCACwrmmZu4FJFnVVOe267RZEVAAEAAAAYAAEAAAAFAAAADQAkAAAAZjBmMjdmMGUtODU3ZC00YTcxLWE0ZGEtMzJjZWNhZTNhOTc4EgABAAAABwAAAG1hbmFnZWQwAACoJOHIMdZI.qIbXxwJpVI2NA0wgxSgVn4pV0q4w9yQv1mzJcOu2n5-TlsJ8JsDY0RP79F99pIAx3_k9loMHb4icO5hlUcTyoHAcMFkW9jgUG8-QKjt7D5qVZ-oZie9K6FjfFVH19YGg3R5YjbCHewSxn-zDjyARuh0NmhVy3kKadkV0E3_Pysid8cDcZYER80wm-CWBfk7PV3Rq-VAW6S-F0c150zyewnEGmgHI8zeqX7IofCZvxlb7sk0hQ7T6P631bDoYAn-dUJ7Sh-s1GW6YQpwEv6QOO5lu_E1UhmQyjvpaTWSBjyjFTJeAJ4rWTe229HQ8eb_V5ROnQNXpCdHR5A12jxxBRQ';
const accountId = '6807374';
apiClient.setBasePath('https://demo.docusign.net/restapi');
apiClient.addDefaultHeader('Authorization', 'Bearer ' + OAuthToken);

app.use(express.static(path.join(__dirname,'')));


app.use(express.static(path.join(__dirname, 'sdhack/dist')));
app.use('/', express.static(path.join(__dirname, 'sdhack/dist')));
app.use('*', express.static(path.join(__dirname, 'sdhack/dist')));

app.use(bodyParser.json());
docusign.Configuration.default.setDefaultApiClient(apiClient);


app.post('/sendReleaseForm', function (req, res){
  recipientName = req.body.fullName;
  recipientEmail = req.body.email;
  recipientImages = req.body.TaggedIms;
  Imgbucket = req.body.bucket;
  var options = {
    uri: 'http://localhost:5000/getPDFBytes',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    json: {
      'bucket': Imgbucket,
      'TaggedIms': recipientImages
    }
  };



});

app.post('/webhook', bodyParser.text({
    limit: '50mb',
    type: '*/xml'
}), function(request, response) {
    var contentType = request.headers['content-type'] || '',
        mime = contentType.split(';')[0];
    console.log(mime);
    console.log("webhook request body: " + JSON.stringify(request.body));
    webhook(request.body);
    response.send("Received!");
});


app.get('/getEnvelopeStatus', function (req, res) {

    envelopeId = req.query.envelopeId;
    var options = {
      uri: 'https://demo.docusign.net/restapi/v2/accounts/6807374/envelopes?envelope_ids=' + envelopeId,
      method: 'GET',
      headers: {'content-type': 'application/json', 'Authorization': 'Bearer ' + OAuthToken},

    }

    request(options, function(err, resp, body){
      body = JSON.parse(body);

      res.send({"status": body.envelopes[0].status})
    })
})


app.post('/sendDocument', function (req, res) {



  // *** Begin envelope creation ***

  //Read the file you wish to send from the local machine.
  recipientName = req.body.fullName;
  recipientEmail = req.body.email;
  recipientImages = req.body.TaggedIms;
  Imgbucket = req.body.bucket;
  console.log(req);
  var options = {
    uri: 'http://localhost:5000/getPDFBytes',
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    json: {
      'bucket': Imgbucket,
      'TaggedIms': recipientImages
    }
  };
  console.log(options)
  request(options, function(err, resp, body){

    envDef = {
      "compositeTemplates": [
        {
          "inlineTemplates": [
            {
              "recipients": {
                "signers": [
                  {
                    "email": recipientEmail,
                    "name": recipientName,
                    "recipientId": "1",
                    "roleName": "Subject of Photo(s) to Release"
                  }
                ]
              },
              "sequence": "1"
            }
          ],
          "serverTemplates": [
            {
              "sequence": "1",
              "templateId": "4f805d17-2e10-45a1-8701-bdd998231958"
            }
          ]
        },
        {
          "document": {
            "documentBase64": body.pdfb64,
            "documentId": "1",
            "name": "Photograph Consent"
          },
          "inlineTemplates": [
            {
              "recipients": {
                "signers": [
                  {
                    "email": recipientEmail,
                    "name": recipientName,
                    "recipientId": "1",
                    "roleName": "Subject of Photo(s) to Release",
                    "tabs": {
                      "initialHereTabs": [
                        {
                          "anchorString": "Initial",
                          "anchorUnits": "Inches",
                          "anchorXOffset": "0",
                          "anchorYOffset": "0.6",
                          "documentId": "1",
                          "page": "2",
                          "optional": "true"
                        }
                      ]
                    }
                  }
                ]
              },
              "sequence": "2"
            }
          ]
        }

      ],
      "emailSubject": "Your consent is required for the release of these photo(s)",
      "emailBlurb": "There were several photos taken of you during SDHacks, please tka the time to approve them",
      "status": "sent",
      "eventNotification": {
        "url": "http://ec2-52-12-126-217.us-west-2.compute.amazonaws.com/webhook",
        "includeCertificateOfCompletion": "false",
        "includeDocuments": "true",
        "includeDocumentFields": "true",
        "requireAcknowledgment": "true",
        "envelopeEvents": [{"envelopeEventStatusCode": "sent"},
		  	{"envelopeEventStatusCode": "delivered"},
		  	{"envelopeEventStatusCode": "completed"},
			  {"envelopeEventStatusCode": "declined"},
			  {"envelopeEventStatusCode": "voided"}],
		    "recipientEvents": [
			  {"recipientEventStatusCode": "Sent"},
			  {"recipientEventStatusCode": "Delivered"},
			  {"recipientEventStatusCode": "Completed"},
			  {"recipientEventStatusCode": "Declined"},
			  {"recipientEventStatusCode": "AuthenticationFailed"},
			  { "recipientEventStatusCode": "AutoResponded"}
        ]}
   }


    // *** End envelope creation ***


    //Send the envelope
    var envelopesApi = new docusign.EnvelopesApi();
    console.log(envDef);
    envelopesApi.createEnvelope(accountId, { 'envelopeDefinition': envDef }, function (err, envelopeSummary, response) {

      if (err) {
        return res.send('Error while sending a DocuSign envelope:' + err);
      }

      res.send(envelopeSummary);

    });



  });
});


const port = process.env.PORT || '8080';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log('Website running on localhost:8080'));
