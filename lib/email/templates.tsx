import * as React from "react";

// ============================================
// EMAIL TEMPLATE HELPERS
// ============================================

export function getReviewRequestSubject(businessName: string): string {
  const firstName = businessName.split(" ")[0];
  return `Quick feedback for ${firstName}?`;
}

export function getReviewRequestFromName(businessName: string): string {
  return businessName.split(" ")[0];
}

// ============================================
// REVIEW REQUEST EMAIL
// ============================================

interface ReviewRequestEmailProps {
  clientName: string;
  businessName: string;
  token: string;
  appUrl?: string;
}

export const ReviewRequestEmail: React.FC<ReviewRequestEmailProps> = ({
  clientName,
  businessName,
  token,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
}) => {
  const url = `${appUrl}/r/${token}`;
  const firstName = clientName.split(" ")[0];
  const businessFirstName = businessName.split(" ")[0];

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: "1.6",
        color: "#1A1F2C",
        maxWidth: "480px",
        margin: "0 auto",
        padding: "0",
      }}
    >
      {/* Header with subtle branding */}
      <div
        style={{
          backgroundColor: "#F9F8F6",
          borderRadius: "12px 12px 0 0",
          padding: "24px 24px 20px 24px",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            color: "#64748B",
            margin: "0 0 4px 0",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          A message from {businessFirstName}
        </p>
      </div>

      {/* Main content */}
      <div style={{ padding: "28px 24px" }}>
        <p style={{ fontSize: "17px", margin: "0 0 20px 0", color: "#1A1F2C" }}>
          Hi {firstName},
        </p>

        <p style={{ fontSize: "16px", margin: "0 0 20px 0", color: "#374151" }}>
          Thanks for your business! I wanted to quickly check in — how did
          everything go?
        </p>

        <p style={{ fontSize: "16px", margin: "0 0 24px 0", color: "#374151" }}>
          If you have <strong>30 seconds</strong>, your honest feedback would
          mean a lot. It helps me improve and helps others find great service.
        </p>

        {/* CTA Button */}
        <a
          href={url}
          style={{
            display: "inline-block",
            backgroundColor: "#1A1F2C",
            color: "#ffffff",
            padding: "14px 28px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          Share Your Feedback →
        </a>

        <p
          style={{
            fontSize: "14px",
            margin: "24px 0 0 0",
            color: "#64748B",
          }}
        >
          Takes less than 30 seconds
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "20px 24px",
          borderTop: "1px solid #E2E8F0",
          backgroundColor: "#FAFAFA",
          borderRadius: "0 0 12px 12px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            color: "#94A3B8",
            margin: "0",
          }}
        >
          Sent on behalf of {businessName}
        </p>
      </div>
    </div>
  );
};
