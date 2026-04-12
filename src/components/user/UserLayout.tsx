"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  TrendingUp,
  Bell,
  Settings,
  HelpCircle,
  Menu,
  X,
  LogOut,
  User,
  Plus,
  Search,
  ChevronDown,
  Home,
  ExternalLink,
  Crown,
} from "lucide-react";
import { GoldButton } from "@/components/shared";
import { LogoutButton } from "@/components/LogoutButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Submissions", href: "/dashboard/submissions", icon: Music, badge: "3" },
  { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: "5" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
];

interface UserLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  user?: any;
}

export function UserLayout({ children, title, subtitle, actions, user }: UserLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-luxury-black flex">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-luxury-dark border-r border-gold/10 transform transition-transform duration-300 lg:transform-none flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gold/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <Music className="w-4 h-4 text-luxury-black" />
            </div>
            <span className="text-lg font-bold text-white">
              PlugTo<span className="text-gold">Playlist</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm",
                  isActive
                    ? "bg-gold/10 text-gold border-l-2 border-gold"
                    : "text-luxury-gray hover:text-white hover:bg-luxury-lighter"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-brand-orange text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gold/10">
          <Link href="/dashboard/submit" onClick={() => setSidebarOpen(false)}>
            <GoldButton className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              New Submission
            </GoldButton>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gold/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
              <User className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.display_name || user?.name || "Guest User"}</div>
              <div className="text-xs text-luxury-gray truncate">{user?.email || "guest@email.com"}</div>
            </div>
          </div>
          
          {/* Referral Card */}
          <div className="bg-gradient-to-br from-gold/10 to-brand-orange/5 border border-gold/20 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-gold" />
              <span className="text-xs font-medium text-white">Referral Bonus</span>
            </div>
            <div className="text-xs text-luxury-gray mb-1">Your code</div>
            <div className="text-lg font-mono text-gold uppercase">{user?.metadata?.referral_code || user?.referralCode || "WELCOME24"}</div>
          </div>

          <LogoutButton isAdmin={false} showText={true} className="w-full px-3 py-2 text-sm text-luxury-gray hover:text-red-400 hover:bg-red-400/10 rounded-lg justify-start" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-luxury-black/80 backdrop-blur-lg border-b border-gold/10">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-luxury-gray hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white">{title}</h1>
                {subtitle && <p className="text-xs text-luxury-gray">{subtitle}</p>}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Search - Hidden on mobile */}
              <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gray" />
                <Input
                  placeholder="Search..."
                  className="bg-luxury-lighter border-gold/20 focus:border-gold h-9 pl-9 w-48 lg:w-56 text-sm text-white placeholder:text-luxury-gray"
                />
              </div>

              {/* Quick Submit Button */}
              <Link href="/dashboard/submit" className="hidden sm:block">
                <GoldButton size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Submit
                </GoldButton>
              </Link>

              {/* Notifications */}
              <button className="relative p-2 text-luxury-gray hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-orange rounded-full" />
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-luxury-lighter transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                    <User className="w-4 h-4 text-gold" />
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-luxury-gray transition-transform hidden sm:block",
                    profileOpen && "rotate-180"
                  )} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-luxury-dark border border-gold/20 rounded-lg shadow-card overflow-hidden"
                    >
                      <div className="py-2">
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-luxury-gray hover:text-gold hover:bg-luxury-lighter"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <Link
                          href="/dashboard/help"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-luxury-gray hover:text-gold hover:bg-luxury-lighter"
                        >
                          <HelpCircle className="w-4 h-4" />
                          Help & Support
                        </Link>
                        <hr className="my-2 border-gold/10" />
                        <div className="px-4 py-2">
                          <LogoutButton isAdmin={false} showText={true} className="w-full px-0 text-red-400 hover:text-red-300 justify-start" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Actions */}
            {actions && (
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                {actions}
              </div>
            )}
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gold/10 py-4 px-6">
          <div className="flex items-center justify-between text-xs text-luxury-gray">
            <span>© 2024 PlugToPlaylist. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-gold">Terms</Link>
              <Link href="/privacy" className="hover:text-gold">Privacy</Link>
              <Link href="/contact" className="hover:text-gold">Support</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Stat Card Component for User Dashboard
interface UserStatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  color?: "gold" | "orange" | "green" | "blue";
}

export function UserStatCard({ title, value, change, icon: Icon, color = "gold" }: UserStatCardProps) {
  const colors = {
    gold: "bg-gold/20 text-gold",
    orange: "bg-brand-orange/20 text-brand-orange",
    green: "bg-green-500/20 text-green-400",
    blue: "bg-blue-500/20 text-blue-400",
  };

  return (
    <div className="bg-luxury-dark border border-gold/10 rounded-xl p-5 hover:border-gold/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-luxury-gray">{title}</div>
      {change && (
        <div className="text-xs text-green-400 mt-2">{change}</div>
      )}
    </div>
  );
}
