"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  Search,
  Filter,
  Check,
  X,
  Eye,
  Calendar,
  Clock,
  User,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  Edit2,
  Save,
  Sparkles,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge, GoldButton } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  title: string;
  artist: string;
  trackType: string;
  trackUrl: string;
  status: "active" | "completed";
  paymentStatus: string;
  plan: string;
  amount: number;
  currency: string;
  user: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface StatCard {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const iconMap: { [key: string]: any } = {
  campaign: Music,
  active: Sparkles,
  completed: Check,
  revenue: DollarSign,
};

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export default function AdminCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [stats, setStats] = useState<StatCard[]>([
    { title: "Total Campaigns", value: "0", icon: "campaign", color: "from-blue-600 to-blue-400" },
    { title: "Active Campaigns", value: "0", icon: "active", color: "from-green-600 to-green-400" },
    { title: "Completed", value: "0", icon: "completed", color: "from-purple-600 to-purple-400" },
    { title: "Total Revenue", value: "£0", icon: "revenue", color: "from-yellow-600 to-yellow-400" },
  ]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Fetch campaigns data
  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter, pagination.page, searchQuery]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        status: statusFilter,
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/admin/campaigns?${params}`);
      const data = await response.json();

      if (response.ok) {
        setCampaigns(data.campaigns);
        setPagination(data.pagination);

        // Update stats
        const statsData: StatCard[] = [
          {
            title: "Total Campaigns",
            value: data.stats.totalCampaigns.toString(),
            icon: "campaign",
            color: "from-blue-600 to-blue-400",
          },
          {
            title: "Active Campaigns",
            value: data.stats.activeCampaigns.toString(),
            icon: "active",
            color: "from-green-600 to-green-400",
          },
          {
            title: "Completed",
            value: data.stats.completedCampaigns.toString(),
            icon: "completed",
            color: "from-purple-600 to-purple-400",
          },
          {
            title: "Total Revenue",
            value: `£${data.stats.totalRevenue.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: "revenue",
            color: "from-yellow-600 to-yellow-400",
          },
        ];
        setStats(statsData);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    try {
      setActionLoading(campaignId);
      const response = await fetch(`/api/admin/campaigns`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: campaignId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setCampaigns((prev) =>
          prev.map((c) => (c.id === campaignId ? { ...c, status: newStatus as "active" | "completed" } : c))
        );
        if (selectedCampaign?.id === campaignId) {
          setSelectedCampaign({ ...selectedCampaign, status: newStatus as "active" | "completed" });
        }
      }
    } catch (error) {
      console.error("Failed to update campaign status:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateNotes = async (campaignId: string) => {
    try {
      setActionLoading(campaignId);
      const response = await fetch(`/api/admin/campaigns`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: campaignId,
          notes: editNotes,
          endDate: editEndDate || undefined,
        }),
      });

      if (response.ok) {
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === campaignId
              ? { ...c, notes: editNotes, endDate: editEndDate || c.endDate }
              : c
          )
        );
        if (selectedCampaign?.id === campaignId) {
          setSelectedCampaign({
            ...selectedCampaign,
            notes: editNotes,
            endDate: editEndDate || selectedCampaign.endDate,
          });
        }
        setEditingId(null);
        setEditNotes("");
        setEditEndDate("");
      }
    } catch (error) {
      console.error("Failed to update campaign notes:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenEdit = (campaign: Campaign) => {
    setEditingId(campaign.id);
    setEditNotes(campaign.notes);
    setEditEndDate(campaign.endDate);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNotes("");
    setEditEndDate("");
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Campaign Manager</h1>
            <p className="text-gray-400">Manage and track all active and completed campaigns</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon];
              return (
                <div
                  key={index}
                  className={`p-6 rounded-lg bg-gradient-to-r ${stat.color} shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                      <p className="text-white text-2xl font-bold mt-2">{stat.value}</p>
                    </div>
                    {IconComponent && (
                      <IconComponent className="w-10 h-10 text-white/50 ml-4" />
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search campaigns by title, artist, or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="flex gap-2">
              {statusFilters.map((filter) => (
                <Button
                  key={filter.value}
                  onClick={() => {
                    setStatusFilter(filter.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all",
                    statusFilter === filter.value
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  )}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Campaigns Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No campaigns found</p>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="overflow-x-auto"
              >
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="px-4 py-4 text-left text-gray-300 font-semibold">Title/Artist</th>
                      <th className="px-4 py-4 text-left text-gray-300 font-semibold">Artist</th>
                      <th className="px-4 py-4 text-left text-gray-300 font-semibold">User</th>
                      <th className="px-4 py-4 text-left text-gray-300 font-semibold">Amount</th>
                      <th className="px-4 py-4 text-left text-gray-300 font-semibold">Status</th>
                      <th className="px-4 py-4 text-left text-gray-300 font-semibold">Start Date</th>
                      <th className="px-4 py-4 text-left text-gray-300 font-semibold">End Date</th>
                      <th className="px-4 py-4 text-left text-gray-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {campaigns.map((campaign) => (
                        <motion.tr
                          key={campaign.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-white font-medium">{campaign.title}</p>
                              <p className="text-xs text-gray-400">{campaign.trackType}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-white">{campaign.artist}</td>
                          <td className="px-4 py-4">
                            <div className="text-white text-sm">{campaign.userName}</div>
                            <div className="text-xs text-gray-400">{campaign.user}</div>
                          </td>
                          <td className="px-4 py-4 text-white font-semibold">
                            £{campaign.amount.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={campaign.status} />
                          </td>
                          <td className="px-4 py-4 text-gray-300 text-sm">{campaign.startDate}</td>
                          <td className="px-4 py-4 text-gray-300 text-sm">{campaign.endDate}</td>
                          <td className="px-4 py-4">
                            <Button
                              onClick={() => setSelectedCampaign(campaign)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1"
                            >
                              View
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </motion.div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <Button
                    onClick={() =>
                      setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })
                    }
                    disabled={pagination.page <= 1}
                    className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-gray-300">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: Math.min(pagination.pages, pagination.page + 1),
                      })
                    }
                    disabled={pagination.page >= pagination.pages}
                    className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Campaign Detail Modal */}
          <AnimatePresence>
            {selectedCampaign && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCampaign(null)}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">{selectedCampaign.title}</h2>
                    <Button
                      onClick={() => setSelectedCampaign(null)}
                      className="bg-slate-700 hover:bg-slate-600 text-white"
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Campaign Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Artist</p>
                        <p className="text-white font-semibold">{selectedCampaign.artist}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Track Type</p>
                        <p className="text-white font-semibold capitalize">{selectedCampaign.trackType}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Amount</p>
                        <p className="text-white font-semibold">
                          £{selectedCampaign.amount.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Plan</p>
                        <p className="text-white font-semibold">{selectedCampaign.plan}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Status</p>
                        <div className="mt-1">
                          <StatusBadge status={selectedCampaign.status} />
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Payment Status</p>
                        <p className="text-white font-semibold capitalize">{selectedCampaign.paymentStatus}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Start Date</p>
                        <p className="text-white font-semibold">{selectedCampaign.startDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">End Date</p>
                        <p className="text-white font-semibold">{selectedCampaign.endDate}</p>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="border-t border-slate-700 pt-6">
                      <h3 className="text-white font-semibold mb-4">Campaign Owner</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Name</p>
                          <p className="text-white font-semibold">{selectedCampaign.userName}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Email</p>
                          <p className="text-white font-semibold">{selectedCampaign.user}</p>
                        </div>
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div className="border-t border-slate-700 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">Notes</h3>
                        {editingId !== selectedCampaign.id && (
                          <Button
                            onClick={() => handleOpenEdit(selectedCampaign)}
                            className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-1"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>

                      {editingId === selectedCampaign.id ? (
                        <div className="space-y-4">
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Add campaign notes..."
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder:text-gray-500 resize-none"
                            rows={4}
                          />
                          <div>
                            <label className="text-gray-400 text-sm block mb-2">End Date</label>
                            <input
                              type="date"
                              value={editEndDate}
                              onChange={(e) => setEditEndDate(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleUpdateNotes(selectedCampaign.id)}
                              disabled={actionLoading === selectedCampaign.id}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              {actionLoading === selectedCampaign.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Save className="w-4 h-4 mr-1" />
                                  Save Changes
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={handleCancelEdit}
                              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-300">{selectedCampaign.notes || "No notes added"}</p>
                      )}
                    </div>

                    {/* Status Change */}
                    <div className="border-t border-slate-700 pt-6">
                      <h3 className="text-white font-semibold mb-4">Campaign Status</h3>
                      <div className="flex gap-2">
                        {selectedCampaign.status !== "active" && (
                          <Button
                            onClick={() => handleStatusChange(selectedCampaign.id, "active")}
                            disabled={actionLoading === selectedCampaign.id}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            {actionLoading === selectedCampaign.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-1" />
                                Make Active
                              </>
                            )}
                          </Button>
                        )}
                        {selectedCampaign.status !== "completed" && (
                          <Button
                            onClick={() => handleStatusChange(selectedCampaign.id, "completed")}
                            disabled={actionLoading === selectedCampaign.id}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {actionLoading === selectedCampaign.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Mark Complete
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Track Info */}
                    <div className="border-t border-slate-700 pt-6">
                      <h3 className="text-white font-semibold mb-4">Track Information</h3>
                      <a
                        href={selectedCampaign.trackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 break-all"
                      >
                        {selectedCampaign.trackUrl}
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}
