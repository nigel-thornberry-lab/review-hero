import { NextRequest, NextResponse } from "next/server";
import { db, accounts, industryTemplates } from "@/lib/db";
import { eq } from "drizzle-orm";
import {
  rateLimiters,
  getClientIdentifier,
} from "@/lib/security/rate-limit";
import { accountSchema, validateInput } from "@/lib/security/validation";

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
    const validation = validateInput(accountSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.errors },
        { status: 400 }
      );
    }

    const { businessName, email, industry } = body;

    // Find industry template if provided
    let industryTemplateId: string | undefined;
    if (industry) {
      const template = await db.query.industryTemplates.findFirst({
        where: eq(industryTemplates.slug, industry),
      });
      if (template) {
        industryTemplateId = template.id;
      }
    }

    // For now, create a new account (in production, would link to WHOP user)
    // TODO: Get WHOP user ID from session
    const [account] = await db
      .insert(accounts)
      .values({
        businessName,
        email,
        industryTemplateId,
        // whopUserId would come from session
      })
      .returning();

    return NextResponse.json({
      success: true,
      accountId: account.id,
    });
  } catch (error) {
    console.error("Profile save error:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
