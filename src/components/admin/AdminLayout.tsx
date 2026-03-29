"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  TrendingUp,
  Users,
  DollarSign,
  ChevronRight,
  ExternalLink,
  Bell,
  BarChart3,
  Package,
  CreditCard,
  Activity,
  Settings,
  Search,
  Menu,
  X,
  LogOut,
  Home,
  FileText,
  MessageSquare,
  Megaphone,
} from "lucide-react";
import { GoldButton } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Submissions", href: "/admin/submissions", icon: Music, badge: "12" },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Plans", href: "/admin/plans", icon: Package },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Content", href: "/admin/content", icon: FileText },
  { name: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-luxury-black flex">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-luxury-dark border-r border-gold/10 transform transition-transform duration-300 lg:transform-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gold/10">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                <Music className="w-4 h-4 text-luxury-black" />
              </div>
              <span className="text-lg font-bold text-white">
                PlugTo<span className="text-gold">Playlist</span>
              </span>
            </Link>
            <div className="mt-2 px-2 py-1 bg-brand-orange/20 text-brand-orange text-xs font-medium rounded inline-block">
              ADMIN PANEL
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm",
                    isActive
                      ? "bg-gold/10 text-gold border-l-2 border-gold"
                      : "text-luxury-gray hover:text-white hover:bg-luxury-lighter"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-brand-orange text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gold/10 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-luxury-gray hover:text-white hover:bg-luxury-lighter transition-all text-sm"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Site</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all text-sm"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-luxury-black/80 backdrop-blur-lg border-b border-gold/10">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-luxury-gray hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white">{title}</h1>
                {subtitle && <p className="text-xs text-luxury-gray">{subtitle}</p>}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gray" />
                <Input
                  placeholder="Search..."
                  className="bg-luxury-lighter border-gold/20 focus:border-gold h-9 pl-9 w-48 lg:w-64 text-sm text-white placeholder:text-luxury-gray"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-luxury-gray hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-orange rounded-full" />
              </button>

              {/* Admin Avatar */}
              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                <span className="text-sm font-medium text-gold">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Actions */}
            {actions && (
              <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                {actions}
              </div>
            )}
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gold/10 py-4 px-6">
          <div className="flex items-center justify-between text-xs text-luxury-gray">
            <span>© 2024 PlugToPlaylist. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-gold">Terms</Link>
              <Link href="/privacy" className="hover:text-gold">Privacy</Link>
              <Link href="/contact" className="hover:text-gold">Support</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ElementType;
  color?: "gold" | "orange" | "green" | "blue";
}

export function StatCard({ title, value, change, isPositive = true, icon: Icon, color = "gold" }: StatCardProps) {
  const colors = {
    gold: "bg-gold/20 text-gold",
    orange: "bg-brand-orange/20 text-brand-orange",
    green: "bg-green-500/20 text-green-400",
    blue: "bg-blue-500/20 text-blue-400",
  };

  return (
    <div className="bg-luxury-dark border border-gold/10 rounded-xl p-5 hover:border-gold/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span className={cn("text-xs", isPositive ? "text-green-400" : "text-red-400")}>
            {isPositive ? "+" : ""}{change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-luxury-gray">{title}</div>
    </div>
  );
}

// Table Components
interface TableColumn {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode;
  className?: string;
}

interface DataTableProps {
  columns: TableColumn[];
  data: Record<string, unknown>[];
  onRowClick?: (row: Record<string, unknown>) => void;
}

export function DataTable({ columns, data, onRowClick }: DataTableProps) {
  return (
    <div className="bg-luxury-dark border border-gold/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left py-3 px-4 text-xs font-medium text-luxury-gray uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-gold/5 hover:bg-luxury-lighter/30 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("py-3 px-4 text-sm", col.className)}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gold" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-luxury-gray max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

// Filter Badge Component
interface FilterBadgeProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function FilterBadge({ label, active, onClick }: FilterBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
        active
          ? "bg-gold text-luxury-black"
          : "bg-luxury-lighter text-luxury-gray hover:text-white"
      )}
    >
      {label}
    </button>
  );
}
