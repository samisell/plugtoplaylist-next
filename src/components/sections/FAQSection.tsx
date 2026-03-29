"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does PlugToPlaylist work?",
    answer: "Simply submit your Spotify or YouTube link, choose a promotion plan, and we'll handle the rest. We work with our network of playlist curators and use targeted social promotion to get your music heard by the right audience.",
  },
  {
    question: "Is this service safe for my artist profile?",
    answer: "Absolutely! We use 100% organic promotion methods that comply with all platform guidelines. We never use bots, fake streams, or any practices that could harm your account. Your success and safety are our top priorities.",
  },
  {
    question: "How long until I see results?",
    answer: "Most campaigns begin showing results within 24-48 hours of activation. You'll notice increased streams, followers, and engagement as your music reaches new audiences through our playlist placements.",
  },
  {
    question: "What genres do you promote?",
    answer: "We promote all genres! From pop, hip-hop, and R&B to electronic, rock, country, and world music. Our diverse network of playlist curators covers every genre and subgenre imaginable.",
  },
  {
    question: "Can I track my campaign progress?",
    answer: "Yes! All plans include access to our analytics dashboard where you can track streams, playlist additions, geographic reach, and audience demographics in real-time.",
  },
  {
    question: "What if I'm not satisfied with the results?",
    answer: "We offer a 30-day money-back guarantee on all plans. If you're not completely satisfied with your campaign results, contact our support team for a full refund—no questions asked.",
  },
  {
    question: "Do you offer custom campaigns?",
    answer: "Yes! For established artists or labels with specific needs, we offer custom campaign packages. Contact our team to discuss your goals and we'll create a tailored promotion strategy.",
  },
  {
    question: "How do I get started?",
    answer: "Simply click 'Submit Your Song' at the top of the page, paste your music link, select your plan, and complete the payment. It takes less than 5 minutes to start your promotion journey.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-32 bg-luxury-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Frequently Asked <span className="text-gold">Questions</span>
          </h2>
          <p className="text-lg text-luxury-gray max-w-2xl mx-auto">
            Everything you need to know about our music promotion services.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-luxury-dark border border-gold/10 rounded-lg px-6 hover:border-gold/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-white hover:text-gold py-5 hover:no-underline">
                  <span className="font-medium pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-luxury-gray pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-luxury-gray mb-4">
            Still have questions? We're here to help.
          </p>
          <a
            href="mailto:support@plugtoplaylist.com"
            className="text-gold hover:text-brand-orange font-medium transition-colors"
          >
            Contact our support team →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
