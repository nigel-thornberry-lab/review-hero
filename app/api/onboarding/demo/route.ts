import { NextRequest, NextResponse } from "next/server";
import {
  rateLimiters,
  getClientIdentifier,
} from "@/lib/security/rate-limit";
import { z } from "zod";
import { validateInput } from "@/lib/security/validation";

const demoSchema = z.object({
  email: z.string().email(),
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
    const validation = validateInput(demoSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.errors },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // TODO: Send actual demo email using Resend
    // For now, just log and return success
    console.log(`Demo email would be sent to: ${email}`);

    // In production:
    // 1. Create a demo client record
    // 2. Generate a review token
    // 3. Send email with review link using Resend

    return NextResponse.json({
      success: true,
      message: "Demo email sent",
    });
  } catch (error) {
    console.error("Demo send error:", error);
    return NextResponse.json(
      { error: "Failed to send demo" },
      { status: 500 }
    );
  }
}
