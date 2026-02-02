// ============================================
// WHOP API CLIENT
// ============================================

const WHOP_API_BASE = "https://api.whop.com/api/v2";

interface WHOPUser {
  id: string;
  email: string;
  username: string;
  name?: string;
}

interface WHOPMembership {
  id: string;
  user_id: string;
  plan_id: string;
  status: "active" | "cancelled" | "past_due" | "expired";
  valid: boolean;
  created_at: string;
  expires_at?: string;
}

/**
 * Get current user from WHOP access token
 */
export async function getWHOPUser(accessToken: string): Promise<WHOPUser | null> {
  try {
    const response = await fetch(`${WHOP_API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error("WHOP API error:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("WHOP API error:", error);
    return null;
  }
}

/**
 * Check if user has valid access/membership
 */
export async function checkWHOPAccess(
  accessToken: string
): Promise<{ hasAccess: boolean; membership?: WHOPMembership }> {
  try {
    const response = await fetch(`${WHOP_API_BASE}/me/has_access`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return { hasAccess: false };
    }

    const data = await response.json();
    return {
      hasAccess: data.has_access === true,
      membership: data.membership,
    };
  } catch (error) {
    console.error("WHOP access check error:", error);
    return { hasAccess: false };
  }
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeWHOPCode(code: string): Promise<{
  accessToken: string;
  refreshToken: string;
  user: WHOPUser;
} | null> {
  try {
    const response = await fetch("https://api.whop.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        client_id: process.env.WHOP_CLIENT_ID,
        client_secret: process.env.WHOP_CLIENT_SECRET,
        redirect_uri: process.env.WHOP_REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      console.error("WHOP token exchange error:", response.status);
      return null;
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      user: data.user,
    };
  } catch (error) {
    console.error("WHOP token exchange error:", error);
    return null;
  }
}

/**
 * Build WHOP OAuth authorization URL
 */
export function getWHOPAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: process.env.WHOP_CLIENT_ID!,
    redirect_uri: process.env.WHOP_REDIRECT_URI!,
    response_type: "code",
    scope: "openid profile email",
  });

  return `https://whop.com/oauth?${params.toString()}`;
}
