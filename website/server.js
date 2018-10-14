const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const docusign = require('docusign-esign');
const app = express();
const apiClient = new docusign.ApiClient();
const fs = require('fs');



const OAuthToken = 'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQkAAAABAAUABwAAchHQmzHWSAgAALI03t4x1kgCACwrmmZu4FJFnVVOe267RZEVAAEAAAAYAAEAAAAFAAAADQAkAAAAZjBmMjdmMGUtODU3ZC00YTcxLWE0ZGEtMzJjZWNhZTNhOTc4EgABAAAABwAAAG1hbmFnZWQwAIB54AmYMdZI.ZDrJaF8MniC9KoszjNW2WfmlHxUfuyz-EshfSYgjGT1OTmuwPsTSPKpnZPOQC_u8FFhsOfh_zUS2yB97mAcCnJ0OgVlj_F-0-JJWAO6VdEl72ApIXzN7IFea1Ypj17W4uoq-wqqsK-ROYNiq3RKp2geWxngRxsCikuAJrmiJhyaX9Q23rKMEHHcMS7O0Vq6bohSV_v4nKNXUrD1Cp0QeXy8CXI1uX0EyahUE-xyPOxhXNjIYBY0iRWhsdZF6O9K3QJyh4TWiuHyzA9PoBk__GaSv8A3OZY678WE9-Z_YicrLizmkgRuFi2Z0X_aMWM8Ab4YOd1trXi81qdoeJKMdhg';
const accountId = '6807374';
apiClient.setBasePath('https://demo.docusign.net/restapi');
apiClient.addDefaultHeader('Authorization', 'Bearer ' + OAuthToken);

app.use(express.static(path.join(__dirname,'')));
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
      'content-type': 'application/json'
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
