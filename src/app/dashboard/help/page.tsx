"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  ChevronDown,
  Search,
  Book,
  Video,
  FileText,
  Clock,
  Send,
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { UserLayout, UserStatCard } from "@/components/user/UserLayout";
import { GoldButton, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const faqs = [
  {
    category: "Getting Started",
    items: [
      {
        q: "How do I submit my first track?",
        a: "Simply click 'Submit New Track' in the sidebar, paste your Spotify or YouTube link, select a plan, and complete payment. Our team reviews your submission within 24 hours.",
      },
      {
        q: "What platforms do you support?",
        a: "We currently support Spotify and YouTube. More platforms including Apple Music and SoundCloud are coming soon.",
      },
      {
        q: "How long does a campaign last?",
        a: "Campaign duration depends on your plan: Starter (2 weeks), Premium (4 weeks), Professional (8 weeks). Track progress anytime in your dashboard.",
      },
    ],
  },
  {
    category: "Payments & Billing",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards via Stripe. Payments are secure and encrypted.",
      },
      {
        q: "Can I get a refund?",
        a: "Yes! We offer a 30-day money-back guarantee. If you're not satisfied, contact support and we'll issue a full refund.",
      },
      {
        q: "How do I view my billing history?",
        a: "Go to Settings → Billing to see all your past payments, amounts, and statuses.",
      },
    ],
  },
  {
    category: "Campaigns & Results",
    items: [
      {
        q: "How do you promote my music?",
        a: "We use organic methods including playlist placements, social media promotion, and curator outreach — all compliant with platform guidelines.",
      },
      {
        q: "When will I see results?",
        a: "Most campaigns show early results within 24–48 hours. Full results develop over your campaign duration.",
      },
      {
        q: "How many streams can I expect?",
        a: "Results vary by genre, quality, and plan. On average, users see 200–400% growth. Check our pricing page for per-plan estimates.",
      },
    ],
  },
  {
    category: "Account & Profile",
    items: [
      {
        q: "How do I update my profile information?",
        a: "Go to Settings → Profile to update your name, phone, location, bio, and genre.",
      },
      {
        q: "How does the referral system work?",
        a: "Share your unique referral code found in Settings → Profile. When someone signs up using your code, you earn credits toward future campaigns.",
      },
      {
        q: "Can I change my email address?",
        a: "Email is managed by your authentication provider. Please contact support if you need to update it.",
      },
    ],
  },
];

