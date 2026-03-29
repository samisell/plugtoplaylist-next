"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Music } from "lucide-react";
import { GoldButton } from "@/components/shared";

export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-luxury-black via-luxury-dark to-luxury-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gold/20 border border-gold/30 flex items-center justify-center mb-8">
            <Music className="w-8 h-8 text-gold" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Take Your Music to the{" "}
            <span className="text-gold-gradient">Next Level?</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-luxury-gray max-w-2xl mx-auto mb-10">
            Join over 10,000 artists who have already transformed their music careers with PlugToPlaylist. 
            Start your journey today and reach millions of new listeners.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#submit">
              <GoldButton size="xl" className="group">
                Submit Your Song Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </GoldButton>
            </Link>
            <Link href="/#pricing">
              <GoldButton variant="outline" size="xl">
                View Pricing
              </GoldButton>
            </Link>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-luxury-gray">No credit card required to start</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-luxury-gray">30-day money-back guarantee</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
