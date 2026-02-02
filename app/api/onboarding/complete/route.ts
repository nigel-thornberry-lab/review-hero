import { NextRequest, NextResponse } from "next/server";
import {
  rateLimiters,
  getClientIdentifier,
} from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request);
  if (!rateLimiters.api.check(clientId)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  try {
    // TODO: Get account from session and mark onboarding complete
    // For now, just return success
    console.log("Onboarding marked complete");

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Onboarding complete error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
