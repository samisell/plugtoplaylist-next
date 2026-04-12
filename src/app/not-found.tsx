import { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Music, Search } from "lucide-react";
import { Header, Footer } from "@/components/shared";

export const metadata: Metadata = {
  title: "404 - Page Not Found | PlugToPlaylist",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-luxury-black text-white flex flex-col">
      <Header />

      <main className="flex-1 pt-16 md:pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-12 md:py-20">
          {/* 404 Content */}
          <div className="text-center">
            {/* Large 404 Number with Animation */}
            <div className="mb-8 relative h-32 md:h-48 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-brand-orange/20 blur-3xl rounded-full" />
              <div className="relative text-9xl md:text-[200px] font-bold bg-gradient-to-r from-gold to-brand-orange bg-clip-text text-transparent">
                404
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Oops! Page Not Found
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              The page you're looking for seems to have taken a different path. 
              Don't worry, we'll help you find your way back!
            </p>

            {/* Search Suggestion */}
            <div className="mb-12 p-6 bg-slate-800/50 border border-gold/20 rounded-lg">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <Search className="w-5 h-5 text-gold" />
                <span className="font-medium">Quick Tip:</span>
              </div>
              <p className="text-sm text-gray-400">
                Try checking the URL or use the navigation links below to explore PlugToPlaylist
              </p>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                {
                  href: "/",
                  label: "Home",
                  icon: Home,
                  color: "from-gold to-gold",
                  description: "Back to homepage",
                },
                {
                  href: "/register",
                  label: "Sign Up",
                  icon: Music,
                  color: "from-brand-orange to-brand-orange",
                  description: "Create an account",
                },
                {
                  href: "/login",
                  label: "Log In",
                  icon: ArrowLeft,
                  color: "from-blue-500 to-blue-500",
                  description: "User dashboard",
                },
                {
                  href: "/admin/login",
                  label: "Admin Portal",
                  icon: Music,
                  color: "from-purple-500 to-purple-500",
                  description: "Admin dashboard",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div className="group h-full p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-gold/10 rounded-xl hover:border-gold/30 transition-all duration-300 cursor-pointer">
                      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-20 mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-gold" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Primary CTA */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-brand-orange text-luxury-black font-semibold rounded-lg hover:shadow-lg hover:shadow-gold/50 transition-all duration-300 mb-6"
            >
              <Home className="w-5 h-5" />
              Go Back Home
            </Link>

            {/* Sitemap Section */}
            <div className="mt-16 p-8 bg-slate-800/30 border border-gold/10 rounded-xl">
              <h2 className="text-2xl font-bold mb-6 text-white">Popular Pages</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
                {[
                  { href: "/pricing", label: "Pricing Plans" },
                  { href: "/features", label: "Features" },
                  { href: "/contact", label: "Contact Us" },
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/terms", label: "Terms of Service" },
                  { href: "/dashboard", label: "User Dashboard" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gold hover:text-brand-orange transition-colors duration-300 text-sm"
                  >
                    → {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Message */}
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm mb-2">
                Still having trouble? Contact us for help
              </p>
              <Link
                href="/contact"
                className="text-gold hover:text-brand-orange font-medium text-sm transition-colors"
              >
                Get Support
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
