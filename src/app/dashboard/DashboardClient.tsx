"use client";

import { useEffect } from "react";
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

const quickActions = [
  { name: "Submit New Track", href: "/dashboard/submit", icon: Plus, color: "gold" },
  { name: "View Analytics", href: "/dashboard/analytics", icon: BarChart3, color: "orange" },
  { name: "Update Profile", href: "/dashboard/settings", icon: Music, color: "green" },
  { name: "Get Help", href: "/dashboard/help", icon: Sparkles, color: "blue" },
];

export default function DashboardClient({ user, submissions = [] }: { user: any, submissions?: any[] }) {
  const totalSubmissions = submissions.length;
  const activeCampaigns = submissions.filter(s => s.status === 'active').length;
  const totalSpent = submissions.reduce((acc, curr) => {
     if (curr.payment?.[0]?.amount) return acc + curr.payment[0].amount;
     if (curr.plan?.price) return acc + curr.plan.price;
     return acc;
  }, 0);
  const totalStreams = submissions.reduce((acc, curr) => acc + (curr.metadata?.streams || 0), 0);

  const stats = [
    {
      title: "Total Submissions",
      value: totalSubmissions.toString(),
      change: "All time records",
      icon: Music,
      color: "gold" as const,
    },
    {
      title: "Active Campaigns",
      value: activeCampaigns.toString(),
      change: "Currently running",
      icon: Play,
      color: "orange" as const,
    },
    {
      title: "Total Streams",
      value: totalStreams > 0 ? (totalStreams > 1000 ? (totalStreams/1000).toFixed(1) + 'K' : totalStreams.toString()) : "0",
      change: "Recorded streams",
      icon: TrendingUp,
      color: "green" as const,
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      change: "All time records",
      icon: DollarSign,
      color: "blue" as const,
    },
  ];

  const recentSubmissions = submissions.slice(0, 5).map(s => ({
    id: s.id,
    title: s.track_title || s.title || "Unknown Track",
    artist: s.artist_name || s.artist || "Unknown Artist",
    cover: s.cover_art_url || s.coverImage || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop",
    status: s.status || "pending",
    plan: s.plan?.name || "Standard plan",
    submittedAt: s.created_at ? new Date(s.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
    streams: s.metadata?.streams || "-",
    progress: s.status === 'active' ? (s.metadata?.progress || 0) : (s.status === 'completed' ? 100 : 0),
    daysRemaining: s.status === 'active' ? (s.metadata?.daysRemaining || 0) : 0,
  }));

  // ─── Sync server user to localStorage so client-only pages can read it ─────
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem("user");
      const parsed = stored ? JSON.parse(stored) : {};
      // Merge: keep existing fields but prefer fresh server data
      const merged = {
        ...parsed,
        id:           user.id,
        email:        user.email,
        name:         user.display_name || user.name || parsed.name,
        display_name: user.display_name,
        phone:        user.phone        || parsed.phone,
        bio:          user.bio          || parsed.bio,
        location:     user.location     || parsed.location,
        metadata:     user.metadata     || parsed.metadata,
        role:         user.role         || parsed.role,
      };
      localStorage.setItem("user", JSON.stringify(merged));
    }
  }, [user]);

  return (
    <UserLayout
      title="Dashboard"
      subtitle={`Welcome back, ${user?.display_name || 'there'}!`}
      user={user}
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
                    <div className={cn("p-1.5 rounded-full", colors[action.color])}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="flex-1 font-medium text-white">{action.name}</span>
                    <ChevronRight className="w-4 h-4 text-luxury-gray group-hover:translate-x-1 transition-transform" />
                  </Link>
                );
              })}
               <form action="/auth/sign-out" method="post" className="w-full">
                <button
                  type="submit"
                  className="flex items-center gap-3 p-3 rounded-lg bg-luxury-lighter/50 hover:bg-gold/10 transition-colors group w-full"
                >
                  <div className={cn("p-1.5 rounded-full", "bg-red-500/20 text-red-400")}>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <span className="flex-1 font-medium text-white text-left">Logout</span>
                  <ChevronRight className="w-4 h-4 text-luxury-gray group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </GlowCard>
        </div>
      </div>
    </UserLayout>
  );
}
