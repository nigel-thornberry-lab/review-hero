import { NextRequest, NextResponse } from "next/server";
import { db, clients, reviews } from "@/lib/db";
import { eq, desc, sql, and, gte } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("accountId");

  if (!accountId) {
    return NextResponse.json({ error: "accountId required" }, { status: 400 });
  }

  try {
    // Get start of current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all clients for this account
    const allClients = await db.query.clients.findMany({
      where: eq(clients.accountId, accountId),
      orderBy: desc(clients.createdAt),
    });

    // Fetch all reviews for this account
    const allReviews = await db.query.reviews.findMany({
      where: eq(reviews.accountId, accountId),
      orderBy: desc(reviews.createdAt),
    });

    // Calculate stats
    const totalSent = allClients.filter((c) => c.status !== "pending").length;
    const totalReviewed = allReviews.length; // Use actual reviews count
    const totalClicked = allClients.filter(
      (c) => c.status === "clicked" || c.openedAt
    ).length;

    // This month stats
    const thisMonthClients = allClients.filter(
      (c) => c.createdAt >= monthStart
    );
    const thisMonthReviews = allReviews.filter(
      (r) => r.createdAt >= monthStart
    );

    // Conversion rate (reviews received / requests sent)
    const conversionRate =
      totalSent > 0 ? Math.round((allReviews.length / totalSent) * 100) : 0;

    // Average rating
    const avgRating =
      allReviews.length > 0
        ? (
            allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
          ).toFixed(1)
        : "0";

    // Build activity feed (recent events)
    const activities = allClients
      .slice(0, 20)
      .map((client) => {
        // Determine the most recent event for this client
        if (client.reviewedAt) {
          return {
            id: `${client.id}-reviewed`,
            type: "reviewed" as const,
            clientName: client.name,
            timestamp: client.reviewedAt,
          };
        }
        if (client.openedAt) {
          return {
            id: `${client.id}-clicked`,
            type: "clicked" as const,
            clientName: client.name,
            timestamp: client.openedAt,
          };
        }
        if (client.sentAt) {
          return {
            id: `${client.id}-sent`,
            type: "sent" as const,
            clientName: client.name,
            timestamp: client.sentAt,
          };
        }
        return {
          id: `${client.id}-created`,
          type: "created" as const,
          clientName: client.name,
          timestamp: client.createdAt,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);

    // Build reviews list with client info
    const reviewsList = allReviews.map((review) => {
      const client = allClients.find((c) => c.id === review.clientId);
      return {
        id: review.id,
        rating: review.rating,
        text: review.text,
        clientName: client?.name || "Unknown",
        clientEmail: client?.email,
        postedToGoogle: review.postedToGoogle,
        wasIntercepted: review.wasIntercepted,
        createdAt: review.createdAt,
      };
    });

    // Build clients list (requests)
    const requestsList = allClients.map((client) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      status: client.status,
      sentAt: client.sentAt,
      openedAt: client.openedAt,
      reviewedAt: client.reviewedAt,
      createdAt: client.createdAt,
    }));

    return NextResponse.json({
      stats: {
        totalSent,
        totalReviewed,
        totalClicked,
        reviewsThisMonth: thisMonthReviews.length,
        requestsThisMonth: thisMonthClients.length,
        conversionRate,
        avgRating,
      },
      reviews: reviewsList,
      requests: requestsList,
      activities,
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
