"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Loader2,
  MessageSquare,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface ClientData {
  id: string;
  name: string;
  email: string | null;
  token: string;
  account: {
    id: string;
    businessName: string;
    googlePlaceId: string | null;
    primaryColor: string;
    logoUrl: string | null;
  };
  template: {
    celebrationHeadline: string;
    celebrationBody: string;
    reviewAsk: string;
    googleHeadline: string;
    googleSubhead: string;
  } | null;
}

type Step = "loading" | "rating" | "google" | "private-feedback" | "complete" | "error";

// ============================================
// DEFAULT TEMPLATE (fallback)
// ============================================

const DEFAULT_TEMPLATE = {
  celebrationHeadline: "Thanks for being a customer!",
  celebrationBody: "We appreciate your business and would love to hear about your experience.",
  reviewAsk: "Your honest feedback helps others make great decisions.",
  googleHeadline: "You're amazing!",
  googleSubhead: "Help others discover great service.",
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function ReviewPage() {
  const params = useParams();
  const token = params.token as string;

  const [step, setStep] = useState<Step>("loading");
  const [client, setClient] = useState<ClientData | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load client data
  useEffect(() => {
    const loadClient = async () => {
      try {
        const response = await fetch(`/api/reviews/client?token=${token}`);
        if (response.ok) {
          const data = await response.json();
          setClient(data);
          setStep("rating");
        } else {
          setStep("error");
        }
      } catch (err) {
        console.error("Error loading client:", err);
        setStep("error");
      }
    };
    loadClient();
  }, [token]);

  // Handle rating selection
  const handleRatingSelect = useCallback(async (stars: number) => {
    setRating(stars);
    
    if (stars >= 4) {
      // High rating - advance to Google step
      setTimeout(() => setStep("google"), 600);
    } else {
      // Low rating - show private feedback form
      setTimeout(() => setStep("private-feedback"), 600);
    }
  }, []);

  // Handle low-star feedback submission
  const handlePrivateFeedbackSubmit = async () => {
    if (!client || !feedbackText.trim()) return;
    
    setSubmitting(true);
    try {
      await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: client.id,
          rating,
          text: feedbackText,
          wasIntercepted: true,
        }),
      });
      setStep("complete");
    } catch (err) {
      console.error("Error submitting feedback:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle copy to clipboard and open Google
  const handleCopyAndPost = async () => {
    if (!feedbackText.trim()) return;

    await navigator.clipboard.writeText(feedbackText);
    setCopied(true);

    // Save the review
    try {
      await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: client?.id,
          rating,
          text: feedbackText,
          postedToGoogle: true,
        }),
      });
    } catch (err) {
      console.error("Error saving review:", err);
    }

    // Open Google review page
    if (client?.account?.googlePlaceId) {
      const googleUrl = `https://search.google.com/local/writereview?placeid=${client.account.googlePlaceId}`;
      window.open(googleUrl, "_blank");
    }

    setTimeout(() => setStep("complete"), 1500);
  };

  // Skip Google and go to complete
  const handleSkipGoogle = async () => {
    // Save the rating without Google post
    try {
      await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: client?.id,
          rating,
          text: feedbackText || null,
          postedToGoogle: false,
        }),
      });
    } catch (err) {
      console.error("Error saving review:", err);
    }
    setStep("complete");
  };

  const template = client?.template || DEFAULT_TEMPLATE;
  const businessName = client?.account?.businessName || "this business";
  const clientFirstName = client?.name?.split(" ")[0] || "there";
  const primaryColor = client?.account?.primaryColor || "#6366F1";

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          
          {/* LOADING */}
          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
            </motion.div>
          )}

          {/* ERROR */}
          {step === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-8 text-center shadow-sm"
            >
              <h1 className="text-2xl font-bold text-slate-900 mb-4">
                Link expired
              </h1>
              <p className="text-slate-500">
                This review link is no longer valid. Please contact the business for a new link.
              </p>
            </motion.div>
          )}

          {/* STEP 1: RATING */}
          {step === "rating" && (
            <motion.div
              key="rating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-8 md:p-10 shadow-sm"
            >
              {/* Business branding header */}
              <div className="flex flex-col items-center mb-6">
                {client?.account?.logoUrl ? (
                  <img 
                    src={client.account.logoUrl} 
                    alt={businessName}
                    className="h-14 object-contain mb-2"
                  />
                ) : (
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {businessName.charAt(0).toUpperCase()}
                  </div>
                )}
                <p className="text-sm font-medium text-slate-600">
                  {businessName}
                </p>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  Hi {clientFirstName}!
                </h1>
                <p className="text-lg text-slate-600 mb-2">
                  {template.celebrationBody}
                </p>
                <p className="text-slate-500">
                  {template.reviewAsk}
                </p>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingSelect(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 md:w-12 md:h-12 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-slate-400">
                Tap to rate your experience
              </p>
            </motion.div>
          )}

          {/* STEP 2A: GOOGLE REVIEW (4-5 stars) */}
          {step === "google" && (
            <motion.div
              key="google"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-8 md:p-10 shadow-sm"
            >
              {/* Business branding - subtle */}
              <div className="flex justify-center mb-4">
                <p className="text-xs text-slate-400">{businessName}</p>
              </div>
              
              <div className="text-center mb-4">
                {/* Show their rating */}
                <div className="flex justify-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${
                        star <= rating 
                          ? "fill-amber-400 text-amber-400" 
                          : "text-slate-200"
                      }`} 
                    />
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {template.googleHeadline}
                </h2>
                <p className="text-slate-500 text-sm">
                  {template.googleSubhead}
                </p>
              </div>

              {/* Sentence starters */}
              {!feedbackText && (
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {[
                    `${businessName} made it easy to...`,
                    `What I loved was...`,
                    `I'd recommend them because...`,
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setFeedbackText(prompt + " ")}
                      className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Review text input */}
              <div className="mb-4">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={`I had a great experience with ${businessName}...`}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
              </div>

              {/* Copy & Post button */}
              <button
                onClick={handleCopyAndPost}
                disabled={!feedbackText.trim()}
                className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-primary text-white hover:bg-primary/90"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ backgroundColor: copied ? undefined : primaryColor }}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied! Opening Google...
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Post to Google
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Skip link */}
              <p className="text-center mt-6 text-xs text-slate-300">
                <button
                  onClick={handleSkipGoogle}
                  className="hover:text-slate-400 transition-colors underline"
                >
                  Skip this step
                </button>
              </p>
            </motion.div>
          )}

          {/* STEP 2B: PRIVATE FEEDBACK (1-3 stars) */}
          {step === "private-feedback" && (
            <motion.div
              key="private-feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-8 md:p-10 shadow-sm"
            >
              {/* Business branding - subtle */}
              <div className="flex justify-center mb-4">
                <p className="text-xs text-slate-400">{businessName}</p>
              </div>
              
              <div className="text-center mb-6">
                {/* Show their rating */}
                <div className="flex justify-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${
                        star <= rating 
                          ? "fill-amber-400 text-amber-400" 
                          : "text-slate-200"
                      }`} 
                    />
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  We'd love to do better
                </h2>
                <p className="text-slate-500 text-sm">
                  Your feedback helps us improve. This will only be shared with {businessName}.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-2">
                      What could we have done better?
                    </p>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Your feedback is private and helps us improve..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handlePrivateFeedbackSubmit}
                disabled={!feedbackText.trim() || submitting}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Private Feedback
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* STEP 3: COMPLETE */}
          {step === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 md:p-10 shadow-sm text-center"
            >
              {/* Business branding */}
              <div className="flex justify-center mb-4">
                {client?.account?.logoUrl ? (
                  <img 
                    src={client.account.logoUrl} 
                    alt={businessName}
                    className="h-10 object-contain"
                  />
                ) : (
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {businessName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="text-5xl mb-6">🙏</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Thank you, {clientFirstName}!
              </h2>
              <p className="text-slate-500 mb-6">
                We really appreciate your feedback.
              </p>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Thanks for taking the time to share your experience with {businessName}.
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
