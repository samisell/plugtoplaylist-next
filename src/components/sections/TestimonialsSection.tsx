"use client";

import { motion } from "framer-motion";
import { Star, Quote, Play } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "W4",
    role: "Artist",
    image: "/testimonials/w4.jpg", // Placeholder - user will provide
    content: "Plug to Playlists helped me keep my streams up and get my new drops on playlists that really matter. It's a solid service that delivers results.",
    hasImage: false,
  },
  {
    name: "POPITO",
    role: "Artist",
    image: "/testimonials/popito.jpg", // Placeholder - user will provide
    content: "My streams spiked after placements, and my music started hitting new listeners who actually stuck around. That's how you build a fanbase.",
    hasImage: false,
  },
  {
    name: "Blue Nax",
    role: "Artist",
    image: "/testimonials/blue-nax.jpg", // Placeholder - user will provide
    content: "Plug to Playlists gave me a real push when I needed it most. The placements connected me with new listeners and boosted my confidence as an artist. For anyone on the come-up, this is the way to go.",
    hasImage: false,
  },
  {
    name: "DJ Fineface SA",
    role: "DJ & Producer",
    image: "/testimonials/dj-fineface.jpg", // Placeholder - user will provide
    content: "As a DJ and producer, I rely on visibility. Plug to Playlists helped push my music to Spotify and YouTube audiences I couldn't reach alone. The placements gave me the extra traction to connect with fans globally.",
    hasImage: false,
  },
  {
    name: "Afro100",
    role: "Music Distribution",
    image: "/testimonials/afro100.jpg", // Placeholder - user will provide
    content: "At Afro100, we manage multiple artists, and Plug to Playlists has become a key partner in our growth strategy. Every artist we've run through their service has seen real results higher streams, more followers, and stronger playlist presence. For distributors like us, they're not just a service, they're a bridge to success.",
    hasImage: false,
  },
  {
    name: "King Page",
    role: "Artist",
    image: "/testimonials/king-page.jpg", // Placeholder - user will provide
    content: "NA SO, Plug to Playlists is the real plug. They got my single into curated playlists that matched my sound, and the engagement was instant. More streams, more fans, and more visibility are what every artist is chasing.",
    hasImage: false,
  },
  {
    name: "B Fela",
    role: "Afrobeat Artist",
    image: "/testimonials/b-fela.jpg", // Placeholder - user will provide
    content: "As an Afrobeat artist, it's not always easy to break into international playlists, but Plug to Playlists made it happen. My track started reaching audiences outside my home country, and that exposure is priceless.",
    hasImage: false,
  },
  {
    name: "Big Khalid",
    role: "Artist",
    image: "/testimonials/big-khalid.jpg", // Placeholder - user will provide
    content: "I needed my music in front of new ears, and Plug to Playlists delivered. Not only did I get playlist placements, but I also saw my fanbase expand across different platforms. Definitely worth it.",
    hasImage: false,
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-gradient-to-b from-luxury-dark to-luxury-black">
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
            Proven Results from <span className="text-gold">Artists</span>
          </h2>
          <p className="text-lg text-luxury-gray max-w-2xl mx-auto">
            Real artists. Real results. See what musicians are saying about their experience with Plug to Playlists.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-luxury-dark border border-gold/10 rounded-xl p-6 h-full hover:border-gold/30 hover:shadow-gold-glow transition-all duration-300 relative flex flex-col">
                {/* Quote Icon */}
                <Quote className="absolute top-4 right-4 w-8 h-8 text-gold/10 group-hover:text-gold/20 transition-colors" />

                {/* Image Placeholder */}
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/30 to-brand-orange/20 border-2 border-gold/40 flex items-center justify-center overflow-hidden">
                    {/* Placeholder for artist image - user will provide actual images */}
                    <span className="text-xl font-bold text-gold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Author Info */}
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                  <p className="text-xs text-gold">{testimonial.role}</p>
                </div>

                {/* Content */}
                <p className="text-sm text-luxury-gray leading-relaxed flex-1">
                  "{testimonial.content}"
                </p>

                {/* Rating */}
                <div className="flex gap-1 mt-4 pt-3 border-t border-gold/10">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { icon: "✓", text: "Verified Service" },
            { icon: "🛡️", text: "Money-Back Guarantee" },
            { icon: "🔒", text: "Secure Payment" },
            { icon: "💬", text: "24/7 Support" },
          ].map((badge, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-lighter border border-gold/10 hover:border-gold/30 transition-colors">
              <span className="text-gold">{badge.icon}</span>
              <span className="text-sm text-luxury-gray">{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
