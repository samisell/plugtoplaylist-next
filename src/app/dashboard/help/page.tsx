"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  ChevronDown,
  ChevronRight,
  Search,
  Book,
  Video,
  FileText,
  ExternalLink,
  Clock,
  Send,
} from "lucide-react";
import { UserLayout, UserStatCard } from "@/components/user/UserLayout";
import { GoldButton, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const stats = [
  { title: "Support Tickets", value: "0", icon: MessageSquare, color: "gold" as const },
  { title: "Avg Response", value: "< 2hrs", icon: Clock, color: "green" as const },
  { title: "Help Articles", value: "45", icon: Book, color: "orange" as const },
  { title: "Video Guides", value: "12", icon: Video, color: "blue" as const },
];

const faqs = [
  {
    category: "Getting Started",
    items: [
      {
        q: "How do I submit my first track?",
        a: "Simply click the 'Submit Your Song' button, paste your Spotify or YouTube link, select a plan, and complete the payment. Our team will review your submission within 24 hours.",
      },
      {
        q: "What platforms do you support?",
        a: "We currently support Spotify and YouTube Music. We're working on adding more platforms including Apple Music, SoundCloud, and Amazon Music.",
      },
      {
        q: "How long does a campaign last?",
        a: "Campaign duration depends on your plan: Starter (2 weeks), Premium (4 weeks), and Professional (8 weeks). You can track progress in your dashboard.",
      },
    ],
  },
  {
    category: "Payments & Billing",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards through Paystack and Flutterwave. We also support local payment methods in select countries.",
      },
      {
        q: "Can I get a refund?",
        a: "Yes! We offer a 30-day money-back guarantee. If you're not satisfied with the results, contact support for a full refund.",
      },
      {
        q: "How do I update my payment method?",
        a: "Go to Settings > Billing > Payment Methods to add, edit, or remove your payment methods.",
      },
    ],
  },
  {
    category: "Campaigns & Results",
    items: [
      {
        q: "How do you promote my music?",
        a: "We use organic methods including playlist placements, social media promotion, email marketing, and influencer outreach - all compliant with platform guidelines.",
      },
      {
        q: "When will I see results?",
        a: "Most campaigns show results within 24-48 hours of activation. Full campaign results develop over the duration of your plan.",
      },
      {
        q: "How many streams can I expect?",
        a: "Results vary based on genre, quality, and plan. On average, our users see 300% growth in streams. Check our pricing page for estimates per plan.",
      },
    ],
  },
];

const quickHelpItems = [
  { icon: Book, label: "Knowledge Base", href: "#", count: "45 articles" },
  { icon: Video, label: "Video Tutorials", href: "#", count: "12 videos" },
  { icon: FileText, label: "API Docs", href: "#", count: "For developers" },
  { icon: MessageSquare, label: "Live Chat", href: "#", count: "Available 24/7" },
];

export default function UserHelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    priority: "normal",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowContactForm(false);
    setContactForm({ subject: "", message: "", priority: "normal" });
  };

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.items.length > 0);

  return (
    <UserLayout
      title="Help & Support"
      subtitle="Get help with your account and submissions"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <UserStatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Search & Quick Help */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Search */}
        <div className="lg:col-span-2">
          <GlowCard variant="premium" className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">How can we help you?</h3>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray" />
              <Input
                placeholder="Search for help articles, FAQs, tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 pl-12 text-white placeholder:text-luxury-gray"
              />
            </div>

            {/* Quick Help Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickHelpItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex flex-col items-center gap-2 p-4 bg-luxury-lighter/50 rounded-lg hover:bg-gold/10 transition-colors group"
                >
                  <item.icon className="w-6 h-6 text-gold group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-white">{item.label}</span>
                  <span className="text-xs text-luxury-gray">{item.count}</span>
                </a>
              ))}
            </div>
          </GlowCard>
        </div>

        {/* Contact Options */}
        <GlowCard variant="default" className="p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowContactForm(true)}
              className="w-full flex items-center gap-3 p-3 bg-luxury-lighter/50 rounded-lg hover:bg-gold/10 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-gold" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Email Support</div>
                <div className="text-xs text-luxury-gray">support@plugtoplaylist.com</div>
              </div>
            </button>
            <div className="flex items-center gap-3 p-3 bg-luxury-lighter/50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Phone Support</div>
                <div className="text-xs text-luxury-gray">+1 (555) 123-4567</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-luxury-lighter/50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-brand-orange/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Support Hours</div>
                <div className="text-xs text-luxury-gray">24/7 Available</div>
              </div>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* FAQs */}
      <GlowCard variant="default" className="p-5">
        <h3 className="text-lg font-semibold text-white mb-6">Frequently Asked Questions</h3>
        
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-8">
            <HelpCircle className="w-12 h-12 mx-auto text-gold/50 mb-3" />
            <p className="text-luxury-gray">No results found for &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFaqs.map((category, catIndex) => (
              <div key={catIndex}>
                <h4 className="text-sm font-medium text-gold mb-3 uppercase tracking-wider">
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => {
                    const faqId = `${catIndex}-${itemIndex}`;
                    const isExpanded = expandedFaq === faqId;
                    
                    return (
                      <motion.div
                        key={itemIndex}
                        initial={false}
                        className="bg-luxury-lighter/30 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                          className="w-full flex items-center justify-between p-4 text-left"
                        >
                          <span className="font-medium text-white pr-4">{item.q}</span>
                          <ChevronDown
                            className={cn(
                              "w-5 h-5 text-gold flex-shrink-0 transition-transform",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="px-4 pb-4 text-sm text-luxury-gray">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlowCard>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactForm(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-luxury-dark border border-gold/20 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gold/10">
                <h3 className="text-lg font-semibold text-white">Contact Support</h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="p-2 text-luxury-gray hover:text-white"
                >
                  ×
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Subject</Label>
                  <Input
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                    className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Priority</Label>
                  <select
                    value={contactForm.priority}
                    onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                    className="w-full h-10 bg-luxury-lighter border border-gold/20 rounded-lg px-3 text-white focus:border-gold focus:outline-none"
                  >
                    <option value="low">Low - General question</option>
                    <option value="normal">Normal - Need assistance</option>
                    <option value="high">High - Urgent issue</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Message</Label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Describe your issue in detail..."
                    className="w-full h-32 bg-luxury-lighter border border-gold/20 rounded-lg p-3 text-white placeholder:text-luxury-gray focus:border-gold focus:outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <GoldButton
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowContactForm(false)}
                  >
                    Cancel
                  </GoldButton>
                  <GoldButton
                    className="flex-1"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </GoldButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UserLayout>
  );
}
