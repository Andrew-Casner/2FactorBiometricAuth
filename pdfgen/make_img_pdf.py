from fpdf import FPDF 


#210 * 292


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


# Instantiation of inherited class
pdf = PDF()
pdf.alias_nb_pages()
pdf.set_font('Arial', 'B', 12)
pdf.add_page()
imgHeight = 65
startX = 30
startY = 40
images = ["IMG_9839.JPG", "IMG_9834.JPG", "IMG_9840.JPG"]
interval = 10
pdf.cell(startX + 20)

for img in images:
    pdf.image(img, startX, startY, w=0, h=imgHeight)
    pdf.set_xy(startX + 130, startY + 5)
    pdf.cell(10, 15, "Initial")
    startY += imgHeight + interval
pdf.output('tuto2.pdf', 'F')

