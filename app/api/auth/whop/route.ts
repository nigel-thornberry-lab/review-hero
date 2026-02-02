import { NextResponse } from "next/server";
import { getWHOPAuthUrl } from "@/lib/whop/client";

/**
 * Redirect to WHOP OAuth authorization
 */
export async function GET() {
  const authUrl = getWHOPAuthUrl();
  return NextResponse.redirect(authUrl);
}
