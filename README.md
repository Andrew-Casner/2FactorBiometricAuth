# Consentsus
SDHacks 2018 Hack

Privacy is becoming a more important issue every day. All of us have had that experience where someone else posted an unflattering picture of us on Facebook for everyone to see. Now take that up a notch, who would want a casual photo from a walk in the park to end up in a tabloid? We all care about our privacy, and more importantly, we care about safety. Consentsus allows people to know and be in control of when their photos are released, and even allows parents to sign off for their children's photos as well. Through Consentsus, photographers can ethically manage photo release rights through a scalable platform.


https://devpost.com/software/consentsus

We utilized the DocuSign API and AI services to streamline the photo consent process for large organizations. 

For document construction, we used the fpfd python3 library and the DocuSign composite template API. We first made the pdf from tagged imagess, then we combined the pdf with a server template.

For pdf generation code, go to the pdfgen directory

For the DocuSign API usage, please view website/server.js 

For the single page Angular app, you can visit website/sdhack/src/app/

For face comparison, you can visit the faceCompare directory






