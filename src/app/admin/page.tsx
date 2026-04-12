"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Music,
  TrendingUp,
  Users,
  DollarSign,
  ChevronRight,
  ExternalLink,
  Settings,
  Bell,
  HelpCircle,
  BarChart3,
  Package,
  CreditCard,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  X,
  LogOut,
  Loader2,
} from "lucide-react";
import { GoldButton, StatusBadge, GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from "@/components/shared";
import { DashboardFooter } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/hooks/use-admin-auth";

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: BarChart3, active: true },
  { name: "Submissions", href: "/admin/submissions", icon: Music, badge: "12" },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Plans", href: "/admin/plans", icon: Package },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { admin, isLoading, isAuthenticated, logout } = useAdminAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDataLoading(true);
        const res = await fetch("/api/admin/dashboard");

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push("/admin/login");
            return;
          }
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await res.json();
        setDashboardData(data);
      } catch (err: any) {
        console.error("Dashboard data fetch error:", err);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setDataLoading(false);
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    try {
      // Call the sign-out endpoint which clears the admin session cookie and redirects
      await fetch("/auth/admin-sign-out", { method: "POST" });
      // If fetch didn't redirect, manually redirect
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/admin/login");
    }
  };

  // Show loading screen while checking authentication
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gold mx-auto mb-4" />
          <p className="text-luxury-gray">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-luxury-black/80 backdrop-blur-lg border-b border-gold/10">
        <nav className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                <Music className="w-4 h-4 text-luxury-black" />
              </div>
              <span className="text-lg font-bold text-white">
                PlugTo<span className="text-gold">Playlist</span>
              </span>
              <span className="ml-2 px-2 py-0.5 bg-brand-orange/20 text-brand-orange text-xs font-medium rounded">
                ADMIN
              </span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-luxury-gray hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-orange rounded-full" />
              </button>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-luxury-lighter transition-colors">
                <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                  <span className="text-sm font-medium text-gold">{admin?.name?.charAt(0) || "A"}</span>
                </div>
                <div className="hidden sm:block text-sm">
                  <div className="text-white font-medium">{admin?.name || "Administrator"}</div>
                  <div className="text-xs text-luxury-gray">{admin?.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-luxury-gray hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>

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

          {/* Back to Site */}
          <div className="p-4 border-t border-gold/10 mt-4">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-luxury-gray hover:text-white hover:bg-luxury-lighter transition-all"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="font-medium">Back to Site</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-gold/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-luxury-gray hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-luxury-gray">
                Overview of platform performance and management.
              </p>
            </div>

            {/* Stats Grid */}
            {dataLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <GlowCard key={i} variant="default" className="p-5 animate-pulse">
                    <div className="h-32 bg-luxury-lighter rounded" />
                  </GlowCard>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {dashboardData && [
                  {
                    title: "Total Users",
                    value: dashboardData.stats.totalUsers.toString(),
                    icon: Users,
                    color: "gold",
                  },
                  {
                    title: "Active Submissions",
                    value: dashboardData.stats.activeSubmissions.toString(),
                    icon: Music,
                    color: "orange",
                  },
                  {
                    title: "Monthly Revenue",
                    value: `£${dashboardData.stats.monthlyRevenue.toLocaleString()}`,
                    icon: DollarSign,
                    color: "gold",
                  },
                  {
                    title: "Success Rate",
                    value: `${dashboardData.stats.successRate}%`,
                    icon: Activity,
                    color: "orange",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlowCard variant="default" className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          stat.color === "gold" ? "bg-gold/20" : "bg-brand-orange/20"
                        )}>
                          <stat.icon className={cn(
                            "w-5 h-5",
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
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Revenue Chart */}
              <GlowCard variant="premium" className="lg:col-span-2 p-5">
                <GlowCardHeader className="pb-3">
                  <GlowCardTitle className="flex items-center gap-2 text-base">
                    <DollarSign className="w-4 h-4 text-gold" />
                    Revenue Overview
                  </GlowCardTitle>
                </GlowCardHeader>
                <GlowCardContent>
                  {dataLoading ? (
                    <div className="h-36 bg-luxury-lighter rounded animate-pulse" />
                  ) : (
                    <div className="flex items-end justify-between h-36 gap-2">
                      {dashboardData?.revenueData?.map((item: any, index: number) => {
                        const maxValue = Math.max(...dashboardData.revenueData.map((d: any) => d.value));
                        const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

                        return (
                          <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ delay: index * 0.1, duration: 0.5 }}
                              className="w-full bg-gradient-to-t from-gold to-gold/50 rounded-t"
                              title={`£${item.value.toLocaleString()}`}
                            />
                            <span className="text-xs text-luxury-gray">{item.month}</span>
                          </div>
                        );
                      }) || []}
                    </div>
                  )}
                </GlowCardContent>
              </GlowCard>

              {/* Quick Stats */}
              <GlowCard variant="default" className="p-5">
                <GlowCardHeader className="pb-3">
                  <GlowCardTitle className="text-base">Quick Stats</GlowCardTitle>
                </GlowCardHeader>
                <GlowCardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm text-luxury-gray">Pending Reviews</span>
                        <span className="text-sm text-brand-orange font-medium">12</span>
                      </div>
                      <Progress value={40} className="h-2 bg-luxury-lighter [&>div]:bg-brand-orange" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm text-luxury-gray">Active Campaigns</span>
                        <span className="text-sm text-gold font-medium">89</span>
                      </div>
                      <Progress value={70} className="h-2 bg-luxury-lighter [&>div]:bg-gold" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm text-luxury-gray">Completed Today</span>
                        <span className="text-sm text-green-400 font-medium">23</span>
                      </div>
                      <Progress value={85} className="h-2 bg-luxury-lighter [&>div]:bg-green-400" />
                    </div>
                  </div>
                </GlowCardContent>
              </GlowCard>
            </div>

            {/* Recent Submissions Table */}
            <GlowCard variant="default" hover={false} className="overflow-hidden">
              <div className="p-5 border-b border-gold/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Recent Submissions</h2>
                  <Link href="/admin/submissions" className="text-sm text-gold hover:text-brand-orange flex items-center gap-1">
                    View all <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/10">
                      <th className="text-left py-3 px-4 text-xs font-medium text-luxury-gray uppercase tracking-wider">Track</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-luxury-gray uppercase tracking-wider hidden sm:table-cell">User</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-luxury-gray uppercase tracking-wider hidden md:table-cell">Plan</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-luxury-gray uppercase tracking-wider">Amount</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-luxury-gray uppercase tracking-wider">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-luxury-gray uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataLoading ? (
                      <tr>
                        <td colSpan={6} className="py-8 px-4 text-center">
                          <Loader2 className="w-6 h-6 animate-spin text-gold mx-auto mb-2" />
                          <p className="text-luxury-gray text-sm">Loading submissions...</p>
                        </td>
                      </tr>
                    ) : dashboardData?.recentSubmissions?.length > 0 ? (
                      dashboardData.recentSubmissions.map((submission: any) => (
                        <tr key={submission.id} className="border-b border-gold/5 hover:bg-luxury-lighter/30 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-white">{submission.title}</div>
                              <div className="text-xs text-luxury-gray">{submission.artist}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell text-sm text-luxury-gray">{submission.user}</td>
                          <td className="py-3 px-4 hidden md:table-cell text-sm text-white">{submission.plan}</td>
                          <td className="py-3 px-4 text-gold font-medium text-sm">{submission.amount}</td>
                          <td className="py-3 px-4">
                            <StatusBadge status={submission.status}>
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </StatusBadge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {submission.status === "pending" && (
                                <>
                                  <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-green-400/10">
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="sm" className="text-gold hover:text-brand-orange">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 px-4 text-center text-luxury-gray">
                          No submissions yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </GlowCard>
          </div>
        </main>
      </div>

      <DashboardFooter />
    </div>
  );
}
