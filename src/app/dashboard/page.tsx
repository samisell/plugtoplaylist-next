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
  BarChart3,
  Plus,
  Play,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { UserLayout, UserStatCard } from "@/components/user/UserLayout";
import { GoldButton, StatusBadge, GlowCard } from "@/components/shared";
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
    color: "gold" as const,
  },
  {
    title: "Active Campaigns",
    value: "3",
    change: "Running now",
    icon: Play,
    color: "orange" as const,
  },
  {
    title: "Total Streams",
    value: "125.4K",
    change: "+45% avg growth",
    icon: TrendingUp,
    color: "green" as const,
  },
  {
    title: "Total Spent",
    value: "$747",
    change: "$149 saved",
    icon: DollarSign,
    color: "blue" as const,
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
    submittedAt: "Jan 15, 2024",
    streams: "45.2K",
    progress: 65,
    daysRemaining: 18,
  },
  {
    id: "2",
    title: "Shape of You",
    artist: "Ed Sheeran",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    status: "pending" as const,
    plan: "Starter",
    submittedAt: "Jan 18, 2024",
    streams: "-",
    progress: 0,
    daysRemaining: 0,
  },
  {
    id: "3",
    title: "Levitating",
    artist: "Dua Lipa",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
    status: "completed" as const,
    plan: "Professional",
    submittedAt: "Jan 10, 2024",
    streams: "80.2K",
    progress: 100,
    daysRemaining: 0,
  },
  {
    id: "4",
    title: "Stay",
    artist: "Kid Laroi",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    status: "active" as const,
    plan: "Premium",
    submittedAt: "Jan 20, 2024",
    streams: "12.8K",
    progress: 30,
    daysRemaining: 42,
  },
];

const quickActions = [
  { name: "Submit New Track", href: "/submit", icon: Plus, color: "gold" },
  { name: "View Analytics", href: "/dashboard/analytics", icon: BarChart3, color: "orange" },
  { name: "Update Profile", href: "/dashboard/settings", icon: Music, color: "green" },
  { name: "Get Help", href: "/dashboard/help", icon: Sparkles, color: "blue" },
];

export default function UserDashboardPage() {
  return (
    <UserLayout
      title="Dashboard"
      subtitle="Welcome back, Alex!"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <UserStatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Submissions</h2>
            <Link
              href="/dashboard/submissions"
              className="text-sm text-gold hover:text-brand-orange flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentSubmissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlowCard variant="default" className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={submission.cover}
                      alt={submission.title}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-white truncate">{submission.title}</h3>
                        <StatusBadge status={submission.status}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </StatusBadge>
                      </div>
                      <p className="text-sm text-luxury-gray">{submission.artist}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gold">{submission.plan} Plan</span>
                        {submission.streams !== "-" && (
                          <span className="text-xs text-green-400 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" />
                            {submission.streams} streams
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      {submission.status === "active" && (
                        <>
                          <div className="text-sm font-medium text-white mb-1">{submission.progress}%</div>
                          <div className="w-24 h-1.5 bg-luxury-lighter rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gold rounded-full"
                              style={{ width: `${submission.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-luxury-gray mt-1">{submission.daysRemaining} days left</div>
                        </>
                      )}
                      {submission.status === "pending" && (
                        <div className="text-xs text-brand-orange">Awaiting review</div>
                      )}
                      {submission.status === "completed" && (
                        <div className="text-xs text-green-400">Campaign complete</div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="text-gold hover:text-brand-orange">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Active Campaign Progress */}
          <GlowCard variant="premium" className="p-5">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold" />
              Campaign Progress
            </h3>
            <div className="space-y-4">
              {recentSubmissions
                .filter((s) => s.status === "active")
                .map((submission) => (
                  <div key={submission.id}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-white truncate">{submission.title}</span>
                      <span className="text-sm text-gold">{submission.progress}%</span>
                    </div>
                    <Progress value={submission.progress} className="h-2 bg-luxury-lighter [&>div]:bg-gold" />
                    <div className="text-xs text-luxury-gray mt-1">{submission.daysRemaining} days remaining</div>
                  </div>
                ))}
            </div>
          </GlowCard>

          {/* Quick Actions */}
          <GlowCard variant="default" className="p-5">
            <h3 className="text-base font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => {
                const colors = {
                  gold: "bg-gold/20 text-gold",
                  orange: "bg-brand-orange/20 text-brand-orange",
                  green: "bg-green-500/20 text-green-400",
                  blue: "bg-blue-500/20 text-blue-400",
                };
                return (
                  <Link
                    key={index}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-lg bg-luxury-lighter/50 hover:bg-gold/10 transition-colors group"
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colors[action.color as keyof typeof colors])}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-white group-hover:text-gold">{action.name}</span>
                    <ChevronRight className="w-4 h-4 text-luxury-gray ml-auto" />
                  </Link>
                );
              })}
            </div>
          </GlowCard>

          {/* Referral Card */}
          <div className="bg-gradient-to-br from-gold/20 to-brand-orange/10 border border-gold/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-gold" />
              <h3 className="font-semibold text-white">Earn $25 Bonus</h3>
            </div>
            <p className="text-sm text-luxury-gray mb-4">
              Invite friends and earn $25 for each successful referral.
            </p>
            <div className="bg-luxury-black/50 rounded-lg p-3 mb-3">
              <div className="text-xs text-luxury-gray mb-1">Your Referral Code</div>
              <div className="text-lg font-mono text-gold">ALEX2024</div>
            </div>
            <GoldButton variant="outline" size="sm" className="w-full">
              Copy & Share
            </GoldButton>
          </div>

          {/* Need Help? */}
          <GlowCard variant="default" className="p-5">
            <h3 className="text-base font-semibold text-white mb-2">Need Help?</h3>
            <p className="text-sm text-luxury-gray mb-4">
              Our support team is available 24/7 to assist you.
            </p>
            <Link href="/dashboard/help">
              <GoldButton variant="outline" size="sm" className="w-full">
                Contact Support
              </GoldButton>
            </Link>
          </GlowCard>
        </div>
      </div>
    </UserLayout>
  );
}
