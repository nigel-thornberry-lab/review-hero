import * as React from "react";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { db, clients, accounts } from "@/lib/db";
import { eq } from "drizzle-orm";
import { validateInput } from "@/lib/security/validation";
import { rateLimiters, getClientIdentifier } from "@/lib/security/rate-limit";
import {
  ReviewRequestEmail,
  getReviewRequestSubject,
} from "@/lib/email/templates";

// Initialize Resend (only if API key is present)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Request schema
const sendRequestSchema = z.object({
  accountId: z.string().uuid(),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Valid email is required"),
});

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request);
  const allowed = rateLimiters.publicForms.check(`send:${clientId}`);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Validate input
    const validation = validateInput(sendRequestSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.errors },
        { status: 400 }
      );
    }

    const { accountId, clientName, clientEmail } = validation.data;

    // Get account details
    const account = await db.query.accounts.findFirst({
      where: eq(accounts.id, accountId),
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Create client record
    const [client] = await db
      .insert(clients)
      .values({
        accountId,
        name: clientName,
        email: clientEmail,
        status: "pending",
        source: "email",
      })
      .returning();

    if (!client) {
      return NextResponse.json(
        { error: "Failed to create client record" },
        { status: 500 }
      );
    }

    console.log(`✅ Client created: ${clientName} (${client.id})`);

    // Send email if Resend is configured
    let emailSent = false;
    let emailError: string | null = null;

    if (resend) {
      try {
        // Use Resend's default sender for testing (no domain verification needed)
        // In production, use verified domain: `${fromName} <reviews@reviewhero.app>`
        const fromEmail = process.env.EMAIL_FROM || "Review Hero <onboarding@resend.dev>";
        const subject = getReviewRequestSubject(account.businessName);

        await resend.emails.send({
          from: fromEmail,
          to: clientEmail,
          replyTo: account.email || undefined,
          subject,
          react: ReviewRequestEmail({
            clientName,
            businessName: account.businessName,
            token: client.token,
          }) as React.ReactElement,
        });

        // Update client status to sent
        await db
          .update(clients)
          .set({
            status: "sent",
            sentAt: new Date(),
          })
          .where(eq(clients.id, client.id));

        emailSent = true;
        console.log(`📧 Email sent to ${clientEmail}`);
      } catch (err) {
        console.error("Email send error:", err);
        emailError =
          err instanceof Error ? err.message : "Failed to send email";
      }
    } else {
      console.warn("⚠️ Resend not configured - email not sent");
      emailError = "Email service not configured";

      // Still mark as "sent" for testing (link is still valid)
      await db
        .update(clients)
        .set({
          status: "sent",
          sentAt: new Date(),
        })
        .where(eq(clients.id, client.id));
    }

    return NextResponse.json({
      success: true,
      clientId: client.id,
      token: client.token,
      emailSent,
      emailError,
      reviewLink: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/r/${client.token}`,
    });
  } catch (error) {
    console.error("Send request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
