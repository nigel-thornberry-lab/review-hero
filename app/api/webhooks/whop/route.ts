import { NextRequest, NextResponse } from "next/server";
import { verifyWHOPSignature, webhookHandlers } from "@/lib/whop/webhooks";
import {
  rateLimiters,
  getClientIdentifier,
} from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request);
  if (!rateLimiters.webhooks.check(clientId)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get("whop-signature");

    // Verify webhook signature
    if (!verifyWHOPSignature(body, signature)) {
      console.error("Invalid WHOP webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse event
    const event = JSON.parse(body);
    console.log("WHOP webhook received:", event.type);

    // Get handler for this event type
    const handler = webhookHandlers[event.type];

    if (handler) {
      await handler(event.data);
    } else {
      console.log("No handler for event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("WHOP webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// WHOP may send GET requests to verify the endpoint
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
