import { z } from "zod";

// ============================================
// INPUT VALIDATION SCHEMAS
// ============================================

/**
 * Account creation/update
 */
export const accountSchema = z.object({
  businessName: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  industryTemplateId: z.string().uuid().optional(),
  googlePlaceId: z.string().max(500).optional(),
});

/**
 * Client creation (sending review request)
 */
export const createClientSchema = z
  .object({
    name: z.string().min(1).max(100),
    email: z.string().email().optional(),
    phone: z
      .string()
      .regex(/^\+?[0-9\s\-()]{8,20}$/)
      .optional(),
    sendMethod: z.enum(["email", "sms", "both"]),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required",
  });

/**
 * Review submission
 */
export const submitReviewSchema = z.object({
  clientId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  text: z.string().max(2000).optional(),
  postedToGoogle: z.boolean().optional(),
});

/**
 * Referral submission
 */
export const submitReferralSchema = z.object({
  clientId: z.string().uuid(),
  referredName: z.string().min(1).max(100),
  referredPhone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{8,20}$/)
    .optional(),
  referredEmail: z.string().email().optional(),
  referredNotes: z.string().max(500).optional(),
});

/**
 * WHOP webhook payload
 */
export const whopWebhookSchema = z.object({
  type: z.string(),
  data: z.record(z.string(), z.unknown()),
});

// ============================================
// VALIDATION HELPER
// ============================================

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Array<{ path: string; message: string }> };

export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): ValidationResult<T> {
  const result = schema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }
  // Transform Zod errors to simpler format
  const errors = result.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
  return { success: false, errors };
}
