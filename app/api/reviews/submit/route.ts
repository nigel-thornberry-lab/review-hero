import { NextRequest, NextResponse } from "next/server";
import { db, reviews, clients, accounts, usageEvents } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { validateInput } from "@/lib/security/validation";
import { rateLimiters, getClientIdentifier } from "@/lib/security/rate-limit";

const reviewSubmitSchema = z.object({
  clientId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  text: z.string().max(5000).nullable().optional(),
  postedToGoogle: z.boolean().optional().default(false),
  wasIntercepted: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  // Rate limiting
  const identifier = getClientIdentifier(request);
  if (!rateLimiters.api.check(identifier)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Validate input
    const validation = validateInput(reviewSubmitSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.errors },
        { status: 400 }
      );
    }

    const { clientId, rating, text, postedToGoogle, wasIntercepted } = validation.data;

    // Get client to verify and get accountId
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, clientId),
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Check if review already exists for this client
    const existingReview = await db.query.reviews.findFirst({
      where: eq(reviews.clientId, clientId),
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "Review already submitted" },
        { status: 409 }
      );
    }

    // Create review
    const [review] = await db
      .insert(reviews)
      .values({
        clientId,
        accountId: client.accountId,
        rating,
        text: text || null,
        postedToGoogle,
        wasIntercepted,
      })
      .returning();

    // Update client status
    await db
      .update(clients)
      .set({
        status: "reviewed",
        reviewedAt: new Date(),
      })
      .where(eq(clients.id, clientId));

    // Create usage event for billing (if not intercepted)
    if (!wasIntercepted) {
      await db.insert(usageEvents).values({
        accountId: client.accountId,
        eventType: "review",
        relatedId: review.id,
        amountCents: 300, // $3 per review
      });

      // Increment account's monthly usage
      await db
        .update(accounts)
        .set({
          requestsUsedThisMonth: (await db.query.accounts.findFirst({
            where: eq(accounts.id, client.accountId),
          }))?.requestsUsedThisMonth ?? 0 + 1,
        })
        .where(eq(accounts.id, client.accountId));
    }

    return NextResponse.json({
      success: true,
      reviewId: review.id,
      rating,
      wasIntercepted,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
