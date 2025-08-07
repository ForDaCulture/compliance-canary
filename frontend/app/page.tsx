"use client"; // This page is now interactive, so we need the client directive

import Link from 'next/link';
import { ShieldCheck, BarChart, Bot, GitBranch, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode } from 'react';

// --- Animated Call-to-Action Button ---
const AnimatedCTA = ({ text }: { text: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative group"
  >
    <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 opacity-75 blur-lg transition duration-1000 group-hover:opacity-100 group-hover:duration-200 animate-tilt"></div>
    <div
      className="relative inline-flex h-12 items-center justify-center rounded-md bg-gray-900 px-8 text-lg font-semibold text-white shadow-lg"
    >
      {text}
      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
    </div>
  </motion.div>
);

// --- Main Landing Page Component ---
export default function LandingPage() {
  const { scrollYProgress } = useScroll();

  // Parallax effect for the aurora blobs
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Aurora Background with Parallax */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <motion.div style={{ y: y1 }} className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full filter blur-3xl animate-blob"></motion.div>
        <motion.div style={{ y: y2 }} className="absolute top-[10%] left-[40%] w-[500px] h-[500px] bg-blue-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></motion.div>
        <motion.div style={{ y: y3 }} className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-teal-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></motion.div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-900/50 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="#" className="flex items-center gap-2 text-xl font-bold">
            <ShieldCheck className="h-7 w-7 text-teal-400" />
            <span>Compliance Canary</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="#features" className="hover:text-teal-400 transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-teal-400 transition-colors">Pricing</Link>
          </nav>
          <Link
            href="/api/auth/signin/github"
            className="inline-flex h-10 items-center justify-center rounded-md bg-teal-500 px-6 text-sm font-medium text-gray-900 shadow transition-colors hover:bg-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:pointer-events-none disabled:opacity-50"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center md:px-6 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Stop Breaches Before Auditors Find Them.
            </h1>
            <p className="mt-6 text-lg text-gray-300 md:text-xl">
              Compliance Canary provides continuous offensive testing and automated evidence generation for HIPAA, SOC 2, and ISO 27001. Turn your GitHub into a fortress of compliance.
            </p>
             <div className="mt-8 flex justify-center">
                <Link href="/api/auth/signin/github">
                  <AnimatedCTA text="Start Your Free Scan" />
                </Link>
              </div>
          </motion.div>
        </section>

        {/* Features Section with Staggered Animation */}
        <section id="features" className="w-full py-20 md:py-28 bg-gray-900/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Automated Security, On Autopilot.</h2>
              <p className="mt-4 text-gray-400 md:text-xl">
                Connect your repository and let our AI-powered engine do the heavy lifting.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<GitBranch className="h-8 w-8" />}
                title="Continuous Repository Scanning"
                description="Nightly scans of your codebase identify potential vulnerabilities like DNS exfiltration, SSRF, and hardcoded secrets before they become a problem."
                delay={0.1}
              />
              <FeatureCard
                icon={<Bot className="h-8 w-8" />}
                title="AI-Powered Anomaly Detection"
                description="Our models learn your codebase's normal behavior to flag suspicious commits and dependencies that traditional scanners miss."
                delay={0.2}
              />
              <FeatureCard
                icon={<BarChart className="h-8 w-8" />}
                title="Audit-Ready PDF Reports"
                description="Generate beautiful, comprehensive reports with a single click, providing clear evidence of your security posture for auditors and stakeholders."
                delay={0.3}
              />
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section id="pricing" className="w-full py-20 md:py-28">
            <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Fortify Your Compliance?</h2>
                <p className="max-w-2xl text-gray-400 md:text-xl">
                    Get started for free. No credit card required. Scan your first public repository and see the results for yourself.
                </p>
                 <Link href="/api/auth/signin/github">
                   <AnimatedCTA text="Connect GitHub Now" />
                </Link>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:px-6">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Compliance Canary. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// --- Feature Card Component with Animation ---
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className="flex flex-col items-start gap-4 rounded-lg border border-white/10 p-6 bg-white/5 transition-all hover:border-teal-400/50 hover:bg-white/10"
    >
      <div className="rounded-md bg-teal-500/10 p-3 text-teal-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
};
