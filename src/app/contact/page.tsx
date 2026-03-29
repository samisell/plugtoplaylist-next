"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  MessageSquare,
  HelpCircle,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Header, Footer, GoldButton, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    value: "support@plugtoplaylist.com",
    description: "We typically respond within 24 hours",
    color: "gold",
  },
  {
    icon: Phone,
    title: "Phone Support",
    value: "+1 (555) 123-4567",
    description: "Mon-Fri from 9am to 6pm PST",
    color: "orange",
  },
  {
    icon: MapPin,
    title: "Office Location",
    value: "Los Angeles, CA",
    description: "Visit us by appointment only",
    color: "gold",
  },
];

const faqs = [
  {
    question: "How long does it take to see results?",
    answer: "Most campaigns begin showing results within 24-48 hours of activation. Full campaign results typically develop over 2-8 weeks depending on your plan.",
  },
  {
    question: "Is my music eligible for promotion?",
    answer: "We accept all genres of music. Your track just needs to be available on Spotify or YouTube. We review each submission to ensure the best possible promotion strategy.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and local payment methods through Paystack and Flutterwave.",
  },
];

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-luxury-black text-white flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get in <span className="text-gold">Touch</span>
            </h1>
            <p className="text-lg text-luxury-gray max-w-2xl">
              Have questions about our services? We&apos;re here to help. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </motion.div>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto text-center py-16"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Message Sent!</h2>
              <p className="text-luxury-gray mb-6">
                Thank you for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
              <GoldButton onClick={() => setIsSubmitted(false)}>
                Send Another Message
              </GoldButton>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlowCard variant="premium" hover={false} className="p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-gold" />
                    Send us a message
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 text-white placeholder:text-luxury-gray"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 text-white placeholder:text-luxury-gray"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-white">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="bg-luxury-lighter border-gold/20 focus:border-gold h-12 text-white placeholder:text-luxury-gray"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-luxury-lighter border-gold/20 focus:border-gold min-h-[150px] text-white placeholder:text-luxury-gray resize-none"
                        required
                      />
                    </div>

                    <GoldButton type="submit" className="w-full" size="lg" loading={isLoading}>
                      <Send className="w-4 h-4 mr-2" />
                      {isLoading ? "Sending..." : "Send Message"}
                    </GoldButton>
                  </form>
                </GlowCard>
              </motion.div>

              {/* Contact Info & FAQs */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Contact Methods */}
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <GlowCard key={index} variant="default" className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          method.color === "gold" ? "bg-gold/20" : "bg-brand-orange/20"
                        }`}>
                          <method.icon className={`w-5 h-5 ${
                            method.color === "gold" ? "text-gold" : "text-brand-orange"
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{method.title}</h3>
                          <p className="text-gold text-sm">{method.value}</p>
                          <p className="text-xs text-luxury-gray">{method.description}</p>
                        </div>
                      </div>
                    </GlowCard>
                  ))}
                </div>

                {/* Support Hours */}
                <div className="p-4 bg-luxury-dark border border-gold/10 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-gold" />
                    <h3 className="font-medium text-white">Support Hours</h3>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-luxury-gray">Monday - Friday</span>
                      <span className="text-white">9:00 AM - 6:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-luxury-gray">Saturday</span>
                      <span className="text-white">10:00 AM - 4:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-luxury-gray">Sunday</span>
                      <span className="text-luxury-gray">Closed</span>
                    </div>
                  </div>
                </div>

                {/* Quick FAQs */}
                <div>
                  <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-gold" />
                    Quick Answers
                  </h3>
                  <div className="space-y-3">
                    {faqs.map((faq, index) => (
                      <div key={index} className="p-4 bg-luxury-dark border border-gold/10 rounded-xl">
                        <h4 className="text-sm font-medium text-white mb-1">{faq.question}</h4>
                        <p className="text-xs text-luxury-gray">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
