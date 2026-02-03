"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Send,
  Users,
  TrendingUp,
  Loader2,
  Check,
  ArrowRight,
  X,
  Copy,
  ExternalLink,
  Clock,
  Mail,
  Eye,
  MessageSquare,
  ChevronDown,
  Filter,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface DashboardStats {
  totalSent: number;
  totalReviewed: number;
  totalClicked: number;
  reviewsThisMonth: number;
  requestsThisMonth: number;
  conversionRate: number;
  avgRating: string;
}

interface Review {
  id: string;
  rating: number;
  text: string | null;
  clientName: string;
  clientEmail: string | null;
  postedToGoogle: boolean;
  wasIntercepted: boolean;
  createdAt: string;
}

interface Request {
  id: string;
  name: string;
  email: string | null;
  status: string;
  sentAt: string | null;
  openedAt: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

interface Activity {
  id: string;
  type: "sent" | "clicked" | "reviewed" | "created";
  clientName: string;
  timestamp: string;
}

interface SendResult {
  success: boolean;
  reviewLink?: string;
  emailSent?: boolean;
  emailError?: string;
  error?: string;
}

// ============================================
// STATUS CONFIG
// ============================================

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; icon: typeof Check }
> = {
  reviewed: {
    label: "Reviewed",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    icon: Check,
  },
  clicked: {
    label: "Opened",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    icon: Eye,
  },
  sent: {
    label: "Sent",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    icon: Mail,
  },
  pending: {
    label: "Pending",
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    icon: Clock,
  },
};

// ============================================
// HELPERS
// ============================================

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

function getPrompt() {
  const day = new Date().getDay();
  if (day === 1)
    return {
      icon: "💡",
      text: "Fresh week ahead",
      subtext: "Who's a client you helped recently?",
    };
  if (day === 5)
    return {
      icon: "📋",
      text: "Week in review",
      subtext: "Send one more before the weekend!",
    };
  if (day === 0 || day === 6)
    return {
      icon: "☕",
      text: "Quick one",
      subtext: "Even 1 review keeps momentum going",
    };
  const prompts = [
    { icon: "🎯", text: "Think of your last client", subtext: "Would they leave you a great review?" },
    { icon: "⚡", text: "Who did you help today?", subtext: "Ask while it's fresh!" },
    { icon: "📈", text: "Quick win available", subtext: "Each review = more trust" },
  ];
  return prompts[day % prompts.length];
}

// ============================================
// MAIN DASHBOARD
// ============================================

