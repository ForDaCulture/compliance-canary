MAP = {
    "OWASP_AIML03": {"CC": "CC6.1", "control": "Change Management"},
    "SSRF": {"CC": "CC8.1", "control": "Transmission Integrity"},
    "PHI_LEAK": {"CC": "CC1.4", "control": "Risk...
}
}
def annotate(findings):
    return [{**f, "soc2_refs": [MAP.get(f["rule"], {"CC": "CC0", "control": "Other"})]} for f in findings]
