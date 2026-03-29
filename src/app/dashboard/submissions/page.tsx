"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { UserLayout, UserStatCard } from "@/components/user/UserLayout";
import { GoldButton, StatusBadge, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

export default function UserSubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [stats, setStats] = useState([
    { title: "Total Submissions", value: "0", icon: Music, color: "gold" as const },
    { title: "Active Campaigns", value: "0", icon: Play, color: "orange" as const },
    { title: "Completed", value: "0", icon: CheckCircle2, color: "green" as const },
    { title: "Total Units", value: "0", icon: BarChart3, color: "blue" as const },
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setLoading(false);
          return;
        }
        const user = JSON.parse(storedUser);

        const res = await fetch(`/api/submissions?userId=${user.id}`);
        const { submissions: data } = await res.json();
        setSubmissions(data || []);

        // Calculate stats
        const total = (data || []).length;
        const active = (data || []).filter((s: any) => s.status === "active" || s.status === "in_progress").length;
        const completed = (data || []).filter((s: any) => s.status === "completed").length;
        
        setStats([
          { title: "Total Submissions", value: total.toString(), icon: Music, color: "gold" as const },
          { title: "Active Campaigns", value: active.toString(), icon: Play, color: "orange" as const },
          { title: "Completed", value: completed.toString(), icon: CheckCircle2, color: "green" as const },
          { title: "Total Units", value: total.toString(), icon: BarChart3, color: "blue" as const },
        ]);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredSubmissions = submissions.filter((sub) => {
    const title = sub.title || "";
    const artist = sub.artist || "";
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <UserLayout title="My Submissions" subtitle="Track and manage your music submissions">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-gold animate-spin" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout
      title="My Submissions"
      subtitle="Track and manage your music submissions"
      actions={
        <Link href="/dashboard/submissions/new">
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
              <div className="flex items-start gap-4 text-left">
                {submission.coverImage ? (
                  <img
                    src={submission.coverImage}
                    alt={submission.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-luxury-gray/20 flex items-center justify-center">
                    <Music className="w-8 h-8 text-gold" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{submission.title}</h3>
                    <StatusBadge status={submission.status.toLowerCase() as any}>
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </StatusBadge>
                  </div>
                  <p className="text-sm text-luxury-gray mb-2">{submission.artist}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gold">{submission.plan?.name || "Generic"}</span>
                    <span className="text-luxury-gray">•</span>
                    <span className="text-luxury-gray">{new Date(submission.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  {(submission.status === "active" || submission.status === "in_progress") && (
                    <>
                      <div className="text-lg font-bold text-gold">{submission.progress_percentage || 0}%</div>
                      <div className="text-xs text-luxury-gray">In Progress</div>
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
              {(submission.status === "active" || submission.status === "in_progress") && (
                <div className="mt-4">
                  <Progress value={submission.progress_percentage || 0} className="h-2 bg-luxury-lighter [&>div]:bg-gold" />
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
          <Link href="/dashboard/submissions/new">
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
                {selectedSubmission.coverImage && (
                  <img
                    src={selectedSubmission.coverImage}
                    alt={selectedSubmission.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                )}
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status={selectedSubmission.status.toLowerCase() as any}>
                      {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                    </StatusBadge>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedSubmission.title}</h2>
                  <p className="text-luxury-gray">{selectedSubmission.artist}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 text-left">
                {/* Progress for Active */}
                {(selectedSubmission.status === "active" || selectedSubmission.status === "in_progress") && (
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-white text-sm">Campaign Progress</span>
                      <span className="text-gold font-medium">{selectedSubmission.progress_percentage || 0}%</span>
                    </div>
                    <Progress value={selectedSubmission.progress_percentage || 0} className="h-3 bg-luxury-lighter [&>div]:bg-gold" />
                  </div>
                )}

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between py-2 border-b border-gold/5">
                    <span className="text-luxury-gray text-sm">Plan</span>
                    <span className="text-gold text-sm">{selectedSubmission.plan?.name || "Generic"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gold/5">
                    <span className="text-luxury-gray text-sm">Platform</span>
                    <span className="text-white text-sm capitalize">{selectedSubmission.trackType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gold/5">
                    <span className="text-luxury-gray text-sm">Submitted</span>
                    <span className="text-white text-sm">{new Date(selectedSubmission.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <GoldButton variant="outline" className="flex-1" onClick={() => window.open(selectedSubmission.trackUrl, '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on {selectedSubmission.trackType === "spotify" ? "Spotify" : "YouTube"}
                  </GoldButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UserLayout>
  );
}
