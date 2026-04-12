"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  DollarSign,
  Music,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Loader2,
} from "lucide-react";
import { AdminLayout, StatCard } from "@/components/admin/AdminLayout";
import { GoldButton, GlowCard } from "@/components/shared";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  stats: Array<{
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: string;
    color: string;
  }>;
  monthlyData: Array<{ month: string; value: number; users: number }>;
  platformData: Array<{ name: string; value: number; color: string }>;
  topCountries: Array<{ name: string; value: number; flag: string }>;
  deviceData: Array<{ name: string; value: number; icon: string }>;
  topSubmissions: Array<{ name: string; artist: string; streams: string; growth: string }>;
  recentActivity: Array<{ action: string; user: string; time: string; type: string }>;
}

const iconMap: Record<string, any> = {
  DollarSign,
  Users,
  Music,
  Activity,
  Monitor,
  Smartphone,
  Tablet,
};

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6m");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error("Analytics error:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Analytics" subtitle="Track platform performance and insights">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !analyticsData) {
    return (
      <AdminLayout title="Analytics" subtitle="Track platform performance and insights">
        <div className="text-center text-red-400">Error: {error || "No data available"}</div>
      </AdminLayout>
    );
  }

  const stats = analyticsData.stats;
  const revenueData = analyticsData.monthlyData;
  const platformData = analyticsData.platformData;
  const deviceData = analyticsData.deviceData;
  const topCountries = analyticsData.topCountries;
  const topTracks = analyticsData.topSubmissions || [];

  const maxRevenue = Math.max(...revenueData.map((d) => d.value));

  return (
    <AdminLayout
      title="Analytics"
      subtitle="Track platform performance and insights"
      actions={
        <div className="flex items-center gap-2">
          {["1m", "3m", "6m", "1y"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                timeRange === range
                  ? "bg-gold text-luxury-black"
                  : "bg-luxury-lighter text-luxury-gray hover:text-white"
              )}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.icon];
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <StatCard
                {...stat}
                icon={Icon}
                color={stat.color as "gold" | "green" | "orange" | "blue"}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <GlowCard variant="premium" className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gold" />
              Revenue Overview
            </h3>
            <GoldButton variant="ghost" size="sm">
              View Details
              <ChevronRight className="w-4 h-4" />
            </GoldButton>
          </div>

          {/* Chart */}
          <div className="flex items-end justify-between h-48 gap-4">
            {analyticsData.monthlyData.length > 0 ? (
              analyticsData.monthlyData.map((item, index) => {
                const maxRevenue = Math.max(...analyticsData.monthlyData.map((d) => d.value));
                const percentage = maxRevenue > 0 ? (item.value / maxRevenue) * 100 : 0;
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative" style={{ height: `${percentage}%`, minHeight: "20px" }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="absolute bottom-0 w-full bg-gradient-to-t from-gold to-gold/50 rounded-t"
                      />
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white font-medium whitespace-nowrap">
                        £{(item.value / 1000).toFixed(1)}K
                      </div>
                    </div>
                    <span className="text-xs text-luxury-gray">{item.month}</span>
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center text-luxury-gray">No data available</div>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gold/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gold" />
              <span className="text-xs text-luxury-gray">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-400" />
              <span className="text-xs text-luxury-gray">New Users</span>
            </div>
          </div>
        </GlowCard>

        {/* Platform Distribution */}
        <GlowCard variant="default" className="p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Distribution</h3>

          {/* Donut Chart Placeholder */}
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke={analyticsData.platformData[0]?.color || "#1DB954"}
                strokeWidth="20"
                strokeDasharray={`${analyticsData.platformData[0]?.value * 3.77 || 0} ${100 * 3.77}`}
                strokeDashoffset="0"
              />
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke={analyticsData.platformData[1]?.color || "#FF0000"}
                strokeWidth="20"
                strokeDasharray={`${analyticsData.platformData[1]?.value * 3.77 || 0} ${100 * 3.77}`}
                strokeDashoffset={`-${analyticsData.platformData[0]?.value * 3.77 || 0}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {analyticsData.recentActivity?.length || 0}
                </div>
                <div className="text-xs text-luxury-gray">Total</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {analyticsData.platformData.map((platform) => (
              <div key={platform.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-sm text-white">{platform.name}</span>
                </div>
                <span className="text-sm font-medium text-white">{platform.value}%</span>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Device Breakdown */}
        <GlowCard variant="default" className="p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-gold" />
            Device Breakdown
          </h3>
          <div className="space-y-4">
            {analyticsData.deviceData.map((device) => {
              const IconComponent = iconMap[device.icon] || Monitor;
              return (
                <div key={device.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-luxury-gray" />
                      <span className="text-sm text-white">{device.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gold">{device.value}%</span>
                  </div>
                  <div className="h-2 bg-luxury-lighter rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${device.value}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gold rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlowCard>

        {/* Top Countries */}
        <GlowCard variant="default" className="p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-gold" />
            Top Countries
          </h3>
          <div className="space-y-3">
            {analyticsData.topCountries.map((country) => (
              <div key={country.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm text-white">{country.name}</span>
                </div>
                <span className="text-sm font-medium text-luxury-gray">{country.value}%</span>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Top Performing Tracks */}
        <GlowCard variant="premium" className="p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Music className="w-5 h-5 text-gold" />
            Top Performing Tracks
          </h3>
          <div className="space-y-3">
            {topTracks.length > 0 ? (
              topTracks.map((track, index) => (
                <div key={track.name} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-gold/20 flex items-center justify-center text-xs font-medium text-gold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{track.name}</div>
                    <div className="text-xs text-luxury-gray truncate">{track.artist}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gold">{track.streams}</div>
                    <div className="text-xs text-green-400">{track.growth}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-luxury-gray py-4">No submissions yet</div>
            )}
          </div>
        </GlowCard>
      </div>

      {/* Recent Activity */}
      <GlowCard variant="default" className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <GoldButton variant="ghost" size="sm">
            View All
            <ChevronRight className="w-4 h-4" />
          </GoldButton>
        </div>

        <div className="space-y-4">
          {analyticsData.recentActivity.length > 0 ? (
            analyticsData.recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 bg-luxury-lighter/50 rounded-lg"
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    activity.type === "success" && "bg-green-400",
                    activity.type === "info" && "bg-blue-400",
                    activity.type === "warning" && "bg-brand-orange"
                  )}
                />
                <div className="flex-1">
                  <div className="text-sm text-white">{activity.action}</div>
                  <div className="text-xs text-luxury-gray">{activity.user}</div>
                </div>
                <span className="text-xs text-luxury-gray">{activity.time}</span>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-luxury-gray py-8">No recent activity</div>
          )}
        </div>
      </GlowCard>
    </AdminLayout>
  );
}
