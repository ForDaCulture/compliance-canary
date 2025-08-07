// frontend/app/page.tsx
"use client";

import Link from "next/link";
import { ShieldCheck, BarChart, Bot, GitBranch, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

// Utility to combine Tailwind classes
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
const cn = (...inputs: any[]) => twMerge(clsx(inputs));

// Animated CTA Button
const AnimatedCTA = ({ text }: { text: string }) => (
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
    whileTap={{ scale: 0.95 }}
    className="relative group"
  >
    <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
    <Link
      href="/api/auth/signin"
      className="relative inline-flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-lg shadow-md transition-all duration-300"
    >
      {text}
      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
    </Link>
  </motion.div>
);

// Animated Section Wrapper
const AnimatedSection = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Feature Card Component
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
    className="bg-black/50 rounded-lg p-6 hover:bg-black/70 transition-all duration-300 border border-teal-500/20 hover:border-teal-500/50"
  >
    <div className="w-16 h-16 bg-teal-900/50 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{description}</p>
  </motion.div>
);

// Main Landing Page
export default function Home() {
  const { scrollYProgress } = useScroll();
  const ref = useRef<HTMLDivElement>(null);

  // Parallax effect for background blobs
  const blob1Y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const blob3Y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // Cursor-based parallax (simplified version)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (clientX - centerX) * 0.02; // Adjust sensitivity
        const moveY = (clientY - centerY) * 0.02;
        ref.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Parallax Background with Cursor Interaction */}
      <div className="absolute inset-0 -z-10 overflow-hidden" ref={ref}>
        <motion.div
          style={{ y: blob1Y }}
          className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl animate-pulse"
        />
        <motion.div
          style={{ y: blob2Y }}
          className="absolute top-[10%] left-[40%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"
        />
        <motion.div
          style={{ y: blob3Y }}
          className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-3xl animate-pulse animation-delay-4000"
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-md p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-400" />
            <span className="font-bold text-xl">Compliance Canary</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="#features" className="hover:text-teal-400 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-teal-400 transition-colors">
              Pricing
            </Link>
          </nav>
          <Link
            href="/api/auth/signin"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-teal-500 hover:bg-teal-600 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="hero" className="py-20 md:py-32 container mx-auto text-center">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Stop Breaches Before Auditors Find Them
              </h1>
              <p className="text-lg md:text-xl mb-10 text-gray-300">
                Compliance Canary provides continuous offensive testing and automated evidence generation for HIPAA, SOC 2, and ISO 27001. Turn your GitHub into a fortress of compliance.
              </p>
              <AnimatedCTA text="Start Your Free Scan" />
            </div>
          </AnimatedSection>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 container mx-auto">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Automated Security, On Autopilot</h2>
              <p className="text-gray-300">Connect your repository and let our AI-powered engine do the heavy lifting.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<GitBranch className="w-10 h-10 text-teal-400" />}
                title="Continuous Repository Scanning"
                description="Nightly scans identify vulnerabilities like DNS exfiltration and hardcoded secrets."
              />
              <FeatureCard
                icon={<Bot className="w-10 h-10 text-teal-400" />}
                title="AI-Powered Anomaly Detection"
                description="Flag suspicious commits and dependencies that traditional scanners miss."
              />
              <FeatureCard
                icon={<BarChart className="w-10 h-10 text-teal-400" />}
                title="Audit-Ready PDF Reports"
                description="Generate comprehensive reports with a single click for auditors."
              />
            </div>
          </AnimatedSection>
        </section>

        {/* CTA Section */}
        <section id="pricing" className="py-20 bg-black/30 backdrop-blur-md">
          <div className="container mx-auto">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Fortify Your Compliance?</h2>
                <p className="text-gray-300 mb-8">
                  Get started for free. No credit card required. Scan your first public repository and see the results.
                </p>
                <AnimatedCTA text="Connect GitHub Now" />
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black/70 text-gray-400 p-6 text-center">
        <p>&copy; {new Date().getFullYear()} Compliance Canary. All rights reserved.</p>
      </footer>
    </div>
  );
}