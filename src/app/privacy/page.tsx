"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Header, Footer } from "@/components/shared";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us, including:
• Name and email address when you create an account
• Payment information when you make a purchase
• Music links and metadata when you submit tracks
• Communications you send to our support team
• Survey responses and feedback

We also collect information automatically when you use our Service:
• Device information (browser type, operating system)
• Log data (IP address, access times, pages viewed)
• Cookies and similar tracking technologies`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:
• Provide, maintain, and improve our services
• Process transactions and send related information
• Send promotional communications (with your consent)
• Respond to your comments, questions, and requests
• Monitor and analyze trends, usage, and activities
• Detect, investigate, and prevent fraudulent transactions
• Personalize and improve the Service and provide recommendations`,
  },
  {
    title: "3. Information Sharing",
    content: `We may share your information in the following situations:
• With service providers who perform services on our behalf
• With playlist curators and promotional partners (only necessary information)
• To comply with legal obligations
• To protect our rights, privacy, safety, or property
• In connection with a merger, acquisition, or sale of assets

We do not sell your personal information to third parties.`,
  },
  {
    title: "4. Data Security",
    content: `We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:

• SSL encryption for all data transmissions
• Secure password storage with industry-standard hashing
• Regular security audits and vulnerability assessments
• Access controls and authentication for sensitive data
• Secure payment processing through PCI-compliant providers

However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "5. Data Retention",
    content: `We retain your personal information for as long as your account is active or as needed to provide you services. We will also retain your information as necessary to:

• Comply with our legal obligations
• Resolve disputes
• Enforce our agreements
• Support business operations

When data is no longer needed, we securely delete or anonymize it.`,
  },
  {
    title: "6. Your Rights",
    content: `Depending on your location, you may have the following rights:
• Access: Request a copy of your personal data
• Rectification: Request correction of inaccurate data
• Erasure: Request deletion of your personal data
• Portability: Request transfer of your data
• Objection: Object to processing of your data
• Withdrawal: Withdraw consent at any time

To exercise these rights, please contact us at privacy@plugtoplaylist.com.`,
  },
  {
    title: "7. Cookies and Tracking",
    content: `We use cookies and similar tracking technologies to:
• Remember your preferences and settings
• Understand how you use our Service
• Personalize content and recommendations
• Measure the effectiveness of campaigns
• Provide relevant advertising

You can control cookies through your browser settings. Disabling cookies may affect your experience with our Service.`,
  },
  {
    title: "8. Third-Party Services",
    content: `Our Service may contain links to third-party websites and services, including:
• Spotify and YouTube for music streaming
• Payment processors (Paystack, Flutterwave)
• Analytics providers
• Social media platforms

We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.`,
  },
  {
    title: "9. Children's Privacy",
    content: `Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so we can take necessary actions.`,
  },
  {
    title: "10. International Data Transfers",
    content: `Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws.

By using our Service, you consent to the transfer of your information to the United States and other countries where we operate.`,
  },
  {
    title: "11. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.

For significant changes, we will provide notice through our Service or via email. We encourage you to review this Privacy Policy periodically.`,
  },
  {
    title: "12. Contact Us",
    content: `If you have any questions about this Privacy Policy, please contact us:

Privacy Officer
Email: privacy@plugtoplaylist.com
Address: Los Angeles, CA, United States

We will respond to your inquiry within 30 days.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-luxury-black text-white flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-luxury-gray hover:text-gold mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
                <p className="text-luxury-gray">Last updated: January 2024</p>
              </div>
            </div>

            <p className="text-luxury-gray leading-relaxed">
              At PlugToPlaylist, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-4 bg-luxury-dark border border-gold/10 rounded-xl"
          >
            <h3 className="text-sm font-medium text-white mb-3">Quick Navigation</h3>
            <div className="flex flex-wrap gap-2">
              {sections.map((section, index) => (
                <a
                  key={index}
                  href={`#section-${index}`}
                  className="text-xs text-luxury-gray hover:text-gold transition-colors"
                >
                  {section.title.replace(/^\d+\.\s/, "")}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {sections.map((section, index) => (
              <motion.div
                key={index}
                id={`section-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-luxury-dark border border-gold/10 rounded-xl p-6 scroll-mt-24"
              >
                <h2 className="text-lg font-semibold text-gold mb-3">{section.title}</h2>
                <div className="text-luxury-gray leading-relaxed whitespace-pre-line text-sm">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="p-4 bg-luxury-dark border border-gold/10 rounded-xl text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-white mb-1">GDPR Compliant</h4>
              <p className="text-xs text-luxury-gray">We comply with European data protection regulations</p>
            </div>
            <div className="p-4 bg-luxury-dark border border-gold/10 rounded-xl text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-white mb-1">Encrypted Data</h4>
              <p className="text-xs text-luxury-gray">All sensitive data is encrypted at rest and in transit</p>
            </div>
            <div className="p-4 bg-luxury-dark border border-gold/10 rounded-xl text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-gold/20 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-white mb-1">Your Rights</h4>
              <p className="text-xs text-luxury-gray">Access, correct, or delete your data anytime</p>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
