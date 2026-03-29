"use client";

import { motion } from "framer-motion";
import { 
  Music, 
  Target, 
  BarChart3, 
  Shield, 
  Zap, 
  Users,
  Globe,
  Clock,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: Music,
    title: "Playlist Placement",
    description: "Get your tracks featured on curated playlists with thousands of active listeners.",
  },
  {
    icon: Target,
    title: "Targeted Promotion",
    description: "Reach the right audience based on genre, location, and listening preferences.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track your campaign performance with detailed insights and metrics.",
  },
  {
    icon: Shield,
    title: "Safe & Organic",
    description: "100% organic promotion methods that comply with platform guidelines.",
  },
  {
    icon: Zap,
    title: "Fast Results",
    description: "See noticeable growth within 24-48 hours of campaign activation.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Personal account manager to guide you through your promotion journey.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-luxury-black to-luxury-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Choose <span className="text-gold">PlugToPlaylist</span>
          </h2>
          <p className="text-lg text-luxury-gray max-w-2xl mx-auto">
            We provide comprehensive music promotion services designed to maximize your reach and impact.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-luxury-dark border border-gold/10 rounded-xl p-6 hover:border-gold/30 hover:shadow-gold-glow transition-all duration-300 h-full">
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gold transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-luxury-gray">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-gold/10 via-brand-orange/10 to-gold/10 rounded-2xl p-8 md:p-12 border border-gold/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Globe className="w-8 h-8 text-gold mb-3" />
              <h4 className="text-2xl font-bold text-white mb-1">100+</h4>
              <p className="text-sm text-luxury-gray">Countries Reached</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-brand-orange mb-3" />
              <h4 className="text-2xl font-bold text-white mb-1">24-48h</h4>
              <p className="text-sm text-luxury-gray">Campaign Activation</p>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
              <h4 className="text-2xl font-bold text-white mb-1">300%</h4>
              <p className="text-sm text-luxury-gray">Avg. Stream Growth</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
