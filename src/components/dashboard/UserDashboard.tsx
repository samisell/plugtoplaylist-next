"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Music,
  TrendingUp,
  Clock,
  DollarSign,
  ChevronRight,
  ExternalLink,
  Settings,
  Bell,
  HelpCircle,
  User,
  BarChart3,
} from "lucide-react";
import { DashboardHeader, GoldButton, StatusBadge, GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from "@/components/shared";
import { DashboardFooter } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock data for dashboard
const stats = [
  {
    title: "Total Submissions",
    value: "12",
    change: "+3 this month",
    icon: Music,
    color: "gold",
  },
  {
    title: "Active Campaigns",
    value: "3",
    change: "2 pending review",
    icon: TrendingUp,
    color: "orange",
  },
  {
    title: "Total Streams",
    value: "125.4K",
    change: "+45% avg growth",
    icon: BarChart3,
    color: "gold",
  },
  {
    title: "Total Spent",
    value: "$747",
    change: "$149 saved with plans",
    icon: DollarSign,
    color: "orange",
  },
];

const recentSubmissions = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop",
    status: "active" as const,
    plan: "Premium",
    submittedAt: "2024-01-15",
    streams: "45.2K",
  },
  {
    id: "2",
    title: "Shape of You",
    artist: "Ed Sheeran",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    status: "pending" as const,
    plan: "Starter",
    submittedAt: "2024-01-18",
    streams: "-",
  },
  {
    id: "3",
    title: "Levitating",
    artist: "Dua Lipa",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
    status: "completed" as const,
    plan: "Professional",
    submittedAt: "2024-01-10",
    streams: "80.2K",
  },
];

const sidebarItems = [
  { name: "Dashboard", href: "/#dashboard", icon: BarChart3, active: true },
  { name: "My Submissions", href: "/#submissions", icon: Music },
  { name: "Analytics", href: "/#analytics", icon: TrendingUp },
  { name: "Notifications", href: "/#notifications", icon: Bell, badge: "3" },
  { name: "Settings", href: "/#settings", icon: Settings },
  { name: "Help & Support", href: "/#help", icon: HelpCircle },
];

export function UserDashboard() {
  return (
    <div className="min-h-screen bg-luxury-black flex flex-col">
      <DashboardHeader />
      
      <div className="flex-1 pt-16 flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-luxury-dark border-r border-gold/10 fixed left-0 top-16 bottom-0 overflow-y-auto">
          <div className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  item.active
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
            ))}
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gold/10 mt-4">
            <Link href="/#submit">
              <GoldButton className="w-full">
                New Submission
              </GoldButton>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome back, <span className="text-gold">Alex</span>
              </h1>
              <p className="text-luxury-gray">
                Here&apos;s an overview of your music promotion journey.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlowCard variant="default" className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        stat.color === "gold" ? "bg-gold/20" : "bg-brand-orange/20"
                      )}>
                        <stat.icon className={cn(
                          "w-6 h-6",
                          stat.color === "gold" ? "text-gold" : "text-brand-orange"
                        )} />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-luxury-gray">{stat.title}</div>
                    <div className="text-xs text-green-400 mt-2">{stat.change}</div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>

            {/* Recent Submissions */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Recent Submissions</h2>
                <Link href="/#submissions" className="text-sm text-gold hover:text-brand-orange flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <GlowCard variant="default" hover={false} className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/10">
                        <th className="text-left py-4 px-6 text-sm font-medium text-luxury-gray">Track</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-luxury-gray">Plan</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-luxury-gray">Status</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-luxury-gray">Streams</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-luxury-gray">Submitted</th>
                        <th className="text-right py-4 px-6 text-sm font-medium text-luxury-gray">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSubmissions.map((submission) => (
                        <tr key={submission.id} className="border-b border-gold/5 hover:bg-luxury-lighter/30 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={submission.cover}
                                alt={submission.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <div className="font-medium text-white">{submission.title}</div>
                                <div className="text-sm text-luxury-gray">{submission.artist}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-white">{submission.plan}</span>
                          </td>
                          <td className="py-4 px-6">
                            <StatusBadge status={submission.status}>
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </StatusBadge>
                          </td>
                          <td className="py-4 px-6 text-white">{submission.streams}</td>
                          <td className="py-4 px-6 text-luxury-gray">{submission.submittedAt}</td>
                          <td className="py-4 px-6 text-right">
                            <Button variant="ghost" size="sm" className="text-gold hover:text-brand-orange">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlowCard>
            </div>

            {/* Active Campaign Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlowCard variant="premium" className="p-6">
                <GlowCardHeader className="pb-4">
                  <GlowCardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gold" />
                    Campaign Progress
                  </GlowCardTitle>
                </GlowCardHeader>
                <GlowCardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-white">Blinding Lights</span>
                        <span className="text-sm text-gold">65%</span>
                      </div>
                      <Progress value={65} className="h-2 bg-luxury-lighter [&>div]:bg-gold" />
                      <div className="text-xs text-luxury-gray mt-1">18 days remaining</div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-white">Levitating</span>
                        <span className="text-sm text-gold">30%</span>
                      </div>
                      <Progress value={30} className="h-2 bg-luxury-lighter [&>div]:bg-gold" />
                      <div className="text-xs text-luxury-gray mt-1">42 days remaining</div>
                    </div>
                  </div>
                </GlowCardContent>
              </GlowCard>

              <GlowCard variant="default" className="p-6">
                <GlowCardHeader className="pb-4">
                  <GlowCardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gold" />
                    Quick Actions
                  </GlowCardTitle>
                </GlowCardHeader>
                <GlowCardContent>
                  <div className="space-y-3">
                    <Link href="/#submit" className="flex items-center gap-3 p-3 rounded-lg bg-luxury-lighter hover:bg-gold/10 transition-colors group">
                      <Music className="w-5 h-5 text-gold" />
                      <span className="text-white group-hover:text-gold">Submit a new track</span>
                      <ChevronRight className="w-4 h-4 text-luxury-gray ml-auto" />
                    </Link>
                    <Link href="/#settings" className="flex items-center gap-3 p-3 rounded-lg bg-luxury-lighter hover:bg-gold/10 transition-colors group">
                      <User className="w-5 h-5 text-gold" />
                      <span className="text-white group-hover:text-gold">Update profile</span>
                      <ChevronRight className="w-4 h-4 text-luxury-gray ml-auto" />
                    </Link>
                    <Link href="/#help" className="flex items-center gap-3 p-3 rounded-lg bg-luxury-lighter hover:bg-gold/10 transition-colors group">
                      <HelpCircle className="w-5 h-5 text-gold" />
                      <span className="text-white group-hover:text-gold">Get help</span>
                      <ChevronRight className="w-4 h-4 text-luxury-gray ml-auto" />
                    </Link>
                  </div>
                </GlowCardContent>
              </GlowCard>
            </div>
          </div>
        </main>
      </div>

      <DashboardFooter />
    </div>
  );
}
