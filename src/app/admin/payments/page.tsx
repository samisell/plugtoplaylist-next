"use client";

import { useState } from "react";
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
} from "lucide-react";
import { AdminLayout, StatCard, DataTable, FilterBadge } from "@/components/admin/AdminLayout";
import { GoldButton, StatusBadge } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
  { title: "Total Revenue", value: "$24,850", change: "+23.1%", isPositive: true, icon: DollarSign, color: "gold" as const },
  { title: "Successful Payments", value: "156", change: "+12", isPositive: true, icon: CheckCircle2, color: "green" as const },
  { title: "Pending Payments", value: "8", change: "-3", isPositive: true, icon: Clock, color: "orange" as const },
  { title: "Refunds", value: "$420", change: "+2.5%", isPositive: false, icon: RefreshCw, color: "blue" as const },
];

const mockPayments = [
  {
    id: "pay_1",
    transactionId: "TXN-2024012101",
    user: "alex@email.com",
    amount: 149,
    currency: "USD",
    status: "paid",
    method: "Paystack",
    plan: "Premium",
    track: "Blinding Lights",
    createdAt: "2024-01-21 14:32:00",
  },
  {
    id: "pay_2",
    transactionId: "TXN-2024012002",
    user: "maya@email.com",
    amount: 349,
    currency: "USD",
    status: "paid",
    method: "Flutterwave",
    plan: "Professional",
    track: "Shape of You",
    createdAt: "2024-01-20 10:15:00",
  },
  {
    id: "pay_3",
    transactionId: "TXN-2024011903",
    user: "jordan@email.com",
    amount: 49,
    currency: "USD",
    status: "pending",
    method: "Paystack",
    plan: "Starter",
    track: "Levitating",
    createdAt: "2024-01-19 16:45:00",
  },
  {
    id: "pay_4",
    transactionId: "TXN-2024011804",
    user: "nina@email.com",
    amount: 149,
    currency: "USD",
    status: "failed",
    method: "Flutterwave",
    plan: "Premium",
    track: "Stay",
    createdAt: "2024-01-18 09:20:00",
  },
  {
    id: "pay_5",
    transactionId: "TXN-2024011705",
    user: "marcus@email.com",
    amount: 349,
    currency: "USD",
    status: "refunded",
    method: "Paystack",
    plan: "Professional",
    track: "Peaches",
    createdAt: "2024-01-17 11:30:00",
  },
  {
    id: "pay_6",
    transactionId: "TXN-2024011606",
    user: "sophie@email.com",
    amount: 49,
    currency: "USD",
    status: "paid",
    method: "Paystack",
    plan: "Starter",
    track: "Good 4 U",
    createdAt: "2024-01-16 14:00:00",
  },
];

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
  const [selectedPayment, setSelectedPayment] = useState<typeof mockPayments[0] | null>(null);

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.track.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      render: (value: unknown) => <span className="font-medium text-white">${String(value)}</span>,
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
      render: (value: unknown) => <span className="text-xs text-luxury-gray">{String(value)}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (_: unknown, row: typeof mockPayments[0]) => (
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
            placeholder="Search by transaction, user, or track..."
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
          data={filteredPayments}
          onRowClick={(row) => setSelectedPayment(row as typeof mockPayments[0])}
        />
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-luxury-gray">
          Showing {filteredPayments.length} of {mockPayments.length} payments
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
                  <div className="text-4xl font-bold text-gold">${selectedPayment.amount}</div>
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
                    <span className="text-white">{selectedPayment.createdAt}</span>
                  </div>
                </div>

                {/* Actions */}
                {selectedPayment.status === "paid" && (
                  <div className="mt-6">
                    <GoldButton variant="outline" className="w-full border-red-400/50 text-red-400 hover:bg-red-400/10">
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
