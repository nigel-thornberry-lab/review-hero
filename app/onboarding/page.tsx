"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Send,
  MapPin,
  Sparkles,
  Star,
  Search,
  Building2,
} from "lucide-react";

// ============================================
// REVIEW HERO ONBOARDING - 4 STEPS
// 1. Welcome
// 2. Business Info (name + industry)
// 3. Google Business (search/connect)
// 4. First Action (send demo)
// ============================================

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Business info
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [email, setEmail] = useState("");

  // Google
  const [googleSearchQuery, setGoogleSearchQuery] = useState("");
  const [googlePlaceId, setGooglePlaceId] = useState("");
  const [googleConnected, setGoogleConnected] = useState(false);
  const [searchResults, setSearchResults] = useState<GoogleSearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  // First action
  const [demoSent, setDemoSent] = useState(false);

  // Handle business profile save
  const handleSaveProfile = async () => {
    if (!businessName.trim() || !industry) return;
    setSaving(true);
    
    try {
      const response = await fetch("/api/onboarding/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          industry,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      setStep(3);
    } catch (error) {
      console.error("Error saving profile:", error);
      // Continue anyway for now
      setStep(3);
    } finally {
      setSaving(false);
    }
  };

  // Handle Google business search
  const handleGoogleSearch = async () => {
    if (!googleSearchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);

    try {
      const response = await fetch(
        `/api/google/search?q=${encodeURIComponent(googleSearchQuery)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
      }
    } catch (error) {
      console.error("Google search error:", error);
    } finally {
      setSearching(false);
    }
  };

  // Handle selecting a Google business
  const handleSelectBusiness = async (placeId: string) => {
    setSaving(true);
    setGooglePlaceId(placeId);

    try {
      const response = await fetch("/api/onboarding/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googlePlaceId: placeId }),
      });

      if (response.ok) {
        setGoogleConnected(true);
      }
    } catch (error) {
      console.error("Error saving Google Place ID:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle sending demo
  const handleSendDemo = async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/onboarding/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setDemoSent(true);
        // Wait a moment then redirect
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error sending demo:", error);
    } finally {
      setSaving(false);
    }
  };

  // Skip to dashboard
  const handleSkipToDashboard = async () => {
    // Mark onboarding complete
    try {
      await fetch("/api/onboarding/complete", { method: "POST" });
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? "bg-primary w-6"
                  : s < step
                  ? "bg-primary w-2"
                  : "bg-slate-200 w-2"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <WelcomeStep key="welcome" onNext={() => setStep(2)} />
          )}

          {step === 2 && (
            <BusinessStep
              key="business"
              businessName={businessName}
              setBusinessName={setBusinessName}
              industry={industry}
              setIndustry={setIndustry}
              email={email}
              setEmail={setEmail}
              saving={saving}
              onNext={handleSaveProfile}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <GoogleStep
              key="google"
              businessName={businessName}
              googleSearchQuery={googleSearchQuery}
              setGoogleSearchQuery={setGoogleSearchQuery}
              googleConnected={googleConnected}
              searchResults={searchResults}
              searching={searching}
              saving={saving}
              onSearch={handleGoogleSearch}
              onSelectBusiness={handleSelectBusiness}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
              onSkip={() => setStep(4)}
            />
          )}

          {step === 4 && (
            <FirstActionStep
              key="action"
              email={email}
              demoSent={demoSent}
              saving={saving}
              onSendDemo={handleSendDemo}
              onBack={() => setStep(3)}
              onSkipToDashboard={handleSkipToDashboard}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================
// TYPES
// ============================================

interface GoogleSearchResult {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  reviewCount?: number;
}

// ============================================
// STEP 1: WELCOME
// ============================================

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <Sparkles className="w-8 h-8 text-primary" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-slate-900 mb-3"
      >
        Welcome to Review Hero
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-slate-600 mb-8 max-w-sm mx-auto"
      >
        Let's get you set up in under 3 minutes. You'll be collecting 5-star
        reviews before you know it.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 text-left"
      >
        <p className="text-sm font-medium text-slate-900 mb-4">
          Here's what we'll do:
        </p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-sm text-slate-600">
            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>Set up your business profile</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-600">
            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>Connect your Google Business</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-600">
            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>Send your first review request</span>
          </li>
        </ul>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={onNext}
        className="w-full py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        Let's go
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}

// ============================================
// STEP 2: BUSINESS INFO
// ============================================

const INDUSTRY_OPTIONS = [
  { value: "fitness-coach", label: "Fitness Coach / Personal Trainer", icon: "💪" },
  { value: "gym", label: "Gym / Fitness Center", icon: "🏋️" },
  { value: "yoga-studio", label: "Yoga Studio", icon: "🧘" },
  { value: "chiropractor", label: "Chiropractor", icon: "🦴" },
  { value: "massage-therapist", label: "Massage Therapist", icon: "💆" },
  { value: "nutritionist", label: "Nutritionist / Dietitian", icon: "🥗" },
  { value: "plumber", label: "Plumber", icon: "🔧" },
  { value: "electrician", label: "Electrician", icon: "⚡" },
  { value: "hvac", label: "HVAC Technician", icon: "❄️" },
  { value: "landscaper", label: "Landscaper / Gardener", icon: "🌳" },
  { value: "cleaner", label: "House Cleaner", icon: "🧹" },
  { value: "handyman", label: "Handyman", icon: "🔨" },
  { value: "accountant", label: "Accountant / CPA", icon: "📊" },
  { value: "lawyer", label: "Lawyer / Attorney", icon: "⚖️" },
  { value: "consultant", label: "Business Consultant", icon: "💼" },
  { value: "photographer", label: "Photographer", icon: "📷" },
  { value: "restaurant", label: "Restaurant", icon: "🍽️" },
  { value: "cafe", label: "Cafe / Coffee Shop", icon: "☕" },
  { value: "mechanic", label: "Auto Mechanic", icon: "🔧" },
  { value: "other", label: "Other", icon: "⭐" },
];

function BusinessStep({
  businessName,
  setBusinessName,
  industry,
  setIndustry,
  email,
  setEmail,
  saving,
  onNext,
  onBack,
}: {
  businessName: string;
  setBusinessName: (v: string) => void;
  industry: string;
  setIndustry: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  saving: boolean;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl border border-slate-200 p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Your business</h1>
          <p className="text-sm text-slate-500">Tell us about yourself</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">
            Business name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Joe's Fitness Studio"
            className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">
            Your email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="joe@fitness.com"
            className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">
            Industry <span className="text-red-500">*</span>
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select your industry...</option>
            {INDUSTRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.icon} {opt.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-1.5">
            This helps us personalize your review request messages
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="py-3 px-4 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onNext}
          disabled={saving || !businessName.trim() || !industry || !email.trim()}
          className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ============================================
// STEP 3: GOOGLE BUSINESS
// ============================================

function GoogleStep({
  businessName,
  googleSearchQuery,
  setGoogleSearchQuery,
  googleConnected,
  searchResults,
  searching,
  saving,
  onSearch,
  onSelectBusiness,
  onNext,
  onBack,
  onSkip,
}: {
  businessName: string;
  googleSearchQuery: string;
  setGoogleSearchQuery: (v: string) => void;
  googleConnected: boolean;
  searchResults: GoogleSearchResult[];
  searching: boolean;
  saving: boolean;
  onSearch: () => void;
  onSelectBusiness: (placeId: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  // Success state
  if (googleConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white rounded-2xl border border-slate-200 p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Google connected!
        </h2>
        <p className="text-slate-600 mb-6">
          Your 5-star reviews will be directed to your Google Business profile.
        </p>
        <button
          onClick={onNext}
          className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl border border-slate-200 p-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Connect Google Business
          </h1>
          <p className="text-sm text-slate-500">
            Route 5-star reviews to Google
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-6">
        Search for your business below and we'll connect it automatically.
        This is how your happy customers will leave public reviews.
      </p>

      {/* Search input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-900 mb-1">
          Search for your business
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={googleSearchQuery}
            onChange={(e) => setGoogleSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder={businessName || "Your business name + city"}
            className="flex-1 px-4 py-3 bg-slate-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={onSearch}
            disabled={searching || !googleSearchQuery.trim()}
            className="px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {searching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="space-y-2 mb-6">
          <p className="text-xs text-slate-500 mb-2">Select your business:</p>
          {searchResults.map((result) => (
            <button
              key={result.placeId}
              onClick={() => onSelectBusiness(result.placeId)}
              disabled={saving}
              className="w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-left transition-colors disabled:opacity-50"
            >
              <p className="font-medium text-slate-900">{result.name}</p>
              <p className="text-sm text-slate-500">{result.address}</p>
              {result.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs text-slate-600">
                    {result.rating} ({result.reviewCount} reviews)
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {searchResults.length === 0 && googleSearchQuery && !searching && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800">
            No results found. Try adding your city, or{" "}
            <button onClick={onSkip} className="underline font-medium">
              skip for now
            </button>{" "}
            and we'll help you set it up later.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="py-3 px-4 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onSkip}
          className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  );
}

// ============================================
// STEP 4: FIRST ACTION
// ============================================

function FirstActionStep({
  email,
  demoSent,
  saving,
  onSendDemo,
  onBack,
  onSkipToDashboard,
}: {
  email: string;
  demoSent: boolean;
  saving: boolean;
  onSendDemo: () => void;
  onBack: () => void;
  onSkipToDashboard: () => void;
}) {
  // Success state
  if (demoSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-slate-200 p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Demo sent!</h2>
        <p className="text-slate-600 mb-4">
          Check your inbox at <strong>{email}</strong>
        </p>
        <p className="text-sm text-slate-500">Redirecting to your dashboard...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl border border-slate-200 p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Send className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Try it yourself</h1>
          <p className="text-sm text-slate-500">See what your customers see</p>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-6">
        We'll send a demo review request to your email so you can experience the
        full flow your customers will go through.
      </p>

      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <p className="text-sm text-slate-600">
          Demo will be sent to: <strong className="text-slate-900">{email}</strong>
        </p>
      </div>

      <button
        onClick={onSendDemo}
        disabled={saving}
        className="w-full py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send me a demo
          </>
        )}
      </button>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onSkipToDashboard}
          className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          Skip to dashboard
        </button>
      </div>
    </motion.div>
  );
}
