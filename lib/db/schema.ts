import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// ============================================
// ENUMS
// ============================================

export const clientStatusEnum = pgEnum("client_status", [
  "pending", // Created, not yet sent
  "sent", // Review request sent
  "clicked", // Opened link but didn't complete
  "reviewed", // Left a review
  "referred", // Provided a referral
  "expired", // 21 days, no response
]);

export const reviewSourceEnum = pgEnum("review_source", ["email", "sms", "qr"]);

export const referralStatusEnum = pgEnum("referral_status", [
  "new",
  "contacted",
  "converted",
  "lost",
]);

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "starter",
  "growth",
  "scale",
  "pay_per_result",
]);

// ============================================
// TABLES
// ============================================

/**
 * Industry templates - pre-built copy for different business types
 */
export const industryTemplates = pgTable("industry_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(), // 'fitness-coach', 'dental-practice'
  name: text("name").notNull(), // 'Fitness Coach'
  category: text("category").notNull(), // 'Health & Wellness'

  // Customizable copy
  celebrationHeadline: text("celebration_headline").notNull(),
  celebrationBody: text("celebration_body").notNull(),
  reviewAsk: text("review_ask").notNull(),
  googleHeadline: text("google_headline").notNull(),
  googleSubhead: text("google_subhead").notNull(),
  referralHeadline: text("referral_headline").notNull(),
  referralBody: text("referral_body").notNull(),

  // Metadata
  icon: text("icon"), // Emoji or icon name
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Accounts - business accounts linked to WHOP users
 */
export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),

  // WHOP integration
  whopUserId: text("whop_user_id").unique(),
  whopMembershipId: text("whop_membership_id"),
  whopPlan: subscriptionTierEnum("whop_plan").default("starter"),

  // Business info
  businessName: text("business_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  industryTemplateId: uuid("industry_template_id").references(
    () => industryTemplates.id
  ),
  googlePlaceId: text("google_place_id"),

  // Branding (Growth+ tiers)
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").default("#6366F1"),

  // Custom copy overrides (optional)
  customCelebrationHeadline: text("custom_celebration_headline"),
  customCelebrationBody: text("custom_celebration_body"),
  customReviewAsk: text("custom_review_ask"),
  customReferralHeadline: text("custom_referral_headline"),
  customReferralBody: text("custom_referral_body"),

  // Plan limits
  monthlyRequestLimit: integer("monthly_request_limit").default(50),
  requestsUsedThisMonth: integer("requests_used_this_month").default(0),
  billingCycleStart: timestamp("billing_cycle_start"),

  // Feature flags based on plan
  smsEnabled: boolean("sms_enabled").default(false),
  videoEnabled: boolean("video_enabled").default(false),
  whiteLabel: boolean("white_label").default(false),

  // Settings
  autoNudgesEnabled: boolean("auto_nudges_enabled").default(true),
  thankYouVideoUrl: text("thank_you_video_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Clients - people who receive review requests
 */
export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id")
    .references(() => accounts.id, { onDelete: "cascade" })
    .notNull(),

  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),

  // Magic link token
  token: uuid("token").defaultRandom().unique().notNull(),

  status: clientStatusEnum("status").default("pending").notNull(),
  source: reviewSourceEnum("source").default("email"),

  // Tracking timestamps
  sentAt: timestamp("sent_at"),
  openedAt: timestamp("opened_at"),
  reviewedAt: timestamp("reviewed_at"),

  // Nudge tracking
  nudge1SentAt: timestamp("nudge1_sent_at"), // Day 3
  nudge2SentAt: timestamp("nudge2_sent_at"), // Day 7
  nudge3SentAt: timestamp("nudge3_sent_at"), // Day 14
  expiresAt: timestamp("expires_at"), // Day 21

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Reviews - collected feedback/reviews
 */
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  accountId: uuid("account_id")
    .references(() => accounts.id, { onDelete: "cascade" })
    .notNull(),

  rating: integer("rating").notNull(), // 1-5
  text: text("text"),

  // Media
  photoUrl: text("photo_url"),
  videoUrl: text("video_url"),
  videoThumbnailUrl: text("video_thumbnail_url"),

  // Google
  postedToGoogle: boolean("posted_to_google").default(false),
  googleReviewUrl: text("google_review_url"),

  // Negative review interception
  wasIntercepted: boolean("was_intercepted").default(false),
  interceptCallRequested: boolean("intercept_call_requested").default(false),
  interceptResolved: boolean("intercept_resolved").default(false),
  interceptNotes: text("intercept_notes"),

  // Generated content
  socialCardUrl: text("social_card_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Referrals - self-referrals collected from clients
 */
export const referrals = pgTable("referrals", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  accountId: uuid("account_id")
    .references(() => accounts.id, { onDelete: "cascade" })
    .notNull(),

  referredName: text("referred_name").notNull(),
  referredPhone: text("referred_phone"),
  referredEmail: text("referred_email"),
  referredNotes: text("referred_notes"),

  status: referralStatusEnum("status").default("new").notNull(),

  // Conversion tracking
  becameClient: boolean("became_client"),
  becameClientAt: timestamp("became_client_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Usage Events - for pay-per-result billing
 */
export const usageEvents = pgTable("usage_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id")
    .references(() => accounts.id, { onDelete: "cascade" })
    .notNull(),

  eventType: text("event_type").notNull(), // 'review' or 'referral'
  relatedId: uuid("related_id"), // review_id or referral_id
  amountCents: integer("amount_cents").notNull(), // 300 for review, 2500 for referral

  // Billing
  billed: boolean("billed").default(false),
  billedAt: timestamp("billed_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type IndustryTemplate = typeof industryTemplates.$inferSelect;
export type NewIndustryTemplate = typeof industryTemplates.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;

export type Referral = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;

export type UsageEvent = typeof usageEvents.$inferSelect;
export type NewUsageEvent = typeof usageEvents.$inferInsert;
