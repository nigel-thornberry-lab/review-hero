import { db, accounts, clients, industryTemplates } from "../lib/db";

async function seedTestClient() {
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

  const templateId = template?.id;
  console.log("Template created:", templateId || "already exists");

  // Get template if it already existed
  let finalTemplateId = templateId;
  if (!templateId) {
    const existing = await db.query.industryTemplates.findFirst({
      where: (t, { eq }) => eq(t.slug, "fitness-coach"),
    });
    finalTemplateId = existing?.id;
  }

  // 2. Create a test account
  const [account] = await db
    .insert(accounts)
    .values({
      businessName: "Joe's Fitness Studio",
      email: "joe@fitness.com",
      industryTemplateId: finalTemplateId,
      googlePlaceId: "ChIJN1t_tDeuEmsRUsoyG83frY4", // Sydney Opera House (test)
      primaryColor: "#6366F1",
    })
    .returning();

  console.log("Account created:", account.id);

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

  console.log("Client created:", client.id);
  console.log("\n✅ Test data seeded successfully!");
  console.log("\n📋 Test review link:");
  console.log(`http://localhost:3000/r/${client.token}`);

  process.exit(0);
}

seedTestClient().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
