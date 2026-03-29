"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { DashboardHeader, GoldButton, StatusBadge, GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from "@/components/shared";
import { DashboardFooter } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { name: "Overview", href: "/dashboard", icon: BarChart3 },
  { name: "My Submissions", href: "/dashboard/submissions", icon: Music },
  { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: "0" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
];

export function UserDashboard() {
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { title: "Total Submissions", value: "0", icon: Music, color: "gold" },
    { title: "Active Campaigns", value: "0", icon: TrendingUp, color: "orange" },
    { title: "Total Streams", value: "0", icon: BarChart3, color: "gold" },
    { title: "Wallet Balance", value: "$0", icon: DollarSign, color: "orange" },
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // 1. Get user data from local storage or session
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          // In a real app, redirect to login if no session
          setLoading(false);
          return;
        }
        const user = JSON.parse(storedUser);
        
        // 2. Fetch full user profile
        const userRes = await fetch(`/api/auth?userId=${user.id}`);
        const { user: profile } = await userRes.json();
        setUserData(profile);

        // 3. Fetch submissions
        const subRes = await fetch(`/api/submissions?userId=${user.id}`);
        const { submissions: subs } = await subRes.json();
        setSubmissions(subs || []);

        // 4. Update Stats
        const activeCount = (subs || []).filter((s: any) => s.status === "active" || s.status === "in_progress").length;
        
        setStats([
          { title: "Total Submissions", value: (subs || []).length.toString(), icon: Music, color: "gold" },
          { title: "Active Campaigns", value: activeCount.toString(), icon: TrendingUp, color: "orange" },
          { title: "Total Streams", value: "0", icon: BarChart3, color: "gold" }, // Placeholder for now
          { title: "Wallet Balance", value: `$${profile?.walletBalance || 0}`, icon: DollarSign, color: "orange" },
        ]);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-gold animate-spin" />
      </div>
    );
  }

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
                  pathname === item.href
                    ? "bg-gold/10 text-gold border-l-2 border-gold"
                    : "text-luxury-gray hover:text-white hover:bg-luxury-lighter"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {item.badge !== "0" && item.badge && (
                  <span className="ml-auto bg-brand-orange text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-gold/10 mt-4">
            <Link href="/dashboard/submissions/new">
              <GoldButton className="w-full">
                New Submission
              </GoldButton>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome back, <span className="text-gold">{userData?.name || "Member"}</span>
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
                  </GlowCard>
                </motion.div>
              ))}
            </div>

            {/* Recent Submissions */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Recent Submissions</h2>
                <Link href="/dashboard/submissions" className="text-sm text-gold hover:text-brand-orange flex items-center gap-1">
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
                        <th className="text-left py-4 px-6 text-sm font-medium text-luxury-gray">Submitted</th>
                        <th className="text-right py-4 px-6 text-sm font-medium text-luxury-gray">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 px-6 text-center text-luxury-gray">
                            No submissions found. Start by submitting your first track!
                          </td>
                        </tr>
                      ) : (
                        submissions.slice(0, 5).map((submission) => (
                          <tr key={submission.id} className="border-b border-gold/5 hover:bg-luxury-lighter/30 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                {submission.coverImage ? (
                                  <img
                                    src={submission.coverImage}
                                    alt={submission.title}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-luxury-gray/20 flex items-center justify-center">
                                    <Music className="w-6 h-6 text-gold" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium text-white">{submission.title}</div>
                                  <div className="text-sm text-luxury-gray">{submission.artist}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-white">{submission.plan?.name || "Generic"}</span>
                            </td>
                            <td className="py-4 px-6">
                              <StatusBadge status={submission.status.toLowerCase()}>
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                              </StatusBadge>
                            </td>
                            <td className="py-4 px-6 text-luxury-gray">
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <Link href={`/dashboard/submissions/${submission.id}`}>
                                <Button variant="ghost" size="sm" className="text-gold hover:text-brand-orange">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </GlowCard>
            </div>

            {/* Campaign Progress & Quick Actions */}
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
                    {submissions.filter(s => s.status === 'active' || s.status === 'in_progress').length === 0 ? (
                      <p className="text-sm text-luxury-gray">No active campaigns at the moment.</p>
                    ) : (
                      submissions.filter(s => s.status === 'active' || s.status === 'in_progress').slice(0, 3).map(sub => (
                        <div key={sub.id}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-white">{sub.title}</span>
                            <span className="text-sm text-gold">{sub.progress_percentage || 0}%</span>
                          </div>
                          <Progress value={sub.progress_percentage || 0} className="h-2 bg-luxury-lighter [&>div]:bg-gold" />
                        </div>
                      ))
                    )}
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
                    <Link href="/dashboard/submissions/new" className="flex items-center gap-3 p-3 rounded-lg bg-luxury-lighter hover:bg-gold/10 transition-colors group">
                      <Music className="w-5 h-5 text-gold" />
                      <span className="text-white group-hover:text-gold">Submit a new track</span>
                      <ChevronRight className="w-4 h-4 text-luxury-gray ml-auto" />
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-lg bg-luxury-lighter hover:bg-gold/10 transition-colors group">
                      <User className="w-5 h-5 text-gold" />
                      <span className="text-white group-hover:text-gold">Update profile</span>
                      <ChevronRight className="w-4 h-4 text-luxury-gray ml-auto" />
                    </Link>
                    <Link href="/dashboard/help" className="flex items-center gap-3 p-3 rounded-lg bg-luxury-lighter hover:bg-gold/10 transition-colors group">
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
