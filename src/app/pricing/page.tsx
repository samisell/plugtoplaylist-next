"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles, Star, Crown, HelpCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { Header, Footer, GoldButton } from "@/components/shared";
import { cn } from "@/lib/utils";

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

const faqs = [
  {
    question: "What genres do you promote?",
    answer: "We specialize in Afrobeats, Afro Pop, Amapiano, Hip-Hop, R&B, House, and Tech music. Our playlist network covers all these genres extensively.",
  },
  {
    question: "What happens after I submit?",
    answer: "Our team reviews your track within 24 hours. Once approved, we begin the promotion process and you'll see results within 48 hours.",
  },
  {
    question: "What does the 1-month guarantee mean?",
    answer: "Your track will remain on the playlists for a minimum of 1 month. If it's removed earlier, we'll place it on an equivalent or better playlist at no extra cost.",
  },
  {
    question: "How do you promote my music?",
    answer: "We use organic methods including playlist placements on Spotify, YouTube, and other platforms. All our methods are compliant with platform guidelines.",
  },
  {
    question: "Can I get a custom package?",
    answer: "Absolutely! Contact us for a tailored campaign based on your budget and goals. We can create custom packages for any promotion need.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-luxury-black text-white flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-luxury-gray hover:text-gold mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Promotion <span className="text-gold">Packages</span>
              </h1>
              <p className="text-lg text-luxury-gray max-w-2xl mx-auto">
                Choose the perfect package for your music promotion. Real playlist placements, guaranteed streams.
              </p>
            </motion.div>

            {/* Pricing Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
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
                    <Link href={`/submit?plan=${plan.name.toLowerCase()}`} className="block">
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
                  <Link href="/contact" className="block">
                    <GoldButton variant="gold" className="w-full group">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Us
                    </GoldButton>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-luxury-dark">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Pricing <span className="text-gold">FAQ</span>
              </h2>
              <p className="text-luxury-gray">Common questions about our promotion packages</p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-luxury-black border border-gold/10 rounded-xl p-6"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white mb-2">{faq.question}</h4>
                      <p className="text-sm text-luxury-gray">{faq.answer}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantee Banner */}
        <section className="py-12 bg-luxury-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left"
            >
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">1-Month Playlist Guarantee</h3>
                <p className="text-luxury-gray">Your track stays on playlists for a minimum of 1 month. Removed early? We'll replace it at no cost.</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
