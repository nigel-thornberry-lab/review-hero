import { NextRequest, NextResponse } from "next/server";
import { db, accounts } from "@/lib/db";
import { eq } from "drizzle-orm";
import {
  rateLimiters,
  getClientIdentifier,
} from "@/lib/security/rate-limit";
import { z } from "zod";
import { validateInput } from "@/lib/security/validation";

const googlePlaceSchema = z.object({
  googlePlaceId: z.string().min(1).max(500),
  accountId: z.string().uuid().optional(),
});

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
    const body = await request.json();

    // Validate input
    const validation = validateInput(googlePlaceSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.errors },
        { status: 400 }
      );
    }

    const { googlePlaceId, accountId } = validation.data;

    // TODO: Get account ID from session if not provided
    // For now, we'll update the most recent account without WHOP ID
    if (accountId) {
      await db
        .update(accounts)
        .set({
          googlePlaceId,
          updatedAt: new Date(),
        })
        .where(eq(accounts.id, accountId));
    }

    return NextResponse.json({
      success: true,
      googlePlaceId,
    });
  } catch (error) {
    console.error("Google Place ID save error:", error);
    return NextResponse.json(
      { error: "Failed to save Google Place ID" },
      { status: 500 }
    );
  }
}
