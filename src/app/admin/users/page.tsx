"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Download,
  MoreVertical,
  Mail,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  User,
  Shield,
  Ban,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Plus,
  Filter,
} from "lucide-react";
import { AdminLayout, StatCard, DataTable, FilterBadge } from "@/components/admin/AdminLayout";
import { GoldButton, StatusBadge } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
  { title: "Total Users", value: "2,847", change: "+12.5%", icon: Users, color: "gold" as const },
  { title: "Active Users", value: "1,923", change: "+8.2%", icon: CheckCircle2, color: "green" as const },
  { title: "Premium Users", value: "342", change: "+15", icon: Shield, color: "orange" as const },
  { title: "Total Revenue", value: "$89,450", change: "+23.1%", icon: DollarSign, color: "blue" as const },
];

const mockUsers = [
  {
    id: "user_1",
    name: "Alex Rivera",
    email: "alex@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    role: "user",
    status: "active",
    submissions: 12,
    spent: 747,
    joinedAt: "2023-06-15",
    lastActive: "2024-01-21",
  },
  {
    id: "user_2",
    name: "Maya Thompson",
    email: "maya@email.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    role: "premium",
    status: "active",
    submissions: 28,
    spent: 2847,
    joinedAt: "2023-04-20",
    lastActive: "2024-01-20",
  },
  {
    id: "user_3",
    name: "Jordan Blake",
    email: "jordan@email.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    role: "user",
    status: "inactive",
    submissions: 5,
    spent: 245,
    joinedAt: "2023-08-10",
    lastActive: "2024-01-15",
  },
  {
    id: "user_4",
    name: "Nina Santos",
    email: "nina@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
    role: "premium",
    status: "active",
    submissions: 45,
    spent: 5230,
    joinedAt: "2023-02-28",
    lastActive: "2024-01-21",
  },
  {
    id: "user_5",
    name: "Marcus Chen",
    email: "marcus@email.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    role: "user",
    status: "suspended",
    submissions: 3,
    spent: 147,
    joinedAt: "2023-10-05",
    lastActive: "2024-01-10",
  },
  {
    id: "user_6",
    name: "Sophie Williams",
    email: "sophie@email.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    role: "admin",
    status: "active",
    submissions: 0,
    spent: 0,
    joinedAt: "2023-01-01",
    lastActive: "2024-01-21",
  },
];

const roleFilters = [
  { label: "All", value: "all" },
  { label: "Users", value: "user" },
  { label: "Premium", value: "premium" },
  { label: "Admin", value: "admin" },
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded">Admin</span>;
      case "premium":
        return <span className="px-2 py-0.5 text-xs font-medium bg-gold/20 text-gold rounded">Premium</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-medium bg-luxury-lighter text-luxury-gray rounded">User</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 rounded">Active</span>;
      case "inactive":
        return <span className="px-2 py-0.5 text-xs font-medium bg-luxury-lighter text-luxury-gray rounded">Inactive</span>;
      case "suspended":
        return <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded">Suspended</span>;
      default:
        return null;
    }
  };

  const columns = [
    {
      key: "user",
      label: "User",
      render: (_: unknown, row: typeof mockUsers[0]) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="font-medium text-white">{row.name}</div>
            <div className="text-xs text-luxury-gray">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (value: unknown) => getRoleBadge(String(value)),
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => getStatusBadge(String(value)),
    },
    {
      key: "submissions",
      label: "Submissions",
      render: (value: unknown) => <span className="text-white">{String(value)}</span>,
    },
    {
      key: "spent",
      label: "Total Spent",
      render: (value: unknown) => <span className="text-gold font-medium">${String(value)}</span>,
    },
    {
      key: "joinedAt",
      label: "Joined",
      render: (value: unknown) => <span className="text-luxury-gray text-xs">{String(value)}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (_: unknown, row: typeof mockUsers[0]) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-gold hover:text-brand-orange"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(row);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-luxury-gray hover:text-white">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Users"
      subtitle="Manage user accounts and permissions"
      actions={
        <div className="flex items-center gap-3">
          <GoldButton variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </GoldButton>
          <GoldButton size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add User
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
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-luxury-dark border-gold/20 focus:border-gold h-10 pl-10 text-white placeholder:text-luxury-gray"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {roleFilters.map((filter) => (
            <FilterBadge
              key={filter.value}
              label={filter.label}
              active={roleFilter === filter.value}
              onClick={() => setRoleFilter(filter.value)}
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
          data={filteredUsers}
          onRowClick={(row) => setSelectedUser(row as typeof mockUsers[0])}
        />
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-luxury-gray">
          Showing {filteredUsers.length} of {mockUsers.length} users
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-gold/20 text-luxury-gray hover:text-white">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-white">1 of 50</span>
          <Button variant="outline" size="sm" className="border-gold/20 text-luxury-gray hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedUser(null)}
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
                <h3 className="text-lg font-semibold text-white">User Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 text-luxury-gray hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* User Info */}
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gold/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-semibold text-white">{selectedUser.name}</h4>
                      {getRoleBadge(selectedUser.role)}
                    </div>
                    <p className="text-luxury-gray">{selectedUser.email}</p>
                    <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-luxury-black/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{selectedUser.submissions}</div>
                    <div className="text-xs text-luxury-gray">Submissions</div>
                  </div>
                  <div className="bg-luxury-black/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-gold">${selectedUser.spent}</div>
                    <div className="text-xs text-luxury-gray">Total Spent</div>
                  </div>
                  <div className="bg-luxury-black/50 rounded-lg p-3 text-center">
                    <div className="text-sm font-medium text-white">{selectedUser.joinedAt}</div>
                    <div className="text-xs text-luxury-gray">Joined</div>
                  </div>
                  <div className="bg-luxury-black/50 rounded-lg p-3 text-center">
                    <div className="text-sm font-medium text-white">{selectedUser.lastActive}</div>
                    <div className="text-xs text-luxury-gray">Last Active</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <GoldButton className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit User
                  </GoldButton>
                  {selectedUser.status === "active" ? (
                    <GoldButton variant="outline" className="flex-1 border-red-400/50 text-red-400 hover:bg-red-400/10">
                      <Ban className="w-4 h-4 mr-2" />
                      Suspend
                    </GoldButton>
                  ) : (
                    <GoldButton variant="outline" className="flex-1 border-green-400/50 text-green-400 hover:bg-green-400/10">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Activate
                    </GoldButton>
                  )}
                  <GoldButton variant="ghost" className="text-red-400 hover:bg-red-400/10">
                    <Trash2 className="w-4 h-4" />
                  </GoldButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
