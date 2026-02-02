import { NextRequest } from "next/server";

// ============================================
// SIMPLE IN-MEMORY RATE LIMITER
// ============================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean every minute

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

function createRateLimiter(config: RateLimitConfig) {
  return {
    check(identifier: string): boolean {
      const now = Date.now();
      const entry = rateLimitStore.get(identifier);

      if (!entry || entry.resetTime < now) {
        // New window
        rateLimitStore.set(identifier, {
          count: 1,
          resetTime: now + config.windowMs,
        });
        return true;
      }

      if (entry.count >= config.maxRequests) {
        return false; // Rate limited
      }

      entry.count++;
      return true;
    },
  };
}

// ============================================
// RATE LIMITERS
// ============================================

export const rateLimiters = {
  // Public form submissions (review requests, etc.)
  publicForms: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
  }),

  // Public review/feedback pages
  publicPages: createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 30,
  }),

  // API endpoints
  api: createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 60,
  }),

  // Webhook endpoints (more lenient)
  webhooks: createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 100,
  }),
};

// ============================================
// HELPERS
// ============================================

/**
 * Extract client identifier from request
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  const ip =
    cfConnectingIp ||
    realIp ||
    forwardedFor?.split(",")[0]?.trim() ||
    "unknown";

  return ip;
}
