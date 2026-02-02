import { NextResponse } from "next/server";
import { db, accounts, clients, industryTemplates } from "@/lib/db";

// Only allow in development
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  try {
    console.log("Seeding test data...");

    // 1. Create a test industry template
    const [template] = await db
      .insert(industryTemplates)
      .values({
        slug: "fitness-coach",
        name: "Fitness Coach",
        category: "Health & Wellness",
        celebrationHeadline: "You crushed it!",
        celebrationBody: "Your dedication to your health is inspiring. We're honored to be part of your fitness journey.",
        reviewAsk: "Your feedback helps others find their perfect trainer.",
        googleHeadline: "You're amazing!",
        googleSubhead: "Help others discover great fitness coaching.",
        referralHeadline: "Know someone who wants to get fit?",
        referralBody: "I'd love to help them achieve their goals too.",
        icon: "💪",
      })
      .onConflictDoNothing()
      .returning();

    let templateId = template?.id;

    // Get template if it already existed
    if (!templateId) {
      const existing = await db.query.industryTemplates.findFirst({
        where: (t, { eq }) => eq(t.slug, "fitness-coach"),
      });
      templateId = existing?.id;
    }

    // 2. Create a test account
    const [account] = await db
      .insert(accounts)
      .values({
        businessName: "Joe's Fitness Studio",
        email: "joe@fitness.com",
        industryTemplateId: templateId,
        googlePlaceId: "ChIJN1t_tDeuEmsRUsoyG83frY4", // Sydney Opera House (test)
        primaryColor: "#6366F1",
      })
      .returning();

    // 3. Create a test client
    const [client] = await db
      .insert(clients)
      .values({
        accountId: account.id,
        name: "Sarah Test",
        email: "sarah@test.com",
        status: "sent",
        sentAt: new Date(),
        expiresAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days
      })
      .returning();

    return NextResponse.json({
      success: true,
      templateId,
      accountId: account.id,
      clientId: client.id,
      reviewLink: `/r/${client.token}`,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
