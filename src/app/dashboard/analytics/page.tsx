"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Music,
  BarChart3,
  Play,
  Globe,
  Headphones,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { UserLayout, UserStatCard } from "@/components/user/UserLayout";
import { GlowCard } from "@/components/shared";
import { cn } from "@/lib/utils";

export default function UserAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6m");
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Try localStorage first, then session API fallback
        let userId: string | null = null;
        let userProfile: any = null;
        const stored = localStorage.getItem("user");
        if (stored) {
          userProfile = JSON.parse(stored);
          userId = userProfile?.id;
        }
        if (!userId) {
          const sessionRes = await fetch("/api/auth/session");
          if (sessionRes.ok) {
            const { user } = await sessionRes.json();
            userId = user?.id;
            userProfile = user;
          }
        }
        if (!userId) { setLoading(false); return; }

        setUserProfile(userProfile);

        const [subRes, payRes] = await Promise.all([
          fetch(`/api/submissions?userId=${userId}`),
          fetch(`/api/payments?userId=${userId}`),
        ]);

        const subData = await subRes.json();
        const payData = payRes.ok ? await payRes.json() : {};

        setSubmissions(subData.submissions || []);
        setPayments(payData.payments || []);
      } catch (e) {
        console.error("Analytics fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <UserLayout title="Analytics" subtitle="Track your music performance and growth" user={userProfile}>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-gold animate-spin" />
        </div>
      </UserLayout>
    );
  }

  // ─── Derived stats ─────────────────────────────────────────────────────────
  const totalSubmissions = submissions.length;
  const active  = submissions.filter(s => s.status === "active").length;
  const pending = submissions.filter(s => s.status === "pending").length;
  const completed = submissions.filter(s => s.status === "completed").length;
  const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const spotifyCount  = submissions.filter(s => s.spotify_url).length;
  const youtubeCount  = submissions.filter(s => s.youtube_url).length;
  const totalPlatform = spotifyCount + youtubeCount || 1;
  const spotifyPct    = Math.round((spotifyCount  / totalPlatform) * 100);
  const youtubePct    = Math.round((youtubeCount  / totalPlatform) * 100);

  // Monthly submission activity (last 6 months)
  const now = new Date();
  const months: { label: string; count: number; spent: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("default", { month: "short" });
    const monthSubs = submissions.filter(s => {
      const created = new Date(s.created_at);
      return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
    });
    const monthPay = payments.filter(p => {
      const created = new Date(p.created_at);
      return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
    });
    months.push({
      label,
      count: monthSubs.length,
      spent: monthPay.reduce((s, p) => s + (p.amount || 0), 0),
    });
  }
  const maxCount = Math.max(...months.map(m => m.count), 1);

  // Status breakdown for donut
  const statusBreakdown = [
    { label: "Active",    value: active,    color: "#F59E0B" },
    { label: "Pending",   value: pending,   color: "#F97316" },
    { label: "Completed", value: completed, color: "#10B981" },
  ].filter(s => s.value > 0);
  const totalForDonut = totalSubmissions || 1;

  // Build donut segments
  let cumulativePct = 0;
  const circumference = 2 * Math.PI * 60;
  const segments = statusBreakdown.map(s => {
    const pct = s.value / totalForDonut;
    const offset = -cumulativePct * circumference;
    cumulativePct += pct;
    return { ...s, pct, dashArray: pct * circumference, offset };
  });

  const statCards = [
    { title: "Total Submissions", value: totalSubmissions.toString(), change: "All time", icon: Music,      color: "gold"   as const },
    { title: "Active Campaigns",  value: active.toString(),           change: "Running",  icon: Play,       color: "orange" as const },
    { title: "Completed",         value: completed.toString(),        change: "Finished", icon: CheckCircle2, color: "green" as const },
    { title: "Total Spent",       value: `£${totalSpent.toFixed(2)}`, change: "All time", icon: TrendingUp, color: "blue"   as const },
  ];

  return (
    <UserLayout
      title="Analytics"
      subtitle="Track your music performance and growth"
      user={userProfile}
      actions={
        <div className="flex items-center gap-2">
          {["3m", "6m", "1y", "all"].map((range) => (
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
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <UserStatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly activity bar chart */}
        <GlowCard variant="premium" className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gold" />
              Monthly Submissions
            </h3>
          </div>

          {totalSubmissions === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-luxury-gray gap-3">
              <AlertCircle className="w-10 h-10 text-gold/40" />
              <p className="text-sm">No submission data yet. Submit your first track!</p>
            </div>
          ) : (
            <div className="flex items-end justify-between h-48 gap-3 pt-6">
              {months.map((m, i) => (
                <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative" style={{ height: `${(m.count / maxCount) * 100}%`, minHeight: m.count > 0 ? "8px" : "0" }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="absolute bottom-0 w-full bg-gradient-to-t from-gold to-gold/50 rounded-t"
                    />
                    {m.count > 0 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white font-medium whitespace-nowrap">
                        {m.count}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-luxury-gray">{m.label}</span>
                </div>
              ))}
            </div>
          )}
        </GlowCard>

        {/* Status donut */}
        <GlowCard variant="default" className="p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Submission Status</h3>

          <div className="relative w-40 h-40 mx-auto mb-6">
            {totalSubmissions === 0 ? (
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="60" fill="none" stroke="#1f1f1f" strokeWidth="20" />
              </svg>
            ) : (
              <svg className="w-full h-full transform -rotate-90">
                {segments.map((seg, i) => (
                  <circle
                    key={i}
                    cx="80" cy="80" r="60"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="20"
                    strokeDasharray={`${seg.dashArray} ${circumference}`}
                    strokeDashoffset={seg.offset}
                  />
                ))}
              </svg>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{totalSubmissions}</div>
                <div className="text-xs text-luxury-gray">Total</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {statusBreakdown.length > 0 ? statusBreakdown.map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: s.color }} />
                  <span className="text-sm text-white">{s.label}</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {s.value} <span className="text-luxury-gray text-xs">({Math.round((s.value/totalForDonut)*100)}%)</span>
                </span>
              </div>
            )) : (
              <p className="text-sm text-luxury-gray text-center">No submissions yet</p>
            )}
          </div>
        </GlowCard>
      </div>

      {/* Secondary row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Top tracks table */}
        <GlowCard variant="premium" className="p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Music className="w-5 h-5 text-gold" />
            Your Submissions
          </h3>
          {submissions.length === 0 ? (
            <div className="py-12 text-center text-luxury-gray text-sm">No tracks submitted yet.</div>
          ) : (
            <div className="space-y-4">
              {submissions.slice(0, 6).map((sub, i) => (
                <div key={sub.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-gold/20 flex items-center justify-center text-xs font-medium text-gold">
                        {i + 1}
                      </div>
                      <div>
                        <span className="text-white font-medium text-sm block truncate max-w-[140px]">
                          {sub.track_title || "Unknown Track"}
                        </span>
                        <span className="text-xs text-luxury-gray">{sub.artist_name || ""}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded font-medium",
                        sub.status === "active"    ? "bg-gold/20 text-gold" :
                        sub.status === "completed" ? "bg-green-500/20 text-green-400" :
                                                     "bg-brand-orange/20 text-brand-orange"
                      )}>
                        {sub.status?.charAt(0).toUpperCase() + sub.status?.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-luxury-lighter rounded-full overflow-hidden ml-9">
                    <div
                      className="h-full bg-gold rounded-full"
                      style={{ width: sub.status === "completed" ? "100%" : sub.status === "active" ? "55%" : "10%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlowCard>

        {/* Platform + Spending */}
        <div className="space-y-6">
          {/* Platform breakdown */}
          <GlowCard variant="default" className="p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gold" />
              Platform Breakdown
            </h3>
            {totalSubmissions === 0 ? (
              <p className="text-sm text-luxury-gray">No submission data yet.</p>
            ) : (
              <div className="space-y-4">
                {[
                  { name: "Spotify",  pct: spotifyPct,  count: spotifyCount,  color: "#1DB954" },
                  { name: "YouTube",  pct: youtubePct,  count: youtubeCount,  color: "#FF0000" },
                ].map(p => (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: p.color }} />
                        <span className="text-sm text-white">{p.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gold">{p.pct}% <span className="text-luxury-gray text-xs">({p.count} tracks)</span></span>
                    </div>
                    <div className="h-2 bg-luxury-lighter rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.pct}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlowCard>

          {/* Monthly spending */}
          <GlowCard variant="default" className="p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Headphones className="w-5 h-5 text-gold" />
              Monthly Spend
            </h3>
            <div className="space-y-2">
              {months.filter(m => m.spent > 0).length === 0 ? (
                <p className="text-sm text-luxury-gray">No payment records yet.</p>
              ) : (
                months.filter(m => m.spent > 0).map(m => (
                  <div key={m.label} className="flex items-center justify-between py-1.5 border-b border-gold/5">
                    <span className="text-sm text-white">{m.label}</span>
                    <span className="text-sm font-medium text-gold">£{m.spent.toFixed(2)}</span>
                  </div>
                ))
              )}
              {totalSpent > 0 && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-bold text-white">Total</span>
                  <span className="text-sm font-bold text-gold">£{totalSpent.toFixed(2)}</span>
                </div>
              )}
            </div>
          </GlowCard>
        </div>
      </div>

      {/* Recent submissions table */}
      <GlowCard variant="default" className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold" />
            Submission History
          </h3>
          <span className="text-sm text-luxury-gray">{submissions.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/10">
                <th className="text-left py-3 px-3 text-xs font-medium text-luxury-gray uppercase tracking-wider">Track</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-luxury-gray uppercase tracking-wider">Plan</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-luxury-gray uppercase tracking-wider">Submitted</th>
                <th className="text-right py-3 px-3 text-xs font-medium text-luxury-gray uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-luxury-gray text-sm">
                    No submissions yet. <a href="/dashboard/submit" className="text-gold hover:underline">Submit your first track →</a>
                  </td>
                </tr>
              ) : (
                submissions.map((sub, i) => (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-gold/5 hover:bg-luxury-lighter/30"
                  >
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-medium text-white text-sm">{sub.track_title || "Unknown Track"}</span>
                        <p className="text-xs text-luxury-gray">{sub.artist_name || ""}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gold text-sm">{sub.plan?.name || "—"}</td>
                    <td className="py-3 px-3 text-luxury-gray text-sm">
                      {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={cn(
                        "px-2 py-0.5 text-xs font-medium rounded",
                        sub.status === "active"    ? "bg-gold/20 text-gold" :
                        sub.status === "completed" ? "bg-green-500/20 text-green-400" :
                                                     "bg-brand-orange/20 text-brand-orange"
                      )}>
                        {sub.status?.charAt(0).toUpperCase() + sub.status?.slice(1) || "Pending"}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlowCard>
    </UserLayout>
  );
}
