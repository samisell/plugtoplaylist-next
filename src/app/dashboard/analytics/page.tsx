"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Music,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  Users,
  Clock,
  Globe,
  Headphones,
} from "lucide-react";
import { UserLayout, UserStatCard } from "@/components/user/UserLayout";
import { GoldButton, GlowCard } from "@/components/shared";
import { cn } from "@/lib/utils";

const stats = [
  { title: "Total Streams", value: "125.4K", change: "+45.2%", icon: Play, color: "gold" as const },
  { title: "Avg. Daily Streams", value: "892", change: "+12.5%", icon: TrendingUp, color: "green" as const },
  { title: "Playlist Placements", value: "47", change: "+8", icon: Music, color: "orange" as const },
  { title: "Engagement Rate", value: "3.2%", change: "+0.8%", icon: Headphones, color: "blue" as const },
];

const streamingData = [
  { month: "Jan", streams: 8500, listeners: 4200 },
  { month: "Feb", streams: 12000, listeners: 5800 },
  { month: "Mar", streams: 18000, listeners: 8200 },
  { month: "Apr", streams: 22000, listeners: 10500 },
  { month: "May", streams: 28000, listeners: 12500 },
  { month: "Jun", streams: 36500, listeners: 15800 },
];

const topTracks = [
  { name: "Blinding Lights", streams: "45.2K", growth: "+45%", progress: 65 },
  { name: "Levitating", streams: "80.2K", growth: "+32%", progress: 100 },
  { name: "Stay", streams: "12.8K", growth: "+22%", progress: 30 },
  { name: "Shape of You", streams: "-", growth: "Pending", progress: 0 },
];

const platformData = [
  { name: "Spotify", percentage: 72, color: "#1DB954", streams: "90,288" },
  { name: "YouTube Music", percentage: 28, color: "#FF0000", streams: "35,112" },
];

const geographicData = [
  { country: "United States", flag: "🇺🇸", percentage: 38 },
  { country: "United Kingdom", flag: "🇬🇧", percentage: 22 },
  { country: "Germany", flag: "🇩🇪", percentage: 15 },
  { country: "Canada", flag: "🇨🇦", percentage: 12 },
  { country: "Australia", flag: "🇦🇺", percentage: 8 },
  { country: "Others", flag: "🌍", percentage: 5 },
];

const playlistPlacements = [
  { name: "Today's Top Hits", followers: "35M", added: "Jan 16" },
  { name: "Chill Vibes", followers: "12M", added: "Jan 17" },
  { name: "Pop Rising", followers: "8M", added: "Jan 18" },
  { name: "Evening Chill", followers: "5M", added: "Jan 19" },
  { name: "Indie Mix", followers: "3M", added: "Jan 20" },
];

export default function UserAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6m");
  const maxStreams = Math.max(...streamingData.map((d) => d.streams));

  return (
    <UserLayout
      title="Analytics"
      subtitle="Track your music performance and growth"
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <UserStatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Streams Over Time */}
        <GlowCard variant="premium" className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gold" />
              Streams Over Time
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gold" />
                <span className="text-luxury-gray">Streams</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-400" />
                <span className="text-luxury-gray">Listeners</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex items-end justify-between h-48 gap-4">
            {streamingData.map((item, index) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative" style={{ height: `${(item.streams / maxStreams) * 100}%` }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-gold to-gold/50 rounded-t"
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white font-medium whitespace-nowrap">
                    {(item.streams / 1000).toFixed(0)}K
                  </div>
                </div>
                <span className="text-xs text-luxury-gray">{item.month}</span>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Platform Distribution */}
        <GlowCard variant="default" className="p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Distribution</h3>

          {/* Donut Chart */}
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke="#1DB954"
                strokeWidth="20"
                strokeDasharray={`${platformData[0].percentage * 3.77} ${100 * 3.77}`}
              />
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke="#FF0000"
                strokeWidth="20"
                strokeDasharray={`${platformData[1].percentage * 3.77} ${100 * 3.77}`}
                strokeDashoffset={`-${platformData[0].percentage * 3.77}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">125.4K</div>
                <div className="text-xs text-luxury-gray">Total</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {platformData.map((platform) => (
              <div key={platform.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-sm text-white">{platform.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-white">{platform.percentage}%</span>
                  <span className="text-xs text-luxury-gray ml-2">{platform.streams}</span>
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Top Performing Tracks */}
        <GlowCard variant="premium" className="p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Music className="w-5 h-5 text-gold" />
            Top Performing Tracks
          </h3>
          <div className="space-y-4">
            {topTracks.map((track, index) => (
              <div key={track.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-gold/20 flex items-center justify-center text-xs font-medium text-gold">
                      {index + 1}
                    </div>
                    <span className="text-white font-medium">{track.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gold font-medium">{track.streams}</span>
                    <span className="text-xs text-green-400 ml-2">{track.growth}</span>
                  </div>
                </div>
                {track.progress > 0 && (
                  <div className="h-1.5 bg-luxury-lighter rounded-full overflow-hidden ml-9">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-500"
                      style={{ width: `${track.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Geographic Distribution */}
        <GlowCard variant="default" className="p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-gold" />
            Listener Geography
          </h3>
          <div className="space-y-3">
            {geographicData.map((geo) => (
              <div key={geo.country}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{geo.flag}</span>
                    <span className="text-sm text-white">{geo.country}</span>
                  </div>
                  <span className="text-sm font-medium text-gold">{geo.percentage}%</span>
                </div>
                <div className="h-2 bg-luxury-lighter rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold to-gold/60 rounded-full"
                    style={{ width: `${geo.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* Playlist Placements */}
      <GlowCard variant="default" className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-gold" />
            Recent Playlist Placements
          </h3>
          <span className="text-sm text-luxury-gray">{playlistPlacements.length} playlists</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/10">
                <th className="text-left py-3 px-3 text-xs font-medium text-luxury-gray uppercase tracking-wider">Playlist</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-luxury-gray uppercase tracking-wider">Followers</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-luxury-gray uppercase tracking-wider">Added</th>
                <th className="text-right py-3 px-3 text-xs font-medium text-luxury-gray uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {playlistPlacements.map((playlist, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gold/5 hover:bg-luxury-lighter/30"
                >
                  <td className="py-3 px-3">
                    <span className="font-medium text-white">{playlist.name}</span>
                  </td>
                  <td className="py-3 px-3 text-gold">{playlist.followers}</td>
                  <td className="py-3 px-3 text-luxury-gray">{playlist.added}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 rounded">
                      Active
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlowCard>
    </UserLayout>
  );
}
