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
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface SendResult {
  success: boolean;
  reviewLink?: string;
  emailSent?: boolean;
  emailError?: string;
  error?: string;
}

// ============================================
// TIME-BASED PROMPTS (from Refer)
// ============================================

function getPrompt() {
  const day = new Date().getDay();

  // Monday - fresh start energy
  if (day === 1) {
    return {
      icon: "💡",
      text: "Fresh week ahead",
      subtext:
        "Who's a client you helped recently that would gladly leave a review?",
    };
  }

  // Friday - wrap up the week
  if (day === 5) {
    return {
      icon: "📋",
      text: "Week in review",
      subtext: "Before the weekend, who else deserves a thank-you link?",
    };
  }

  // Weekend - lighter touch
  if (day === 0 || day === 6) {
    return {
      icon: "☕",
      text: "Quick one",
      subtext: "Even 1 review this weekend keeps momentum going",
    };
  }

  // Midweek - mix of prompts
  const midweekPrompts = [
    {
      icon: "🎯",
      text: "Think of your last 3 clients",
      subtext: "Which one would leave you a great review?",
    },
    {
      icon: "⚡",
      text: "Who did you help today?",
      subtext: "The best time to ask is right after you've helped them",
    },
    {
      icon: "📈",
      text: "Quick win available",
      subtext: "Each review is worth ~$200 in new business",
    },
  ];

  return midweekPrompts[day % midweekPrompts.length];
}

// ============================================
// MAIN DASHBOARD
// ============================================

export default function DashboardPage() {
  // For MVP, we'll use a hardcoded account ID from the seed data
  // In production, this would come from session/auth
  const [accountId, setAccountId] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string>("Your Business");

  // QuickSend state
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [dismissedPrompt, setDismissedPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  const prompt = getPrompt();

  // Load account on mount (from seed data for now)
  useEffect(() => {
    const loadAccount = async () => {
      try {
        // For MVP: fetch the first account from seed
        const res = await fetch("/api/seed");
        if (res.ok) {
          const data = await res.json();
          if (data.accountId) {
            setAccountId(data.accountId);
            setAccountName(data.businessName || "Your Business");
          }
        }
      } catch (err) {
        console.error("Failed to load account:", err);
      }
    };
    loadAccount();
  }, []);

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
        body: JSON.stringify({
          accountId,
          clientName,
          clientEmail,
        }),
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

  // Copy link to clipboard
  const copyLink = async () => {
    if (result?.reviewLink) {
      await navigator.clipboard.writeText(result.reviewLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
          {/* Suggestion prompt - dismissable */}
          {!dismissedPrompt && !result?.success && (
            <div className="px-6 py-4 bg-slate-50 border-b flex items-center gap-3">
              <span className="text-lg grayscale opacity-80">{prompt.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {prompt.text}
                </p>
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

            {/* Success State */}
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
                      {result.emailSent
                        ? "Request sent!"
                        : "Link created!"}
                    </p>
                    {!result.emailSent && result.emailError && (
                      <p className="text-xs text-amber-700">
                        Email not sent: {result.emailError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Review Link */}
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
                    <span className="text-sm">
                      {copied ? "Copied!" : "Copy"}
                    </span>
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
              /* Form */
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
            value="0"
            icon={<Star className="w-5 h-5" />}
          />
          <StatCard
            title="Requests Sent"
            value="0"
            icon={<Send className="w-5 h-5" />}
          />
          <StatCard
            title="Referrals Collected"
            value="0"
            icon={<Users className="w-5 h-5" />}
          />
          <StatCard
            title="Conversion Rate"
            value="0%"
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl p-12 shadow-sm border text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">
            No reviews collected yet
          </h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Send your first review request above to start collecting 5-star
            reviews from your happy customers.
          </p>
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
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400">{icon}</span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-slate-500">{title}</div>
    </div>
  );
}
