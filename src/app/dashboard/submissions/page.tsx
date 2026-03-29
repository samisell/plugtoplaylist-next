"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Music,
  Search,
  Filter,
  Plus,
  ChevronRight,
  ExternalLink,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  Calendar,
  BarChart3,
  MoreVertical,
} from "lucide-react";
import { UserLayout, UserStatCard } from "@/components/user/UserLayout";
import { GoldButton, StatusBadge, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const stats = [
  { title: "Total Submissions", value: "12", icon: Music, color: "gold" as const },
  { title: "Active Campaigns", value: "3", icon: Play, color: "orange" as const },
  { title: "Completed", value: "8", icon: CheckCircle2, color: "green" as const },
  { title: "Total Streams", value: "125.4K", icon: BarChart3, color: "blue" as const },
];

const mockSubmissions = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop",
    platform: "spotify",
    platformUrl: "https://open.spotify.com/track/...",
    status: "active",
    plan: "Premium",
    planPrice: 149,
    submittedAt: "Jan 15, 2024",
    startDate: "Jan 16, 2024",
    endDate: "Feb 13, 2024",
    streams: "45.2K",
    progress: 65,
    daysRemaining: 18,
    playlists: 12,
  },
  {
    id: "2",
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    platform: "youtube",
    platformUrl: "https://youtube.com/watch?v=...",
    status: "pending",
    plan: "Starter",
    planPrice: 49,
    submittedAt: "Jan 18, 2024",
    startDate: null,
    endDate: null,
    streams: "-",
    progress: 0,
    daysRemaining: 0,
    playlists: 0,
  },
  {
    id: "3",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    platform: "spotify",
    platformUrl: "https://open.spotify.com/track/...",
    status: "completed",
    plan: "Professional",
    planPrice: 349,
    submittedAt: "Jan 10, 2024",
    startDate: "Jan 11, 2024",
    endDate: "Feb 8, 2024",
    streams: "80.2K",
    progress: 100,
    daysRemaining: 0,
    playlists: 52,
  },
  {
    id: "4",
    title: "Stay",
    artist: "Kid Laroi ft. Justin Bieber",
    album: "F*ck Love 3",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    platform: "spotify",
    platformUrl: "https://open.spotify.com/track/...",
    status: "active",
    plan: "Premium",
    planPrice: 149,
    submittedAt: "Jan 20, 2024",
    startDate: "Jan 21, 2024",
    endDate: "Feb 18, 2024",
    streams: "12.8K",
    progress: 30,
    daysRemaining: 42,
    playlists: 8,
  },
  {
    id: "5",
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop",
    platform: "youtube",
    platformUrl: "https://youtube.com/watch?v=...",
    status: "cancelled",
    plan: "Starter",
    planPrice: 49,
    submittedAt: "Jan 5, 2024",
    startDate: null,
    endDate: null,
    streams: "-",
    progress: 0,
    daysRemaining: 0,
    playlists: 0,
  },
];

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

