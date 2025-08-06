# /backend/pdf_generator.py
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from datetime import datetime

REPORTS_DIR = "reports"
os.makedirs(REPORTS_DIR, exist_ok=True)

def create_report_pdf(repo, findings):
    timestamp = datetime.now()
    file_name = f"{repo.name.replace('/', '_')}_{timestamp.strftime('%Y%m%d_%H%M%S')}.pdf"
    file_path = os.path.join(REPORTS_DIR, file_name)

    c = canvas.Canvas(file_path, pagesize=letter)
    width, height = letter

    # --- Header ---
    c.setFont("Helvetica-Bold", 18)
    c.drawString(inch, height - inch, "Compliance Canary Security Report")
    c.setFont("Helvetica", 12)
    c.drawString(inch, height - 1.25 * inch, f"Repository: {repo.name}")
    c.drawString(inch, height - 1.5 * inch, f"Scan Date: {timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}")
    c.line(inch, height - 1.75 * inch, width - inch, height - 1.75 * inch)

    # --- Summary ---
    c.setFont("Helvetica-Bold", 14)
    c.drawString(inch, height - 2.25 * inch, "Summary of Findings")

    y_pos = height - 2.75 * inch
    
    # DNS Exfil finding
    c.setFont("Helvetica-Bold", 12)
    c.drawString(inch, y_pos, "Potential DNS Exfiltration:")
    c.setFont("Helvetica", 12)
    status_dns = "DETECTED ⚠️" if findings.get('dns_exfil') else "Not Detected ✅"
    c.drawString(inch * 3.5, y_pos, status_dns)
    
    y_pos -= 0.5 * inch

    # SSRF finding
    c.setFont("Helvetica-Bold", 12)
    c.drawString(inch, y_pos, "Potential Server-Side Request Forgery (SSRF):")
    c.setFont("Helvetica", 12)
    status_ssrf = "DETECTED ⚠️" if findings.get('ssrf') else "Not Detected ✅"
    c.drawString(inch * 3.5, y_pos, status_ssrf)
    
    c.save()
    return file_path