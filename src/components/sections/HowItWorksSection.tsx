"use client";

import { motion } from "framer-motion";
import { 
  Link2, 
  Search, 
  CreditCard, 
  Rocket, 
  CheckCircle2,
  ArrowRight 
} from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Paste Your Link",
    description: "Simply paste your Spotify or YouTube link. We'll automatically fetch all the metadata.",
    color: "gold",
  },
  {
    icon: Search,
    title: "Choose Your Plan",
    description: "Select from our curated promotion packages designed for every budget and goal.",
    color: "orange",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Pay securely with Paystack or Flutterwave. Instant confirmation and receipt.",
    color: "gold",
  },
  {
    icon: Rocket,
    title: "Watch Your Music Grow",
    description: "Sit back as we promote your track to targeted playlists and audiences worldwide.",
    color: "orange",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-luxury-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, #D4AF37 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

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
            How It <span className="text-gold">Works</span>
          </h2>
          <p className="text-lg text-luxury-gray max-w-2xl mx-auto">
            Getting your music promoted is simple. Follow these four easy steps to reach millions of listeners.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gold/30 to-transparent z-0" />
              )}

              {/* Card */}
              <div className="relative bg-luxury-dark border border-gold/20 rounded-xl p-6 hover:border-gold/50 hover:shadow-gold-glow transition-all duration-300 h-full">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gold text-luxury-black font-bold text-sm flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  step.color === "gold" ? "bg-gold/20 text-gold" : "bg-brand-orange/20 text-brand-orange"
                }`}>
                  <step.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-luxury-gray">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 text-gold hover:text-brand-orange transition-colors cursor-pointer group">
            <span className="font-medium">Ready to get started?</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Alternative Simple Steps for Dashboard
export function SimpleSteps() {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step.color === "gold" ? "bg-gold/20 text-gold" : "bg-brand-orange/20 text-brand-orange"
            }`}>
              <step.icon className="w-5 h-5" />
            </div>
            <span className="text-xs text-luxury-gray mt-2 hidden md:block">{step.title}</span>
          </div>
          {index < steps.length - 1 && (
            <ArrowRight className="w-4 h-4 text-gold/30 mx-2 md:mx-4" />
          )}
        </div>
      ))}
    </div>
  );
}
