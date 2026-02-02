import crypto from "crypto";

// ============================================
// WHOP WEBHOOK VERIFICATION
// ============================================

/**
 * Verify WHOP webhook signature
 */
export function verifyWHOPSignature(
  payload: string,
  signature: string | null
): boolean {
  if (!signature || !process.env.WHOP_WEBHOOK_SECRET) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.WHOP_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// ============================================
// WEBHOOK EVENT TYPES
// ============================================

export interface WHOPWebhookEvent {
  type: string;
  data: Record<string, unknown>;
  created_at: string;
}

export interface MembershipEvent {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  valid: boolean;
  email: string;
}

export interface PaymentEvent {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
}

// ============================================
// WEBHOOK HANDLERS
// ============================================

export type WebhookHandler = (data: Record<string, unknown>) => Promise<void>;

export const webhookHandlers: Record<string, WebhookHandler> = {
  "membership.went_valid": async (data) => {
    // Handle new subscription / reactivation
    console.log("Membership activated:", data);
    // TODO: Create or reactivate account
  },

  "membership.went_invalid": async (data) => {
    // Handle cancellation / expiration
    console.log("Membership deactivated:", data);
    // TODO: Deactivate account
  },

  "membership.updated": async (data) => {
    // Handle plan changes
    console.log("Membership updated:", data);
    // TODO: Update account plan
  },

  "payment.succeeded": async (data) => {
    // Handle successful payment
    console.log("Payment succeeded:", data);
    // TODO: Log payment, update billing cycle
  },

  "payment.failed": async (data) => {
    // Handle failed payment
    console.log("Payment failed:", data);
    // TODO: Alert user, update status
  },
};
