"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  Search,
  Filter,
  Download,
  Check,
  X,
  Eye,
  MoreVertical,
  Calendar,
  Clock,
  User,
  DollarSign,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Play,
  Loader2,
} from "lucide-react";
import { AdminLayout, StatCard, DataTable, FilterBadge } from "@/components/admin/AdminLayout";
import { GoldButton, StatusBadge, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";



const statusFilters = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
];

interface Submission {
  id: string;
  title: string;
  artist: string;
  cover: string;
  user: string;
  userId: string;
  userName: string;
  status: "pending" | "active" | "completed" | "rejected";
  plan: string;
  amount: number;
  platform: string;
  submittedAt: string;
  description?: string;
  audioUrl?: string;
}

export default function AdminSubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    activeSubmissions: 0,
    monthlyRevenue: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Fetch submissions data
  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, pagination.page]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        status: statusFilter,
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/admin/submissions?${params}`);
      const data = await response.json();

      if (response.ok) {
        setSubmissions(data.submissions);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPagination({ ...pagination, page: 1 });
  };

  const handleAction = async (submissionId: string, action: "approve" | "reject" | "complete") => {
    try {
      setActionLoading(submissionId);
      const response = await fetch(`/api/admin/submissions/${submissionId}/${action}`, {
        method: "POST",
      });

      if (response.ok) {
        // Update local state
        const updated = submissions.map((sub) =>
          sub.id === submissionId
            ? {
                ...sub,
                status: action === "approve" ? "active" : action === "reject" ? "rejected" : "completed",
              }
            : sub
        );
        setSubmissions(updated);

        // Refresh stats
        await fetchSubmissions();
        setSelectedSubmission(null);
      }
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const formattedStats = [
    {
      title: "Total Submissions",
      value: stats.totalSubmissions.toString(),
      change: "+12.5%",
      icon: Music,
      color: "gold" as const,
    },
    {
      title: "Pending Review",
      value: stats.pendingSubmissions.toString(),
      change: "-3",
      icon: Clock,
      color: "orange" as const,
    },
    {
      title: "Active Campaigns",
      value: stats.activeSubmissions.toString(),
      change: "+8",
      icon: Play,
      color: "green" as const,
    },
    {
      title: "This Month Revenue",
      value: `£${stats.monthlyRevenue.toLocaleString()}`,
      change: "+23.1%",
      icon: DollarSign,
      color: "blue" as const,
    },
  ];

  const columns = [
    {
      key: "track",
      label: "Track",
      render: (_: unknown, row: Submission) => (
        <div className="flex items-center gap-3">
          <img src={row.cover} alt={row.title} className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <div className="font-medium text-white">{row.title}</div>
            <div className="text-xs text-luxury-gray">{row.artist}</div>
          </div>
        </div>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (value: unknown) => <span className="text-luxury-gray">{String(value)}</span>,
    },
    {
      key: "platform",
      label: "Platform",
      render: (value: unknown) => (
        <div className="flex items-center gap-1.5">
          {value === "spotify" ? (
            <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          )}
          <span className="text-xs capitalize">{String(value)}</span>
        </div>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      render: (value: unknown) => <span className="text-white">{String(value)}</span>,
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: unknown) => <span className="text-gold font-medium">£{String(value)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => (
        <StatusBadge status={String(value) as "pending" | "active" | "completed" | "rejected"}>
          {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
        </StatusBadge>
      ),
    },
    {
      key: "submittedAt",
      label: "Date",
      render: (value: unknown) => <span className="text-luxury-gray text-xs">{String(value)}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: unknown, row: Submission) => (
        <div className="flex items-center gap-1">
          {row.status === "pending" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-400 hover:text-green-300 hover:bg-green-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Approve"
                disabled={actionLoading === row.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(row.id, "approve");
                }}
              >
                {actionLoading === row.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Reject"
                disabled={actionLoading === row.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(row.id, "reject");
                }}
              >
                {actionLoading === row.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </Button>
            </>
          )}
          {row.status === "active" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Mark Complete"
              disabled={actionLoading === row.id}
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row.id, "complete");
              }}
            >
              {actionLoading === row.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-gold hover:text-brand-orange"
            title="View Details"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSubmission(row);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Submissions"
      subtitle="Manage all music submissions"
      actions={
        <div className="flex items-center gap-3">
          <GoldButton variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </GoldButton>
          <GoldButton size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </GoldButton>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {formattedStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gray" />
          <Input
            placeholder="Search by track, artist, or user..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-luxury-dark border-gold/20 focus:border-gold h-10 pl-10 text-white placeholder:text-luxury-gray"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {statusFilters.map((filter) => (
            <FilterBadge
              key={filter.value}
              label={filter.label}
              active={statusFilter === filter.value}
              onClick={() => setStatusFilter(filter.value)}
            />
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={submissions}
            onRowClick={(row) => setSelectedSubmission(row as Submission)}
          />
        )}
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-luxury-gray">
          Showing {submissions.length} of {pagination.total} submissions
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gold/20 text-luxury-gray hover:text-white"
            disabled={pagination.page === 1}
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-white">
            {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="border-gold/20 text-luxury-gray hover:text-white"
            disabled={pagination.page === pagination.pages}
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

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
              className="relative w-full max-w-2xl bg-luxury-dark border border-gold/20 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gold/10">
                <h3 className="text-lg font-semibold text-white">Submission Details</h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 text-luxury-gray hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Track Info */}
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={selectedSubmission.cover}
                    alt={selectedSubmission.title}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-white">{selectedSubmission.title}</h4>
                    <p className="text-luxury-gray">{selectedSubmission.artist}</p>
                    <StatusBadge status={selectedSubmission.status as "pending" | "active" | "completed" | "rejected"} className="mt-2">
                      {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                    </StatusBadge>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-luxury-black/50 rounded-lg p-3">
                    <div className="text-xs text-luxury-gray mb-1">User</div>
                    <div className="text-sm text-white">{selectedSubmission.user}</div>
                  </div>
                  <div className="bg-luxury-black/50 rounded-lg p-3">
                    <div className="text-xs text-luxury-gray mb-1">Plan</div>
                    <div className="text-sm text-white">{selectedSubmission.plan}</div>
                  </div>
                  <div className="bg-luxury-black/50 rounded-lg p-3">
                    <div className="text-xs text-luxury-gray mb-1">Amount</div>
                    <div className="text-sm text-gold font-medium">£{selectedSubmission.amount}</div>
                  </div>
                  <div className="bg-luxury-black/50 rounded-lg p-3">
                    <div className="text-xs text-luxury-gray mb-1">Platform</div>
                    <div className="text-sm text-white capitalize">{selectedSubmission.platform}</div>
                  </div>
                  <div className="bg-luxury-black/50 rounded-lg p-3">
                    <div className="text-xs text-luxury-gray mb-1">Submitted</div>
                    <div className="text-sm text-white">{selectedSubmission.submittedAt}</div>
                  </div>
                  <div className="bg-luxury-black/50 rounded-lg p-3">
                    <div className="text-xs text-luxury-gray mb-1">ID</div>
                    <div className="text-sm text-white font-mono">{selectedSubmission.id}</div>
                  </div>
                </div>

                {/* Actions */}
                {selectedSubmission.status === "pending" && (
                  <div className="flex gap-3">
                    <GoldButton
                      className="flex-1"
                      disabled={actionLoading === selectedSubmission.id}
                      onClick={() => handleAction(selectedSubmission.id, "approve")}
                    >
                      {actionLoading === selectedSubmission.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Approve & Start Campaign
                    </GoldButton>
                    <GoldButton
                      variant="outline"
                      className="flex-1 border-red-400/50 text-red-400 hover:bg-red-400/10"
                      disabled={actionLoading === selectedSubmission.id}
                      onClick={() => handleAction(selectedSubmission.id, "reject")}
                    >
                      {actionLoading === selectedSubmission.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <X className="w-4 h-4 mr-2" />
                      )}
                      Reject Submission
                    </GoldButton>
                  </div>
                )}
                {selectedSubmission.status === "active" && (
                  <div className="flex gap-3">
                    <GoldButton
                      className="flex-1"
                      disabled={actionLoading === selectedSubmission.id}
                      onClick={() => handleAction(selectedSubmission.id, "complete")}
                    >
                      {actionLoading === selectedSubmission.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Mark as Complete
                    </GoldButton>
                  </div>
                )}
                {(selectedSubmission.status === "completed" || selectedSubmission.status === "rejected") && (
                  <div className="bg-luxury-lighter rounded-lg p-4 text-center">
                    <p className="text-luxury-gray text-sm">
                      This submission is {selectedSubmission.status}. No further actions available.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
