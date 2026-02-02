"use client";

import { Button } from "@/components/ui/button";
import { Star, Shield, Users, Zap, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Review Hero</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Button asChild>
              <Link href="/api/auth/whop">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
          <Zap className="w-4 h-4" />
          Now available on WHOP
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
          Get more reviews.
          <br />
          <span className="text-primary">Stop bad ones.</span>
          <br />
          Collect referrals.
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          The review collection tool that works on autopilot. Send a request, 
          intercept negative feedback, push 5-star reviews to Google, and turn 
          happy customers into referral machines.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" asChild>
            <Link href="/api/auth/whop">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#how-it-works">See How It Works</Link>
          </Button>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Setup in 3 minutes</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20" id="how-it-works">
        <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Three simple steps to transform every happy customer into a 5-star review and warm referral.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">1. Send a Request</h3>
            <p className="text-muted-foreground">
              Enter your customer&apos;s name and email or phone. We send a beautiful, 
              personalized review request automatically.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">2. Smart Routing</h3>
            <p className="text-muted-foreground">
              Happy customers (4-5 stars) go to Google. Unhappy ones stay private 
              so you can fix issues before they go public.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">3. Collect Referrals</h3>
            <p className="text-muted-foreground">
              After leaving a review, we ask for referrals. Turn one happy 
              customer into two or three warm leads.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-primary rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to get more reviews?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of businesses using Review Hero to build their 
            reputation and grow through referrals.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/api/auth/whop">
              Start Your Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span>Review Hero</span>
          </div>
          <div>
            © {new Date().getFullYear()} Review Hero. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
