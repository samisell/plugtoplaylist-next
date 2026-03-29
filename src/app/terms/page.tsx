"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Music, FileText } from "lucide-react";
import { Header, Footer } from "@/components/shared";

const terms = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing and using PlugToPlaylist ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. Additionally, when using the Service, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this Service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this Service.`,
  },
  {
    title: "2. Description of Service",
    content: `PlugToPlaylist provides music promotion services including but not limited to playlist placement, social media promotion, and email marketing campaigns. We connect artists with playlist curators and promotional networks to help increase their music's reach and engagement.`,
  },
  {
    title: "3. User Accounts",
    content: `To access certain features of the Service, you must register for an account. When you register, you will be required to provide information about yourself. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.

You are responsible for maintaining the confidentiality of your account password and are responsible for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.`,
  },
  {
    title: "4. Payment Terms",
    content: `All payments for services are processed through our authorized payment processors. You agree to pay all fees and charges associated with your account on a timely basis and with a valid payment method. All payments are non-refundable except as expressly stated in these Terms.

Prices for our services are subject to change without notice. We reserve the right to modify or discontinue any service at any time.`,
  },
  {
    title: "5. Content Guidelines",
    content: `You agree not to submit content that:
• Is illegal, harmful, or violates any laws
• Infringes on intellectual property rights of others
• Contains viruses or malicious code
• Is defamatory, obscene, or offensive
• Promotes discrimination or hate speech

We reserve the right to reject any submission that violates these guidelines without refund.`,
  },
  {
    title: "6. Intellectual Property",
    content: `The Service and its original content, features, and functionality are owned by PlugToPlaylist and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

You retain ownership of the content you submit to our Service. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute your content in connection with our promotional services.`,
  },
  {
    title: "7. Disclaimer of Warranties",
    content: `The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the Service or the results of our promotional efforts. We do not guarantee specific streaming numbers, follower counts, or engagement metrics.

We do not warrant that the Service will be uninterrupted, secure, or error-free. We are not responsible for any issues arising from platform policy changes by Spotify, YouTube, or other third-party services.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `In no event shall PlugToPlaylist, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.

Our total liability for any claims arising from or related to the Service shall not exceed the amount you paid for the specific service giving rise to the claim.`,
  },
  {
    title: "9. Indemnification",
    content: `You agree to defend, indemnify, and hold harmless PlugToPlaylist and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses arising from your use of and access to the Service.`,
  },
  {
    title: "10. Governing Law",
    content: `These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.`,
  },
  {
    title: "11. Changes to Terms",
    content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.`,
  },
  {
    title: "12. Contact Us",
    content: `If you have any questions about these Terms, please contact us at:

Email: legal@plugtoplaylist.com
Address: Los Angeles, CA, United States`,
  },
];

export default function TermsPage() {
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
                <FileText className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Terms of Service</h1>
                <p className="text-luxury-gray">Last updated: January 2024</p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            {terms.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-luxury-dark border border-gold/10 rounded-xl p-6"
              >
                <h2 className="text-lg font-semibold text-gold mb-3">{section.title}</h2>
                <div className="text-luxury-gray leading-relaxed whitespace-pre-line text-sm">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 bg-luxury-dark border border-gold/10 rounded-xl text-center"
          >
            <p className="text-luxury-gray mb-4">
              Questions about our Terms of Service?
            </p>
            <Link href="/contact" className="text-gold hover:text-brand-orange font-medium">
              Contact our legal team →
            </Link>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
