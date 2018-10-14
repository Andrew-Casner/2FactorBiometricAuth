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


app.use(express.static(path.join(__dirname, 'sdhack/dist')));
app.use('/', express.static(path.join(__dirname, 'sdhack/dist')));
app.use('*', express.static(path.join(__dirname, 'sdhack/dist')));

app.use(bodyParser.json());




app.post('/sendDocument', function (req, res) {



  // *** Begin envelope creation ***

  //Read the file you wish to send from the local machine.
  //fileName = "./consent.pdf";
  //pdfBytes = fs.readFileSync(path.resolve(__dirname, fileName));
  ///pdfBase64 = pdfBytes.toString('base64');

  docusign.Configuration.default.setDefaultApiClient(apiClient);

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
    var envDef = new docusign.EnvelopeDefinition();

    //Set the Email Subject line and email message
    envDef.emailSubject = 'Your consent is required for the release of these photo(s)';
    envDef.emailBlurb = 'Please review the following contract and approve/reject tagged photos'

    //Read the file from the document and convert it to a Base64String
    var doc = new docusign.Document();

    doc.documentBase64 = body.pdfb64;

    doc.fileExtension = 'pdf';
    doc.name = recipientName + " image form";
    doc.documentId = '1';

    //Push the doc to the documents array.
    var docs = [];
    docs.push(doc);
    envDef.documents = docs;

    //Create the signer with the previously provided name / email address
    var signer = new docusign.Signer();
    signer.name = recipientName;
    signer.email = recipientEmail;
    signer.routingOrder = '1';
    signer.recipientId = '1';
    console.log(signer);

    //
    //Create a tabs object and a signHere tab to be placed on the envelope
    var tabs = new docusign.Tabs();

    var initialHere = new docusign.InitialHere();
    initialHere.documentId = '1';
    initialHere.pageNumber = '1';
    initialHere.recipientId = '1';
    initialHere.tabLabel = 'initialhereTab';
    initialHere.anchorString = 'Initial';
    initialHere.anchorXOffset = "0";
    initialHere.anchorYOffset = "0.5";
    initialHere.anchorUnits = "inches";

    initialArray = [];
    initialArray.push(initialHere);
    tabs.initialHereTabs = initialArray;

    /*
    signHereTabArray = [];
    signHereTabArray.push(signHere);

    tabs.signHereTabs = signHereTabArray;

    var text = new docusign.Text();
    text.documentId = '1';
    text.pageNumber = '1';
    text.recipientId = '1';
    text.anchorString = 'sender_name';
    text.locked = 'true';
    text.fontSize = 'Size16';
    text.anchorXOffset = "0";
    text.anchorYOffset = "-0.15";
    text.anchorUnits = "inches";
    text.value = 'SDHacks';

    textTabArray = [];
    textTabArray.push(text);

    var text = new docusign.Text();
    text.documentId = '1';
    text.pageNumber = '1';
    text.recipientId = '1';
    text.anchorString = 'recipient_name';
    text.locked = 'true';
    text.fontSize= 'Size12';
    text.anchorYOffset = "-0.15";
    text.anchorUnits = "inches";
    text.value = recipientName;

    var lTabs = new docusign.List();
    lTabs.anchorString = 'consent_choice';
    lTabs.documentId = '1';
    lTabs.pageNumber = '1';
    lTabs.required = 'true';

    lTabsItems = [];
    listItem = new docusign.ListItem();
    listItem.text = "give";
    listItem.value = "give";
    lTabsItems.push(listItem);
    listItem = new docusign.ListItem();
    listItem.text = "do not give";
    listItem.value = "do not give";
    lTabsItems.push(listItem);
    lTabs.listItems = lTabsItems;
    console.log(lTabs.listItems);
    console.log(lTabs)



    textTabArray.push(text);
    tabs.textTabs = textTabArray;
    */


    //Create the array for SignHere tabs, then add it to the general tab array


    //Then set the recipient, named signer, tabs to the previously created tab array
    signer.tabs = tabs;

    //Add the signer to the signers array
    var signers = [];
    signers.push(signer);

    //Envelope status for drafts is created, set to sent if wanting to send the envelope right away
    envDef.status = 'sent';

    //Create the general recipients object, then set the signers to the signer array just created
    var recipients = new docusign.Recipients();
    recipients.signers = signers;

    //Then add the recipients object to the enevelope definitions
    envDef.recipients = recipients;

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
