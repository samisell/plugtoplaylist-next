"use client";

import { useState } from "react";
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
} from "lucide-react";
import { AdminLayout, StatCard, DataTable, FilterBadge } from "@/components/admin/AdminLayout";
import { GoldButton, StatusBadge, GlowCard } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
  { title: "Total Submissions", value: "1,247", change: "+12.5%", icon: Music, color: "gold" as const },
  { title: "Pending Review", value: "12", change: "-3", icon: Clock, color: "orange" as const },
  { title: "Active Campaigns", value: "89", change: "+8", icon: Play, color: "green" as const },
  { title: "This Month Revenue", value: "$24,850", change: "+23.1%", icon: DollarSign, color: "blue" as const },
];

const mockSubmissions = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop",
    user: "alex@email.com",
    userId: "user_1",
    status: "pending",
    plan: "Premium",
    amount: 149,
    platform: "spotify",
    submittedAt: "2024-01-21",
  },
  {
    id: "2",
    title: "Shape of You",
    artist: "Ed Sheeran",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    user: "maya@email.com",
    userId: "user_2",
    status: "active",
    plan: "Professional",
    amount: 349,
    platform: "youtube",
    submittedAt: "2024-01-18",
  },
  {
    id: "3",
    title: "Levitating",
    artist: "Dua Lipa",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
    user: "jordan@email.com",
    userId: "user_3",
    status: "completed",
    plan: "Starter",
    amount: 49,
    platform: "spotify",
    submittedAt: "2024-01-10",
  },
  {
    id: "4",
    title: "Stay",
    artist: "Kid Laroi",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    user: "nina@email.com",
    userId: "user_4",
    status: "pending",
    plan: "Premium",
    amount: 149,
    platform: "spotify",
    submittedAt: "2024-01-20",
  },
  {
    id: "5",
    title: "Peaches",
    artist: "Justin Bieber",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop",
    user: "marcus@email.com",
    userId: "user_5",
    status: "active",
    plan: "Professional",
    amount: 349,
    platform: "youtube",
    submittedAt: "2024-01-19",
  },
  {
    id: "6",
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
    user: "sophie@email.com",
    userId: "user_6",
    status: "rejected",
    plan: "Starter",
    amount: 49,
    platform: "spotify",
    submittedAt: "2024-01-15",
  },
];

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
];

export default function AdminSubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<typeof mockSubmissions[0] | null>(null);

  const filteredSubmissions = mockSubmissions.filter((sub) => {
    const matchesSearch =
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: "track",
      label: "Track",
      render: (_: unknown, row: typeof mockSubmissions[0]) => (
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
      render: (value: unknown) => <span className="text-gold font-medium">${String(value)}</span>,
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
      render: (_: unknown, row: typeof mockSubmissions[0]) => (
        <div className="flex items-center gap-1">
          {row.status === "pending" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                title="Approve"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                title="Reject"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
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
        {stats.map((stat, index) => (
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
            onChange={(e) => setSearchQuery(e.target.value)}
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
        <DataTable
          columns={columns}
          data={filteredSubmissions}
          onRowClick={(row) => setSelectedSubmission(row as typeof mockSubmissions[0])}
        />
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-luxury-gray">
          Showing {filteredSubmissions.length} of {mockSubmissions.length} submissions
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-gold/20 text-luxury-gray hover:text-white">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-white">1 of 25</span>
          <Button variant="outline" size="sm" className="border-gold/20 text-luxury-gray hover:text-white">
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
                    <div className="text-sm text-gold font-medium">${selectedSubmission.amount}</div>
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
                    <GoldButton className="flex-1">
                      <Check className="w-4 h-4 mr-2" />
                      Approve & Start Campaign
                    </GoldButton>
                    <GoldButton variant="outline" className="flex-1 border-red-400/50 text-red-400 hover:bg-red-400/10">
                      <X className="w-4 h-4 mr-2" />
                      Reject Submission
                    </GoldButton>
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