export default function DashboardPage() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string>("Your Business");
  const [loading, setLoading] = useState(true);

  // Dashboard data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // QuickSend state
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [dismissedPrompt, setDismissedPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  // Filter state
  const [filter, setFilter] = useState<string>("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const prompt = getPrompt();

  // Load account and dashboard data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get account from seed
        const seedRes = await fetch("/api/seed");
        if (!seedRes.ok) throw new Error("Failed to load account");
        const seedData = await seedRes.json();

        if (seedData.accountId) {
          setAccountId(seedData.accountId);
          setAccountName(seedData.businessName || "Your Business");

          // Load dashboard data
          const dashRes = await fetch(
            `/api/dashboard?accountId=${seedData.accountId}`
          );
          if (dashRes.ok) {
            const dashData = await dashRes.json();
            setStats(dashData.stats);
            setReviews(dashData.reviews);
            setRequests(dashData.requests);
            setActivities(dashData.activities);
          }
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Refresh dashboard after send
  const refreshDashboard = async () => {
    if (!accountId) return;
    const dashRes = await fetch(`/api/dashboard?accountId=${accountId}`);
    if (dashRes.ok) {
      const dashData = await dashRes.json();
      setStats(dashData.stats);
      setReviews(dashData.reviews);
      setRequests(dashData.requests);
      setActivities(dashData.activities);
    }
  };

  // Handle send
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !accountId) return;

    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/clients/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId, clientName, clientEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ success: false, error: data.error || "Failed to send" });
        return;
      }

      setResult({
        success: true,
        reviewLink: data.reviewLink,
        emailSent: data.emailSent,
        emailError: data.emailError,
      });

      // Refresh dashboard
      await refreshDashboard();

      // Clear form after delay
      setTimeout(() => {
        setClientName("");
        setClientEmail("");
        setResult(null);
      }, 5000);
    } catch (err) {
      console.error("Send error:", err);
      setResult({ success: false, error: "Network error" });
    } finally {
      setSending(false);
    }
  };

  const copyLink = async () => {
    if (result?.reviewLink) {
      await navigator.clipboard.writeText(result.reviewLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    if (filter === "all") return true;
    if (filter === "pending") return r.status === "pending" || r.status === "sent";
    if (filter === "opened") return r.status === "clicked" || r.openedAt;
    if (filter === "reviewed") return r.status === "reviewed";
    return true;
  });

  const filterOptions = [
    { value: "all", label: "All", count: requests.length },
    { value: "pending", label: "Pending", count: requests.filter((r) => r.status === "pending" || r.status === "sent").length },
    { value: "opened", label: "Opened", count: requests.filter((r) => r.status === "clicked" || r.openedAt).length },
    { value: "reviewed", label: "Reviewed", count: requests.filter((r) => r.status === "reviewed").length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Review Hero</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{accountName}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Send Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8"
        >
          {!dismissedPrompt && !result?.success && (
            <div className="px-6 py-4 bg-slate-50 border-b flex items-center gap-3">
              <span className="text-lg grayscale opacity-80">{prompt.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{prompt.text}</p>
                <p className="text-xs text-slate-500">{prompt.subtext}</p>
              </div>
              <button
                onClick={() => setDismissedPrompt(true)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Send className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Send Review Request</h2>
                <p className="text-sm text-slate-500">
                  Enter your customer&apos;s details to send a review link
                </p>
              </div>
            </div>

            {result?.success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 rounded-xl p-5 border border-emerald-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-900">
                      {result.emailSent ? "Request sent!" : "Link created!"}
                    </p>
                    {!result.emailSent && result.emailError && (
                      <p className="text-xs text-amber-700">
                        Email not sent: {result.emailError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={result.reviewLink || ""}
                    className="flex-1 px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm text-slate-600"
                  />
                  <button
                    onClick={copyLink}
                    className="px-4 py-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-600" />
                    )}
                    <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
                  </button>
                  <a
                    href={result.reviewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-600" />
                  </a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Smith"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="john@email.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
                {result?.error && (
                  <p className="text-sm text-red-600">{result.error}</p>
                )}
                <button
                  type="submit"
                  disabled={sending || !clientName || !clientEmail || !accountId}
                  className="w-full md:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Send Review Request
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Reviews This Month"
            value={stats?.reviewsThisMonth.toString() || "0"}
            icon={<Star className="w-5 h-5" />}
            highlight
          />
          <StatCard
            title="Requests Sent"
            value={stats?.totalSent.toString() || "0"}
            icon={<Send className="w-5 h-5" />}
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats?.conversionRate || 0}%`}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatCard
            title="Avg Rating"
            value={stats?.avgRating || "0"}
            icon={<Star className="w-5 h-5 fill-amber-400 text-amber-400" />}
          />
        </div>

        {/* Two Column Layout: Requests + Activity */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Requests List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-5 border-b flex items-center justify-between">
                <h3 className="font-semibold text-lg">Review Requests</h3>
                
                {/* Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-slate-50"
                  >
                    <Filter className="w-4 h-4" />
                    {filterOptions.find((f) => f.value === filter)?.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showFilterMenu && (
                    <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg py-1 z-10 min-w-[150px]">
                      {filterOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setFilter(opt.value);
                            setShowFilterMenu(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center justify-between ${
                            filter === opt.value ? "bg-slate-50 font-medium" : ""
                          }`}
                        >
                          {opt.label}
                          <span className="text-slate-400">{opt.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {filteredRequests.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Send className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500">No requests yet</p>
                  <p className="text-sm text-slate-400">
                    Send your first review request above
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredRequests.map((request) => {
                    const statusConfig =
                      STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;
                    const StatusIcon = statusConfig.icon;

                    return (
                      <div
                        key={request.id}
                        className="p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${statusConfig.bgColor}`}
                            >
                              <StatusIcon
                                className={`w-4 h-4 ${statusConfig.color}`}
                              />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {request.name}
                              </p>
                              <p className="text-sm text-slate-500">
                                {request.email || "No email"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                            >
                              {statusConfig.label}
                            </span>
                            <p className="text-xs text-slate-400 mt-1">
                              {formatDate(request.sentAt || request.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-5 border-b">
                <h3 className="font-semibold text-lg">Recent Activity</h3>
              </div>

              {activities.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-slate-500 text-sm">No activity yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {activities.map((activity) => (
                    <div key={activity.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            activity.type === "reviewed"
                              ? "bg-emerald-500"
                              : activity.type === "clicked"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900">
                            <span className="font-medium">
                              {activity.clientName}
                            </span>{" "}
                            {activity.type === "reviewed" && "left a review"}
                            {activity.type === "clicked" && "opened the link"}
                            {activity.type === "sent" && "was sent a request"}
                            {activity.type === "created" && "was added"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Summary */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mt-6">
                <div className="p-5 border-b">
                  <h3 className="font-semibold text-lg">Recent Reviews</h3>
                </div>
                <div className="divide-y">
                  {reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="p-4">
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-medium">{review.clientName}</p>
                      {review.text && (
                        <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                          {review.text}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================
// STAT CARD
// ============================================

function StatCard({
  title,
  value,
  icon,
  highlight,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-5 shadow-sm border ${
        highlight ? "bg-indigo-50 border-indigo-100" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={highlight ? "text-indigo-600" : "text-slate-400"}>
          {icon}
        </span>
      </div>
      <div
        className={`text-2xl font-bold mb-1 ${
          highlight ? "text-indigo-900" : "text-slate-900"
        }`}
      >
        {value}
      </div>
      <div
        className={`text-sm ${highlight ? "text-indigo-600" : "text-slate-500"}`}
      >
        {title}
      </div>
    </div>
  );
}
