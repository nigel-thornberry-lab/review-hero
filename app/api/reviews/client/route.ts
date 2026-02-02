import { NextRequest, NextResponse } from "next/server";
import { db, clients, accounts, industryTemplates } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Find client by token
    const client = await db.query.clients.findFirst({
      where: eq(clients.token, token),
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Check if token is expired (21 days)
    if (client.expiresAt && new Date(client.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "Token expired" },
        { status: 410 }
      );
    }

    // Get account
    const account = await db.query.accounts.findFirst({
      where: eq(accounts.id, client.accountId),
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    // Get industry template if set
    let template = null;
    if (account.industryTemplateId) {
      template = await db.query.industryTemplates.findFirst({
        where: eq(industryTemplates.id, account.industryTemplateId),
      });
    }

    // Update client status to clicked if pending/sent
    if (client.status === "pending" || client.status === "sent") {
      await db
        .update(clients)
        .set({
          status: "clicked",
          openedAt: new Date(),
        })
        .where(eq(clients.id, client.id));
    }

    // Return client data with account and template
    return NextResponse.json({
      id: client.id,
      name: client.name,
      email: client.email,
      token: client.token,
      account: {
        id: account.id,
        businessName: account.businessName,
        googlePlaceId: account.googlePlaceId,
        primaryColor: account.primaryColor || "#6366F1",
        logoUrl: account.logoUrl,
      },
      template: template
        ? {
            celebrationHeadline: account.customCelebrationHeadline || template.celebrationHeadline,
            celebrationBody: account.customCelebrationBody || template.celebrationBody,
            reviewAsk: account.customReviewAsk || template.reviewAsk,
            googleHeadline: template.googleHeadline,
            googleSubhead: template.googleSubhead,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
