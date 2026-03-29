"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Music, 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  LogOut, 
  Settings,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/#home" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Pricing", href: "/pricing" },
  { name: "Testimonials", href: "/#testimonials" },
  { name: "FAQ", href: "/#faq" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-luxury-black/80 backdrop-blur-lg border-b border-gold/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/PTP-mini.png" 
              alt="PlugToPlaylist Logo" 
              width={40} 
              height={40} 
              style={{ height: "auto" }}
            />
            <span className="text-xl font-bold text-white group-hover:text-gold transition-colors">
              PlugTo<span className="text-gold">Playlist</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm text-luxury-gray hover:text-gold transition-colors relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold transition-all group-hover:w-3/4" />
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-luxury-gray hover:text-white hover:bg-luxury-lighter">
                Log In
              </Button>
            </Link>
            <Link href="/submit">
              <Button className="bg-gold text-luxury-black hover:bg-gold/90 font-semibold px-6 shadow-gold-glow hover:shadow-gold-glow-lg transition-all">
                Submit Your Song
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-luxury-gray hover:text-gold transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-gold/10"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-luxury-gray hover:text-gold hover:bg-luxury-lighter rounded-lg transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gold/10 space-y-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-luxury-gray hover:text-white">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/submit" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gold text-luxury-black hover:bg-gold/90 font-semibold">
                      Submit Your Song
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

export function DashboardHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-luxury-black/80 backdrop-blur-lg border-b border-gold/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/PTP-mini.png" 
              alt="PlugToPlaylist Logo" 
              width={32} 
              height={32} 
              style={{ height: "auto" }}
            />
            <span className="text-lg font-bold text-white">
              PlugTo<span className="text-gold">Playlist</span>
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link href="/submit">
              <Button size="sm" className="bg-gold text-luxury-black hover:bg-gold/90 font-semibold">
                New Submission
              </Button>
            </Link>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-luxury-lighter transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-gold" />
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-luxury-gray transition-transform",
                  isProfileOpen && "rotate-180"
                )} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-luxury-dark border border-gold/20 rounded-lg shadow-card overflow-hidden"
                  >
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-luxury-gray hover:text-gold hover:bg-luxury-lighter"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-luxury-gray hover:text-gold hover:bg-luxury-lighter"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <hr className="my-2 border-gold/10" />
                      <Link
                        href="/login"
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-luxury-lighter"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}