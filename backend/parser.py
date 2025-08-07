# backend/parser.py
import os
import tempfile
import subprocess
import re
from datetime import datetime

DNS_PATTERN = re.compile(r"(requests\.get\(|urllib.*urlopen\().*(https?:)?//.*", flags=re.I)
SSRF_PATTERN = re.compile(r"(requests\.get\(|urllib.*urlopen\().*(localhost|127\.0\.0\.1|169\.254|internal)", flags=re.I)

def py_files(d):
    return [os.path.join(r, f) for r, _, fs in os.walk(d) for f in fs if f.endswith(".py")]

def detect_dns_exfil(path):
    return any(DNS_PATTERN.search(open(f, encoding='utf-8').read()) for f in py_files(path))

def detect_ssrf(path):
    return any(SSRF_PATTERN.search(open(f, encoding='utf-8').read()) for f in py_files(path))

def scan_repository(clone_url: str, token: str):
    with tempfile.TemporaryDirectory() as tmp:
        url = clone_url.replace("https://", f"https://{token}:x-oauth-basic@")
        subprocess.run(["git", "clone", "--depth=1", url, tmp], check=True)
        results = {
            "id": os.urandom(8).hex(),
            "dns_exfil": detect_dns_exfil(tmp),
            "ssrf": detect_ssrf(tmp),
            "timestamp": str(datetime.utcnow()),
        }
    return results