export default function UserSubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<typeof mockSubmissions[0] | null>(null);

  const filteredSubmissions = mockSubmissions.filter((sub) => {
    const matchesSearch =
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <UserLayout
      title="My Submissions"
      subtitle="Track and manage your music submissions"
      actions={
        <Link href="/submit">
          <GoldButton size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Submission
          </GoldButton>
        </Link>
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

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gray" />
          <Input
            placeholder="Search by track or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-luxury-dark border-gold/20 focus:border-gold h-10 pl-10 text-white placeholder:text-luxury-gray"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                statusFilter === filter.value
                  ? "bg-gold text-luxury-black"
                  : "bg-luxury-lighter text-luxury-gray hover:text-white"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSubmissions.map((submission, index) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlowCard
              variant={submission.status === "active" ? "premium" : "default"}
              className="p-4 cursor-pointer hover:border-gold/50"
              onClick={() => setSelectedSubmission(submission)}
            >
              <div className="flex items-start gap-4">
                <img
                  src={submission.cover}
                  alt={submission.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{submission.title}</h3>
                    <StatusBadge status={submission.status as "pending" | "active" | "completed" | "cancelled"}>
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </StatusBadge>
                  </div>
                  <p className="text-sm text-luxury-gray mb-2">{submission.artist}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gold">{submission.plan}</span>
                    <span className="text-luxury-gray">•</span>
                    <span className="text-luxury-gray">{submission.submittedAt}</span>
                  </div>
                </div>
                <div className="text-right">
                  {submission.status === "active" && (
                    <>
                      <div className="text-lg font-bold text-gold">{submission.progress}%</div>
                      <div className="text-xs text-luxury-gray">{submission.daysRemaining} days left</div>
                    </>
                  )}
                  {submission.status === "completed" && (
                    <div className="text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Done
                    </div>
                  )}
                  {submission.status === "pending" && (
                    <div className="text-brand-orange flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Review
                    </div>
                  )}
                  {submission.status === "cancelled" && (
                    <div className="text-red-400 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Cancelled
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar for Active */}
              {submission.status === "active" && (
                <div className="mt-4">
                  <Progress value={submission.progress} className="h-2 bg-luxury-lighter [&>div]:bg-gold" />
                  <div className="flex items-center justify-between mt-2 text-xs text-luxury-gray">
                    <span>{submission.streams} streams</span>
                    <span>{submission.playlists} playlists</span>
                  </div>
                </div>
              )}

              {/* Stats for Completed */}
              {submission.status === "completed" && (
                <div className="mt-4 flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-luxury-gray">Streams: </span>
                    <span className="text-green-400 font-medium">{submission.streams}</span>
                  </div>
                  <div>
                    <span className="text-luxury-gray">Playlists: </span>
                    <span className="text-gold font-medium">{submission.playlists}</span>
                  </div>
                </div>
              )}
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gold/10 flex items-center justify-center mb-4">
            <Music className="w-8 h-8 text-gold" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No submissions found</h3>
          <p className="text-luxury-gray mb-6">Try adjusting your search or filter criteria</p>
          <Link href="/submit">
            <GoldButton>
              <Plus className="w-4 h-4 mr-2" />
              Submit Your First Track
            </GoldButton>
          </Link>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSubmission(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-luxury-dark border border-gold/20 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header Image */}
              <div className="relative h-40 bg-gradient-to-br from-gold/20 to-brand-orange/10">
                <img
                  src={selectedSubmission.cover}
                  alt={selectedSubmission.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status={selectedSubmission.status as "pending" | "active" | "completed" | "cancelled"}>
                      {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                    </StatusBadge>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedSubmission.title}</h2>
                  <p className="text-luxury-gray">{selectedSubmission.artist}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Progress for Active */}
                {selectedSubmission.status === "active" && (
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-white">Campaign Progress</span>
                      <span className="text-gold font-medium">{selectedSubmission.progress}%</span>
                    </div>
                    <Progress value={selectedSubmission.progress} className="h-3 bg-luxury-lighter [&>div]:bg-gold" />
                    <div className="flex justify-between mt-2 text-xs text-luxury-gray">
                      <span>Started: {selectedSubmission.startDate}</span>
                      <span>{selectedSubmission.daysRemaining} days remaining</span>
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-luxury-lighter/50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-gold">{selectedSubmission.streams}</div>
                    <div className="text-xs text-luxury-gray">Total Streams</div>
                  </div>
                  <div className="bg-luxury-lighter/50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-white">{selectedSubmission.playlists}</div>
                    <div className="text-xs text-luxury-gray">Playlists</div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between py-2 border-b border-gold/5">
                    <span className="text-luxury-gray">Plan</span>
                    <span className="text-gold">{selectedSubmission.plan} (${selectedSubmission.planPrice})</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gold/5">
                    <span className="text-luxury-gray">Platform</span>
                    <span className="text-white capitalize">{selectedSubmission.platform}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gold/5">
                    <span className="text-luxury-gray">Submitted</span>
                    <span className="text-white">{selectedSubmission.submittedAt}</span>
                  </div>
                  {selectedSubmission.startDate && (
                    <div className="flex justify-between py-2 border-b border-gold/5">
                      <span className="text-luxury-gray">Campaign Period</span>
                      <span className="text-white">{selectedSubmission.startDate} - {selectedSubmission.endDate}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <GoldButton variant="outline" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on {selectedSubmission.platform === "spotify" ? "Spotify" : "YouTube"}
                  </GoldButton>
                  {selectedSubmission.status === "active" && (
                    <GoldButton className="flex-1">
                      View Analytics
                    </GoldButton>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UserLayout>
  );
}
