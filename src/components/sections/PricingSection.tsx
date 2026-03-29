"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Star, Crown, MessageCircle } from "lucide-react";
import { GoldButton } from "@/components/shared";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: 50,
    currency: "£",
    playlistPitches: "1–2",
    guarantee: "1-Month Playlist Guarantee",
    estimatedStreams: {
      "Afrobeats & Afro Pop": "6,000+",
      "Amapiano": "8,000+",
      "Hip-Hop, R&B, House, Tech": "5,000+",
    },
    popular: false,
    color: "default",
  },
  {
    name: "Standard",
    price: 100,
    currency: "£",
    playlistPitches: "1–3",
    guarantee: "1-Month Playlist Guarantee",
    estimatedStreams: {
      "Afrobeats & Afro Pop": "10,000+",
      "Amapiano": "16,000+",
      "Hip-Hop, R&B, House, Tech": "10,000+",
    },
    popular: true,
    color: "gold",
  },
  {
    name: "Premium",
    price: 200,
    currency: "£",
    playlistPitches: "1–4",
    guarantee: "1-Month Playlist Guarantee",
    estimatedStreams: {
      "Afrobeats & Afro Pop": "20,000+",
      "Amapiano": "35,000+",
      "Hip-Hop, R&B, House, Tech": "20,000+",
    },
    popular: false,
    color: "premium",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-luxury-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Promotion <span className="text-gold">Packages</span>
          </h2>
          <p className="text-lg text-luxury-gray max-w-2xl mx-auto">
            Choose the perfect package for your music promotion. Real playlist placements, guaranteed results.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-1 px-4 py-1.5 bg-gold text-luxury-black rounded-full text-sm font-semibold shadow-gold-glow">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card */}
              <div className={`h-full rounded-2xl p-6 transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-b from-luxury-dark to-luxury-lighter border-2 border-gold shadow-gold-glow-lg"
                  : plan.color === "premium"
                  ? "bg-luxury-dark border border-brand-orange/30 hover:border-brand-orange/50 hover:shadow-orange-glow"
                  : "bg-luxury-dark border border-gold/20 hover:border-gold/40 hover:shadow-gold-glow"
              }`}>
                {/* Plan Name */}
                <div className="flex items-center gap-2 mb-4">
                  {plan.popular ? (
                    <Crown className="w-5 h-5 text-gold" />
                  ) : plan.color === "premium" ? (
                    <Star className="w-5 h-5 text-brand-orange" />
                  ) : (
                    <Star className="w-5 h-5 text-gold/50" />
                  )}
                  <h3 className={`text-xl font-semibold ${
                    plan.popular ? "text-gold" : plan.color === "premium" ? "text-brand-orange" : "text-white"
                  }`}>
                    {plan.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-luxury-gray">{plan.currency}</span>
                    <span className={`text-4xl lg:text-5xl font-bold ${
                      plan.popular ? "text-gold" : plan.color === "premium" ? "text-brand-orange" : "text-white"
                    }`}>
                      {plan.price}
                    </span>
                  </div>
                </div>

                {/* Playlist Pitches */}
                <div className="mb-4 pb-4 border-b border-gold/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className={`w-4 h-4 ${
                      plan.popular ? "text-gold" : plan.color === "premium" ? "text-brand-orange" : "text-green-400"
                    }`} />
                    <span className="text-white font-medium">{plan.playlistPitches} Playlist Pitches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className={`w-4 h-4 ${
                      plan.popular ? "text-gold" : plan.color === "premium" ? "text-brand-orange" : "text-green-400"
                    }`} />
                    <span className="text-sm text-luxury-gray">{plan.guarantee}</span>
                  </div>
                </div>

                {/* Estimated Streams */}
                <div className="mb-6">
                  <p className="text-xs text-luxury-gray uppercase tracking-wide mb-3">Estimated Streams:</p>
                  <ul className="space-y-2">
                    {Object.entries(plan.estimatedStreams).map(([genre, streams]) => (
                      <li key={genre} className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          plan.popular ? "bg-gold" : plan.color === "premium" ? "bg-brand-orange" : "bg-gold/50"
                        }`} />
                        <div className="flex-1">
                          <span className="text-xs text-luxury-gray">{genre}:</span>
                          <span className={`text-xs font-semibold ml-1 ${
                            plan.popular ? "text-gold" : plan.color === "premium" ? "text-brand-orange" : "text-white"
                          }`}>
                            {streams}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Link href="/submit?plan=starter">
                  <GoldButton
                    variant={plan.popular ? "gold" : plan.color === "premium" ? "orange" : "outline"}
                    className="w-full"
                  >
                    Get Started
                  </GoldButton>
                </Link>
              </div>
            </motion.div>
          ))}

          {/* Custom Package Card */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            {/* Card */}
            <div className="h-full rounded-2xl p-6 bg-gradient-to-b from-luxury-dark to-luxury-black border border-gold/30 hover:border-gold/50 transition-all duration-300 flex flex-col">
              {/* Plan Name */}
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-gold" />
                <h3 className="text-xl font-semibold text-gold">
                  Custom Package
                </h3>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gold">Tailored</span>
                </div>
                <p className="text-sm text-luxury-gray mt-1">to your needs</p>
              </div>

              {/* Features */}
              <div className="mb-6 flex-1">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-gold" />
                    <span className="text-sm text-white">Choose your budget</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-gold" />
                    <span className="text-sm text-white">Request specific playlist placements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-gold" />
                    <span className="text-sm text-white">Extended reach & more placements</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <Link href="/contact">
                <GoldButton variant="gold" className="w-full group">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Us
                </GoldButton>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-luxury-gray mt-8"
        >
          All packages include a 1-month playlist guarantee. Contact us for custom campaigns.
        </motion.p>
      </div>
    </section>
  );
}
