"use client";

import Link from "next/link";
import { Music, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  company: [
    { name: "About Us", href: "#about" },
    { name: "Our Team", href: "#team" },
    { name: "Careers", href: "#careers" },
    { name: "Press Kit", href: "#press" },
  ],
  services: [
    { name: "Playlist Placement", href: "#services" },
    { name: "Social Promotion", href: "#services" },
    { name: "Email Marketing", href: "#services" },
    { name: "Artist Development", href: "#services" },
  ],
  support: [
    { name: "Help Center", href: "#help" },
    { name: "Contact Us", href: "#contact" },
    { name: "FAQ", href: "#faq" },
    { name: "Status", href: "#status" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "Refund Policy", href: "#refund" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-luxury-black border-t border-gold/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
                <Music className="w-5 h-5 text-luxury-black" />
              </div>
              <span className="text-xl font-bold text-white">
                PlugTo<span className="text-gold">Playlist</span>
              </span>
            </Link>
            <p className="text-luxury-gray text-sm mb-6 max-w-xs">
              Your gateway to playlist success. We help artists get their music heard by millions through strategic playlist placement and promotion.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-luxury-gray">
                <Mail className="w-4 h-4 text-gold" />
                <span>support@plugtoplaylist.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-luxury-gray">
                <Phone className="w-4 h-4 text-gold" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-luxury-gray">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Los Angeles, CA</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-luxury-gray hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-luxury-gray hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-luxury-gray hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-luxury-gray hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-luxury-gray">
              © {new Date().getFullYear()} PlugToPlaylist. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-luxury-lighter border border-gold/20 flex items-center justify-center text-luxury-gray hover:text-gold hover:border-gold/50 transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function DashboardFooter() {
  return (
    <footer className="border-t border-gold/10 bg-luxury-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gold flex items-center justify-center">
              <Music className="w-3 h-3 text-luxury-black" />
            </div>
            <span className="text-sm text-luxury-gray">
              © {new Date().getFullYear()} PlugToPlaylist
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="#privacy" className="text-sm text-luxury-gray hover:text-gold transition-colors">
              Privacy
            </Link>
            <Link href="#terms" className="text-sm text-luxury-gray hover:text-gold transition-colors">
              Terms
            </Link>
            <Link href="#help" className="text-sm text-luxury-gray hover:text-gold transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
