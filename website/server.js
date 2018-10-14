const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const docusign = require('docusign-esign');
const app = express();
const docConn = require('./docusignRoutes/testSendEnvelope.js')
const apiClient = new docusign.ApiClient();
const fs = require('fs');



const OAuthToken = 'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQkAAAABAAUABwAATg-fVzHWSAgAAI4yrZox1kgCACwrmmZu4FJFnVVOe267RZEVAAEAAAAYAAEAAAAFAAAADQAkAAAAZjBmMjdmMGUtODU3ZC00YTcxLWE0ZGEtMzJjZWNhZTNhOTc4EgACAAAABwAAAG1hbmFnZWQLAAAAaW50ZXJhY3RpdmUwAAAh3p1XMdZI.BXA4cBQLbQtjuq6DLG81vCQ__FBpDQN91pUyoyxoDPn9n6Er5bjphBSg3dAi9xIhO7rldaWNa0cPsOEuNITn3cPgf6XaaQNdO0lF3qTuT2EtPX7Av9BHPf8jsx-yX4OTuKQICbchtdmPAFN_r_EGJcgooloXI6CaeEPeZr1Ey1K_uj4WCFQZmNcNXVHwzqkVDCiJTy3yxB5ooH0cIZIACr54nHjTEK7XYu58epa8C2kXaBdAozoEGlK1EoID6PdrMrlZviwhpAdvPo361aJ7janTCWZubRztm2ybYHR5r7IvQQ6RGq8M9DyPUOI-LsptHVGmL78Nj7pj1rm9BxLgmQ';
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


app.post('/sendDocument', function (req, res) {



  // *** Begin envelope creation ***

  //Read the file you wish to send from the local machine.
<<<<<<< HEAD
=======
  //fileName = "./consent.pdf";
  //pdfBytes = fs.readFileSync(path.resolve(__dirname, fileName));
  ///pdfBase64 = pdfBytes.toString('base64');

  docusign.Configuration.default.setDefaultApiClient(apiClient);

>>>>>>> a61730534ab3368158947a0b8ea40f80e1830256
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
      "status": "sent"
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
