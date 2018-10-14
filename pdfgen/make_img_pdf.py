from fpdf import FPDF 
from flask import Flask, request, jsonify
import base64
import psycopg2
import boto3
import os
import json

#210 * 292

app = Flask(__name__)

class PDF(FPDF):

    images = ["IMG_9839.JPG", "IMG_9834.JPG", "IMG_9840.JPG"]
    def header(self):
        # Logo
        # Arial bold 15
        self.set_font('Arial', 'B', 15)
        # Move to the right
        self.cell(80)
        # Title
        self.cell(50, 10, 'Tagged Images', 1, 0, 'C')
        # Line break
        self.ln(20)

'''
{
    userID: 1,
    FullName: "Nick Erokhin",
    bucket: "sdhack",
    TaggedIms: ["drew_nick.JPG", "nick_1.JPG"]
}
'''

s3 = boto3.client("s3")

@app.route("/getPDFBytes", methods=["POST"])
def getPDF():
    pdf = PDF()
    pdf.alias_nb_pages()
    pdf.set_font('Arial', 'B', 12)
    pdf.add_page()
    imgHeight = 65
    startX = 30
    startY = 40
    data = json.loads(request.data)

    images = data["TaggedIms"]

    interval = 10
    pdf.cell(startX + 20)

    for img in images:
        s3.download_file(data["bucket"], img, img)
        pdf.image(img, startX, startY, w=0, h=imgHeight)
        pdf.set_xy(startX + 130, startY + 5)
        pdf.cell(10, 15, "Initial")
        startY += imgHeight + interval
        if os.path.exists(img):
            os.remove(img)
    pdf.output('./temp.pdf', 'F')
    b64 = ""
    with open("temp.pdf", "rb") as pdfOut:
        b64 = base64.b64encode(pdfOut.read()).decode('utf-8')
        return jsonify({"pdfb64": b64})
    os.remove("temp.pdf")

if __name__ == "__main__":
    app.run(debug=True)

