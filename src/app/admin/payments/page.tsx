"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Download,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { AdminLayout, StatCard, DataTable, FilterBadge } from "@/components/admin/AdminLayout";
import { GoldButton, StatusBadge } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Payment {
  id: string;
  transactionId: string;
  user: string;
  userName: string;
  track: string;
  plan: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed" | "refunded";
  method: string;
  createdAt: string;
}

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

export default function AdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidPayments: 0,
    pendingPayments: 0,
    totalRefunds: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, pagination.page]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        status: statusFilter,
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/admin/payments?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPayments(data.payments);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async () => {
    if (!selectedPayment) return;

    try {
      const response = await fetch(`/api/admin/payments/${selectedPayment.id}/approve`, {
        method: "POST",
      });

      if (response.ok) {
        // Update the payment status locally
        setSelectedPayment({
          ...selectedPayment,
          status: "paid",
        });
        // Refresh the payments list
        await fetchPayments();
      }
    } catch (error) {
      console.error("Failed to approve payment:", error);
    }
  };

  const handleRejectPayment = async () => {
    if (!selectedPayment) return;

    try {
      const response = await fetch(`/api/admin/payments/${selectedPayment.id}/reject`, {
        method: "POST",
      });

      if (response.ok) {
        // Update the payment status locally
        setSelectedPayment({
          ...selectedPayment,
          status: "failed",
        });
        // Refresh the payments list
        await fetchPayments();
      }
    } catch (error) {
      console.error("Failed to reject payment:", error);
    }
  };

  const handleRefundPayment = async () => {
    if (!selectedPayment) return;

    try {
      const response = await fetch(`/api/admin/payments/${selectedPayment.id}/refund`, {
        method: "POST",
      });

      if (response.ok) {
        // Update the payment status locally
        setSelectedPayment({
          ...selectedPayment,
          status: "refunded",
        });
        // Refresh the payments list
        await fetchPayments();
      }
    } catch (error) {
      console.error("Failed to refund payment:", error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPagination({ ...pagination, page: 1 });
  };

  const formattedStats = [
    {
      title: "Total Revenue",
      value: `£${stats.totalRevenue.toLocaleString()}`,
      change: "+23.1%",
      isPositive: true,
      icon: DollarSign,
      color: "gold" as const,
    },
    {
      title: "Successful Payments",
      value: stats.paidPayments.toString(),
      change: "+12",
      isPositive: true,
      icon: CheckCircle2,
      color: "green" as const,
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments.toString(),
      change: "-3",
      isPositive: true,
      icon: Clock,
      color: "orange" as const,
    },
    {
      title: "Refunds",
      value: `£${stats.totalRefunds.toLocaleString()}`,
      change: "+2.5%",
      isPositive: false,
      icon: RefreshCw,
      color: "blue" as const,
    },
  ];

  const getPaymentStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string }> = {
      paid: { bg: "bg-green-500/20", text: "text-green-400" },
      pending: { bg: "bg-brand-orange/20", text: "text-brand-orange" },
      failed: { bg: "bg-red-500/20", text: "text-red-400" },
      refunded: { bg: "bg-purple-500/20", text: "text-purple-400" },
    };
    const style = statusMap[status] || statusMap.pending;
    return (
      <span className={cn("px-2 py-0.5 text-xs font-medium rounded", style.bg, style.text)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const columns = [
    {
      key: "transactionId",
      label: "Transaction ID",
      render: (value: unknown) => (
        <span className="font-mono text-xs text-white">{String(value)}</span>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (value: unknown) => <span className="text-luxury-gray">{String(value)}</span>,
    },
    {
      key: "track",
      label: "Track",
      render: (value: unknown) => <span className="text-white">{String(value)}</span>,
    },
    {
      key: "plan",
      label: "Plan",
      render: (value: unknown) => <span className="text-gold">{String(value)}</span>,
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: unknown) => <span className="font-medium text-white">£{String((value as number).toLocaleString())}</span>,
    },
    {
      key: "method",
      label: "Method",
      render: (value: unknown) => <span className="text-xs text-luxury-gray">{String(value)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => getPaymentStatusBadge(String(value)),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value: unknown) => {
        const date = new Date(String(value));
        return <span className="text-xs text-luxury-gray">{date.toLocaleDateString()}</span>;
      },
    },
    {
      key: "actions",
      label: "",
      render: (_: unknown, row: Payment) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-gold hover:text-brand-orange"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPayment(row);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Payments"
      subtitle="Manage payment transactions and refunds"
      actions={
        <div className="flex items-center gap-3">
          <GoldButton variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </GoldButton>
          <GoldButton size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
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
            placeholder="Search by transaction, user, or track..."
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
            data={payments}
            onRowClick={(row) => setSelectedPayment(row as Payment)}
          />
        )}
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-luxury-gray">
          Showing {payments.length} of {pagination.total} payments
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

      {/* Payment Detail Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPayment(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-luxury-dark border border-gold/20 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gold/10">
                <h3 className="text-lg font-semibold text-white">Payment Details</h3>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="p-2 text-luxury-gray hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Transaction Info */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-luxury-gray">Transaction ID</div>
                    <div className="font-mono text-white">{selectedPayment.transactionId}</div>
                  </div>
                  {getPaymentStatusBadge(selectedPayment.status)}
                </div>

                {/* Amount */}
                <div className="text-center py-6 border-y border-gold/10 mb-6">
                  <div className="text-4xl font-bold text-gold">£{selectedPayment.amount.toLocaleString()}</div>
                  <div className="text-sm text-luxury-gray mt-1">{selectedPayment.currency}</div>
                </div>

                {/* Details Grid */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-luxury-gray">User</span>
                    <span className="text-white">{selectedPayment.user}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-luxury-gray">Track</span>
                    <span className="text-white">{selectedPayment.track}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-luxury-gray">Plan</span>
                    <span className="text-gold">{selectedPayment.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-luxury-gray">Payment Method</span>
                    <span className="text-white">{selectedPayment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-luxury-gray">Date</span>
                    <span className="text-white">{new Date(selectedPayment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                {selectedPayment.status === "pending" && (
                  <div className="mt-6 flex gap-3">
                    <GoldButton
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleApprovePayment}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </GoldButton>
                    <GoldButton
                      variant="outline"
                      className="flex-1 border-red-400/50 text-red-400 hover:bg-red-400/10"
                      onClick={handleRejectPayment}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </GoldButton>
                  </div>
                )}
                {selectedPayment.status === "paid" && (
                  <div className="mt-6">
                    <GoldButton
                      variant="outline"
                      className="w-full border-red-400/50 text-red-400 hover:bg-red-400/10"
                      onClick={handleRefundPayment}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Process Refund
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
