// frontend/app/page.tsx
"use client";

import Link from "next/link";
import { ShieldCheck, BarChart, Bot, GitBranch, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState, ReactNode } from "react";

// Animated CTA Button with Interactive Sheen
const AnimatedCTA = ({ text }: { text: string }) => {
  const GITHUB_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/github`;
  const btnRef = useRef<HTMLAnchorElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btnRef.current.style.setProperty("--mouse-x", `${x}px`);
      btnRef.current.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <Link
      href={GITHUB_AUTH_URL}
      ref={btnRef}
      onMouseMove={onMouseMove}
      className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-shadow duration-300 overflow-hidden rounded-lg bg-gray-900 shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#08f,0_0_15px_#08f,0_0_30px_#08f]"
    >
      <div className="absolute inset-0 transition-all duration-300 bg-gray-900 group-hover:bg-gray-900/80" />
      <span className="relative z-10 flex items-center">
        {text}
        <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
      {/* Interactive Sheen Effect */}
      <div
        className="absolute inset-0 z-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(168, 85, 247, 0.4), transparent 40%)`,
        }}
      />
    </Link>
  );
};

// Animated Section Wrapper (Framer Motion)
const AnimatedSection = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Feature Card Component with Glow Effect
const FeatureCard = ({ icon, title, description }: { icon: ReactNode; title: string; description: string; }) => (
  <div className="glow-card">
    <div className="relative z-10">
      <div className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

// Main Landing Page Component
export default function Home() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="aurora-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-400" />
            <span className="font-bold text-xl text-white">Compliance Canary</span>
          </Link>
          <nav className="hidden md:flex space-x-6 text-gray-300">
            <Link href="#features" className="hover:text-teal-300 transition-colors">Features</Link>
            <Link href="#cta" className="hover:text-teal-300 transition-colors">Get Started</Link>
          </nav>
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/github`}
            className="hidden md:inline-block px-4 py-2 text-sm font-medium rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section id="hero" className="py-24 md:py-32 container mx-auto text-center">
          <AnimatedSection className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-shimmer">
              Stop Breaches Before Auditors Find Them.
            </h1>
            <p className="text-lg md:text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
              Compliance Canary provides continuous offensive testing for HIPAA, SOC 2, & ISO 27001. Turn your GitHub into a fortress of compliance.
            </p>
            <AnimatedCTA text="Start Your Free Scan" />
          </AnimatedSection>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 container mx-auto">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Security on Autopilot</h2>
            <p className="text-gray-400">Connect your repository and let our engine do the heavy lifting.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<GitBranch className="w-8 h-8 text-teal-400" />}
              title="Continuous Repository Scanning"
              description="Nightly scans identify vulnerabilities like DNS exfiltration and hardcoded secrets before they become a problem."
            />
            <FeatureCard
              icon={<Bot className="w-8 h-8 text-teal-400" />}
              title="AI-Powered Anomaly Detection"
              description="Our engine flags suspicious commits and dependencies that traditional signature-based scanners often miss."
            />
            <FeatureCard
              icon={<BarChart className="w-8 h-8 text-teal-400" />}
              title="Audit-Ready PDF Reports"
              description="Generate comprehensive, easy-to-read reports with a single click, providing clear evidence for auditors."
            />
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-20">
          <div className="container mx-auto">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-800">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Fortify Your Compliance?</h2>
                <p className="text-gray-300 mb-8">
                  Get started for free. No credit card required. Scan your first public repository and see what we find.
                </p>
                <AnimatedCTA text="Connect GitHub Now" />
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 text-gray-500 p-6 text-center relative z-10 border-t border-gray-800 mt-20">
        <p>&copy; {new Date().getFullYear()} Compliance Canary. All rights reserved.</p>
      </footer>
    </div>
  );
}