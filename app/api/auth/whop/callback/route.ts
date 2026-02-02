import { NextRequest, NextResponse } from "next/server";
import { exchangeWHOPCode } from "@/lib/whop/client";

/**
 * Handle WHOP OAuth callback
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Handle errors from WHOP
  if (error) {
    console.error("WHOP OAuth error:", error);
    return NextResponse.redirect(
      new URL("/?error=auth_failed", request.url)
    );
  }

  // Ensure we have a code
  if (!code) {
    console.error("No code provided in WHOP callback");
    return NextResponse.redirect(
      new URL("/?error=no_code", request.url)
    );
  }

  try {
    // Exchange code for tokens
    const result = await exchangeWHOPCode(code);

    if (!result) {
      console.error("Failed to exchange WHOP code");
      return NextResponse.redirect(
        new URL("/?error=token_exchange_failed", request.url)
      );
    }

    const { user } = result;

    // TODO: Create or update account in database
    // For now, just log the successful auth
    console.log("WHOP auth successful:", user.email);

    // TODO: Set session cookie or JWT
    // For now, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("WHOP callback error:", error);
    return NextResponse.redirect(
      new URL("/?error=callback_failed", request.url)
    );
  }
}
