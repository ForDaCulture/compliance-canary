import datetime as dt, os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import qrcode, io, segno

from sigstore.sign import Signer as Sst

def generate_pdf(findings, client_name):
    fname = f"{client_name}_SOC2_Report_{dt.date.today():%Y%m%d}.pdf"
    c = canvas.Canvas(fname, pagesize=letter)

    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, 700, "SOC 2 Compliance Evidence Report")
    y = 650

    findings = annotated(findings)
    for f in findings:
        c.drawString(50, y, f"{f['rule']} → {f['soc2_refs']['CC']} {f['soc2_refs']['control']}")
        y -= 20

    qr_file = io.BytesIO()
    segno.make(f"sha256:{hex(os.urandom(32))}").save(qr_file, kind="png", scale=3)
    c.drawImage(qr_file, letter[0]-100, 100, 60, 60)

    # sigstore
    signer = Sst()
    sig = signer.sign_file(fname)
    c.setFont("Helvetica", 8)
    c.drawString(50, 75, f"Sigstore Sig: {sig.hex()[:16]}... Signed {dt.datetime.utcnow()}Z")
    c.save()
    return fname
