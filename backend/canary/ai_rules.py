from pathlib import Path
import bandit, re

AI_DETECTORS = {
    "OWASP_AIML03": re.compile(r"(openai\.com|.openai\.co)/v1", re.I),
    "OWASP_AIML04": re.compile(r"(http://).*\.\w+\.com/ai_endpoint", re.I),
    "PHI_LEAK": re.compile(r"\b(patient[\s_-]?id|mrn|\d{4}-\d{2}-\d{4})\b", re.I),
}

def scan_ai(findings, repo_root: Path):
    for g in bandit.run(repo_root):
        findings.append({**g, "ai": False})
    for file in repo_root.rglob("**/*"):
        for rule, rx in AI_DETECTORS.items():
            if rx.search(file.read_text(errors="ignore")):
                findings.append({"file": str(file), "rule": rule, "level": "error", "ai": True})