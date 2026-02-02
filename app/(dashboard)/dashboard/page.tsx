"use client";

import { Button } from "@/components/ui/button";
import { Star, Send, Users, TrendingUp, Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Review Hero</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome back!
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Send Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-lg">Send Review Request</h2>
              <p className="text-sm text-muted-foreground">
                Enter your customer&apos;s details to send a review request
              </p>
            </div>
            <Send className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Customer Name
              </label>
              <input
                type="text"
                placeholder="John Smith"
                className="w-full px-4 py-2.5 bg-slate-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Email or Phone
              </label>
              <input
                type="text"
                placeholder="john@email.com or +1 555 123 4567"
                className="w-full px-4 py-2.5 bg-slate-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Send Request
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Reviews This Month"
            value="0"
            icon={<Star className="w-5 h-5" />}
            trend="+0%"
          />
          <StatCard
            title="Requests Sent"
            value="0"
            icon={<Send className="w-5 h-5" />}
            trend="+0%"
          />
          <StatCard
            title="Referrals Collected"
            value="0"
            icon={<Users className="w-5 h-5" />}
            trend="+0%"
          />
          <StatCard
            title="Conversion Rate"
            value="0%"
            icon={<TrendingUp className="w-5 h-5" />}
            trend="+0%"
          />
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl p-12 shadow-sm border text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">
            No reviews collected yet
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Send your first review request to start collecting 5-star reviews
            and referrals from your happy customers.
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Send Your First Request
          </Button>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs text-green-600 font-medium">{trend}</span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
}