export default function UserHelpPage() {
  const [searchQuery,    setSearchQuery]    = useState("");
  const [expandedFaq,   setExpandedFaq]    = useState<string | null>(null);
  const [showForm,      setShowForm]        = useState(false);
  const [submitStatus,  setSubmitStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError,   setSubmitError]    = useState("");
  const [userProfile,   setUserProfile]    = useState<any>(null);

  const [form, setForm] = useState({
    subject:  "",
    message:  "",
    priority: "normal",
    name:     "",
    email:    "",
  });

  // Load user profile into form
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUserProfile(u);
      setForm(f => ({
        ...f,
        name:  u.display_name || u.name || "",
        email: u.email || "",
      }));
    } else {
      fetch("/api/auth/session").then(r => r.json()).then(({ user }) => {
        if (user) {
          setUserProfile(user);
          setForm(f => ({ ...f, name: user.name || "", email: user.email || "" }));
        }
      }).catch(() => {});
    }
  }, []);

  const handleSubmit = async () => {
    if (!form.subject.trim() || !form.message.trim()) return;
    
    setSubmitStatus("loading");
    setSubmitError("");

    try {
      const res = await fetch("/api/support", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject:   form.subject,
          message:   form.message,
          priority:  form.priority,
          userName:  form.name,
          userEmail: form.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setSubmitStatus("success");
      // Auto-close after 3 seconds
      setTimeout(() => {
        setShowForm(false);
        setSubmitStatus("idle");
        setForm(f => ({ ...f, subject: "", message: "", priority: "normal" }));
      }, 3000);
    } catch (e: any) {
      setSubmitStatus("error");
      setSubmitError(e.message || "Failed to send ticket. Please try again.");
    }
  };

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(
      item =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  const stats = [
    { title: "Avg Response",   value: "< 2hr",  icon: Clock,        color: "green"  as const },
    { title: "Support Hours",  value: "24/7",   icon: MessageSquare, color: "gold"  as const },
    { title: "FAQ Articles",   value: `${faqs.reduce((n, c) => n + c.items.length, 0)}`, icon: Book, color: "orange" as const },
    { title: "Video Guides",   value: "Coming", icon: Video,         color: "blue"  as const },
  ];

  return (
    <UserLayout title="Help & Support" subtitle="Get the help you need, when you need it" user={userProfile}>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <UserStatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Search + quick actions + contact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <GlowCard variant="premium" className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">How can we help?</h3>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gray" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 pl-12 text-white placeholder:text-luxury-gray"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Book,         label: "FAQ",        sub: `${faqs.reduce((n,c) => n + c.items.length, 0)} articles`, action: () => document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" }) },
                { icon: MessageSquare,label: "Contact",    sub: "Send a ticket",     action: () => setShowForm(true) },
                { icon: Mail,         label: "Email Us",   sub: "support@plugtoplaylist.com", action: () => window.open("mailto:support@plugtoplaylist.com") },
                { icon: FileText,     label: "Guidelines", sub: "Promotion rules",   action: () => {} },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className="flex flex-col items-center gap-2 p-4 bg-luxury-lighter/50 rounded-lg hover:bg-gold/10 transition-colors group"
                >
                  <item.icon className="w-6 h-6 text-gold group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-white">{item.label}</span>
                  <span className="text-xs text-luxury-gray text-center">{item.sub}</span>
                </button>
              ))}
            </div>
          </GlowCard>
        </div>

        {/* Contact options sidebar */}
        <GlowCard variant="default" className="p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center gap-3 p-3 bg-luxury-lighter/50 rounded-lg hover:bg-gold/10 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-gold" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Email Support</div>
                <div className="text-xs text-luxury-gray">support@plugtoplaylist.com</div>
              </div>
            </button>
            <div className="flex items-center gap-3 p-3 bg-luxury-lighter/50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Support Hours</div>
                <div className="text-xs text-luxury-gray">24/7 — avg reply &lt; 2hrs</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-luxury-lighter/50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Response Time</div>
                <div className="text-xs text-luxury-gray">Usually within 2 hours</div>
              </div>
            </div>
            <GoldButton className="w-full mt-2" onClick={() => setShowForm(true)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Open a Support Ticket
            </GoldButton>
          </div>
        </GlowCard>
      </div>

      {/* FAQ */}
      <GlowCard id="faq-section" variant="default" className="p-5">
        <h3 className="text-lg font-semibold text-white mb-6">Frequently Asked Questions</h3>
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10">
            <HelpCircle className="w-12 h-12 mx-auto text-gold/40 mb-3" />
            <p className="text-luxury-gray">No results for &ldquo;{searchQuery}&rdquo;</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredFaqs.map((cat, ci) => (
              <div key={ci}>
                <h4 className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">{cat.category}</h4>
                <div className="space-y-2">
                  {cat.items.map((item, ii) => {
                    const id = `${ci}-${ii}`;
                    const open = expandedFaq === id;
                    return (
                      <motion.div key={ii} className="bg-luxury-lighter/30 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedFaq(open ? null : id)}
                          className="w-full flex items-center justify-between p-4 text-left"
                        >
                          <span className="font-medium text-white pr-4">{item.q}</span>
                          <ChevronDown className={cn("w-5 h-5 text-gold flex-shrink-0 transition-transform", open && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                          {open && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="px-4 pb-4 text-sm text-luxury-gray leading-relaxed">{item.a}</div>
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
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => { if (submitStatus !== "loading") setShowForm(false); }}
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
              <div className="flex items-center justify-between p-5 border-b border-gold/10">
                <h3 className="text-lg font-semibold text-white">Open a Support Ticket</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 text-luxury-gray hover:text-white rounded-lg hover:bg-luxury-lighter transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Success state */}
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <h4 className="text-white font-semibold text-lg mb-2">Ticket Sent!</h4>
                    <p className="text-luxury-gray text-sm">
                      We've received your message and sent a confirmation to <strong className="text-white">{form.email}</strong>. We'll reply within 2 hours.
                    </p>
                  </motion.div>
                )}

                {/* Form */}
                {submitStatus !== "success" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Your Name</Label>
                        <Input
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder="Full name"
                          className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Email</Label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          placeholder="your@email.com"
                          className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white text-sm">Priority</Label>
                      <select
                        value={form.priority}
                        onChange={e => setForm({ ...form, priority: e.target.value })}
                        className="w-full h-10 bg-luxury-lighter border border-gold/20 rounded-lg px-3 text-white focus:border-gold focus:outline-none"
                      >
                        <option value="low">Low — General question</option>
                        <option value="normal">Normal — Need assistance</option>
                        <option value="high">High — Urgent issue</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white text-sm">Subject *</Label>
                      <Input
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        placeholder="Brief description of your issue"
                        className="bg-luxury-lighter border-gold/20 focus:border-gold text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white text-sm">Message *</Label>
                      <textarea
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="Describe your issue in detail. The more information you provide, the faster we can help."
                        rows={5}
                        className="w-full bg-luxury-lighter border border-gold/20 rounded-lg p-3 text-white placeholder:text-luxury-gray focus:border-gold focus:outline-none resize-none"
                      />
                    </div>

                    {submitStatus === "error" && (
                      <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {submitError}
                      </div>
                    )}

                    <div className="flex gap-3 pt-1">
                      <GoldButton variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
                        Cancel
                      </GoldButton>
                      <GoldButton
                        className="flex-1"
                        onClick={handleSubmit}
                        loading={submitStatus === "loading"}
                        disabled={!form.subject.trim() || !form.message.trim() || submitStatus === "loading"}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Ticket
                      </GoldButton>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UserLayout>
  );
}
