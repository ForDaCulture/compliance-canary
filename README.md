# Compliance Canary 🛡️🐦
Stop breaches before auditors find them. Continuous offensive testing and automated evidence generation for modern development teams.

# Compliance Canary is a developer-first security and compliance automation platform. It connects directly to your GitHub repositories to perform nightly scans, using a combination of static analysis and AI-powered anomaly detection to find vulnerabilities before they become critical incidents.

# 🎯 Why Compliance Canary?
In today's fast-paced development cycles, security and compliance can feel like a bottleneck. Teams are shipping hundreds of commits a day, while compliance frameworks like SOC 2, HIPAA, and ISO 27001 demand constant vigilance and evidence collection. This creates a dangerous gap where a single bad commit can lead to a multi-million dollar breach.

# Compliance Canary bridges that gap by:

Automating the Offense: We act as your automated "purple team," constantly probing your codebase for weaknesses from an attacker's perspective.

Simplifying the Defense: We generate clear, audit-ready reports that provide concrete evidence of your security posture, turning a stressful, manual process into a single click.

Shifting Security Left: By integrating directly into the development lifecycle, we empower developers to find and fix issues early, saving time, money, and reputation.

# ✨ Key Features
Continuous Repository Scanning: Nightly scans of your codebase for common vulnerabilities (SSRF, DNS Exfiltration patterns, etc.) and hardcoded secrets.

AI-Powered Anomaly Detection: (Roadmap) Our models learn your codebase's normal behavior to flag suspicious commits and dependencies that traditional scanners miss.

Audit-Ready PDF Reports: Generate professional reports with a single click, providing clear evidence for auditors and stakeholders.

GitHub OAuth Integration: Secure, one-click sign-in and repository management. No new passwords to remember.

Developer-Friendly Workflow: Built for developers, by developers. No complex setups or enterprise sales calls.

# 🛠️ Tech Stack
This project is a monorepo containing a decoupled frontend and backend.

Backend:

Framework: FastAPI (Python 3.10+)

Database: SQLAlchemy with SQLite (for MVP)

Authentication: Authlib for GitHub OAuth2

Scheduled Jobs: APScheduler

PDF Generation: ReportLab

# Frontend:

Framework: Next.js 14+ with App Router

Language: TypeScript

Styling: Tailwind CSS

UI Components: Shadcn/UI

Animations: Framer Motion

Authentication: NextAuth.js

# 🚀 Getting Started
Follow these steps to get a local copy of Compliance Canary up and running.

Prerequisites
Python 3.10+

Node.js 20+

pnpm (install with npm install -g pnpm)

GitHub OAuth App credentials

SendGrid API Key

1. Clone the Repository
git clone [https://github.com/ForDaCulture/compliance-canary.git](https://github.com/ForDaCulture/compliance-canary.git)
cd compliance-canary

2. Backend Setup
First, set up and run the Python backend.

# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate # On Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file from the example and fill in your keys
cp .env.example .env
# nano .env

Your backend/.env file should look like this:

DATABASE_URL="sqlite:///./canary.db"
GITHUB_CLIENT_ID="YOUR_GITHUB_CLIENT_ID"
GITHUB_CLIENT_SECRET="YOUR_GITHUB_CLIENT_SECRET"
SENDGRID_API_KEY="YOUR_SENDGRID_API_KEY"
FRONTEND_URL="http://localhost:3000"

3. Frontend Setup
Next, set up and run the Next.js frontend in a separate terminal.

# Navigate to the frontend directory from the project root
cd frontend

# Install dependencies
pnpm install

# Create a .env.local file and fill in your keys
# You can use the same GitHub keys as the backend
# Generate a NEXTAUTH_SECRET with: openssl rand -base64 32

Your frontend/.env.local file should look like this:

NEXT_PUBLIC_API_URL="http://localhost:8000"
GITHUB_ID="YOUR_GITHUB_CLIENT_ID"
GITHUB_SECRET="YOUR_GITHUB_CLIENT_SECRET"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="YOUR_GENERATED_SECRET"

4. Run the Application
You need two terminals running concurrently.

Terminal 1 (Project Root): Start the backend server.

# Make sure your virtual environment is active
python run.py

Terminal 2 (Frontend Directory): Start the frontend development server.

# Navigate to frontend/
pnpm dev

Open your browser to http://localhost:3000 to see the application live.

🗺️ Project Roadmap
This project is currently at the MVP stage. Our roadmap for the next phases includes:

[ ] Billing Integration: Implement Stripe for metered (free) and pro-tier plans.

[ ] Enhanced Scanners: Integrate industry-standard tools like Semgrep and TruffleHog for deeper static analysis and secret scanning.

[ ] Dashboard V2: Build out data visualizations, historical security posture trends, and repository-specific settings.

[ ] Team Invites: Allow organization owners to invite team members with read-only access.

[ ] CI/CD Integration: Provide a GitHub Action to run scans on every pull request.

🤝 Contributing
Contributions are welcome! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

Fork the repository.

Create your feature branch (git checkout -b feature/amazing-feature).

Commit your changes (git commit -m 'Add some amazing feature').

Push to the branch (git push origin feature/amazing-feature).

Open a Pull Request.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.