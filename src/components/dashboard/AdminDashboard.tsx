"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
} from "lucide-react";
import { GoldButton, StatusBadge, GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from "@/components/shared";
import { DashboardFooter } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock data for admin dashboard
const adminStats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12.5%",
    isPositive: true,
    icon: Users,
    color: "gold",
  },
  {
    title: "Active Submissions",
    value: "156",
    change: "+8.2%",
    isPositive: true,
    icon: Music,
    color: "orange",
  },
  {
    title: "Monthly Revenue",
    value: "$24,850",
    change: "+23.1%",
    isPositive: true,
    icon: DollarSign,
    color: "gold",
  },
  {
    title: "Success Rate",
    value: "94.2%",
    change: "-2.1%",
    isPositive: false,
    icon: Activity,
    color: "orange",
  },
];

const recentSubmissions = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    user: "alex@email.com",
    status: "pending" as const,
    plan: "Premium",
    amount: "$149",
    submittedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Shape of You",
    artist: "Ed Sheeran",
    user: "maya@email.com",
    status: "active" as const,
    plan: "Professional",
    amount: "$349",
    submittedAt: "2024-01-18",
  },
  {
    id: "3",
    title: "Levitating",
    artist: "Dua Lipa",
    user: "jordan@email.com",
    status: "completed" as const,
    plan: "Starter",
    amount: "$49",
    submittedAt: "2024-01-10",
  },
  {
    id: "4",
    title: "Stay",
    artist: "Kid Laroi",
    user: "nina@email.com",
    status: "pending" as const,
    plan: "Premium",
    amount: "$149",
    submittedAt: "2024-01-20",
  },
];

const revenueData = [
  { month: "Jan", value: 18500 },
  { month: "Feb", value: 22000 },
  { month: "Mar", value: 19500 },
  { month: "Apr", value: 28000 },
  { month: "May", value: 32000 },
  { month: "Jun", value: 24850 },
];

const sidebarItems = [
  { name: "Dashboard", href: "/#admin", icon: BarChart3, active: true },
  { name: "Submissions", href: "/#admin/submissions", icon: Music, badge: "12" },
  { name: "Users", href: "/#admin/users", icon: Users },
  { name: "Plans", href: "/#admin/plans", icon: Package },
  { name: "Payments", href: "/#admin/payments", icon: CreditCard },
  { name: "Analytics", href: "/#admin/analytics", icon: TrendingUp },
  { name: "Notifications", href: "/#admin/notifications", icon: Bell },
  { name: "Settings", href: "/#admin/settings", icon: Settings },
];

export function AdminDashboard() {
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
              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                <span className="text-sm font-medium text-gold">A</span>
              </div>
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 md:p-8">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              {adminStats.map((stat, index) => (
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
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        stat.isPositive ? "text-green-400" : "text-red-400"
                      )}>
                        {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {stat.change}
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

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Revenue Chart */}
              <GlowCard variant="premium" className="lg:col-span-2 p-6">
                <GlowCardHeader className="pb-4">
                  <GlowCardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gold" />
                    Revenue Overview
                  </GlowCardTitle>
                </GlowCardHeader>
                <GlowCardContent>
                  <div className="flex items-end justify-between h-40 gap-2">
                    {revenueData.map((item, index) => (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(item.value / 35000) * 100}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="w-full bg-gradient-to-t from-gold to-gold/50 rounded-t"
                        />
                        <span className="text-xs text-luxury-gray">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </GlowCardContent>
              </GlowCard>

              {/* Quick Stats */}
              <GlowCard variant="default" className="p-6">
                <GlowCardHeader className="pb-4">
                  <GlowCardTitle>Quick Stats</GlowCardTitle>
                </GlowCardHeader>
                <GlowCardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-luxury-gray">Pending Reviews</span>
                        <span className="text-sm text-brand-orange font-medium">12</span>
                      </div>
                      <Progress value={40} className="h-2 bg-luxury-lighter [&>div]:bg-brand-orange" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-luxury-gray">Active Campaigns</span>
                        <span className="text-sm text-gold font-medium">89</span>
                      </div>
                      <Progress value={70} className="h-2 bg-luxury-lighter [&>div]:bg-gold" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
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
              <div className="p-6 border-b border-gold/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Recent Submissions</h2>
                  <Link href="/#admin/submissions" className="text-sm text-gold hover:text-brand-orange flex items-center gap-1">
                    View all <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/10">
                      <th className="text-left py-4 px-6 text-sm font-medium text-luxury-gray">Track</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-luxury-gray">User</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-luxury-gray">Plan</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-luxury-gray">Amount</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-luxury-gray">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-luxury-gray">Date</th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-luxury-gray">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSubmissions.map((submission) => (
                      <tr key={submission.id} className="border-b border-gold/5 hover:bg-luxury-lighter/30 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-white">{submission.title}</div>
                            <div className="text-sm text-luxury-gray">{submission.artist}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-luxury-gray">{submission.user}</td>
                        <td className="py-4 px-6 text-white">{submission.plan}</td>
                        <td className="py-4 px-6 text-gold font-medium">{submission.amount}</td>
                        <td className="py-4 px-6">
                          <StatusBadge status={submission.status}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </StatusBadge>
                        </td>
                        <td className="py-4 px-6 text-luxury-gray">{submission.submittedAt}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                              Approve
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gold hover:text-brand-orange">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
