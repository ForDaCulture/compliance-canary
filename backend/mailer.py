# /backend/mailer.py
import os
import sendgrid
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileName, FileType, Disposition
import base64

sg = sendgrid.SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))

def send_report_email(recipient_email: str, repo_name: str, pdf_path: str):
    message = Mail(
        from_email='reports@compliance-canary.com',
        to_emails=recipient_email,
        subject=f'Your Weekly Compliance Canary Report for {repo_name}',
        html_content=f'<strong>Hi there,</strong><br><br>Attached is your latest security report for the repository: {repo_name}.<br><br>Stay compliant,<br>The Compliance Canary Team'
    )

    with open(pdf_path, 'rb') as f:
        data = f.read()
    encoded_file = base64.b64encode(data).decode()

    attachedFile = Attachment(
        FileContent(encoded_file),
        FileName(os.path.basename(pdf_path)),
        FileType('application/pdf'),
        Disposition('attachment')
    )
    message.attachment = attachedFile

    try:
        response = sg.send(message)
        print(f"Email sent to {recipient_email}, Status Code: {response.status_code}")
    except Exception as e:
        print(f"Error sending email: {e}")