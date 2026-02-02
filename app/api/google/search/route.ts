import { NextRequest, NextResponse } from "next/server";
import {
  rateLimiters,
  getClientIdentifier,
} from "@/lib/security/rate-limit";

interface GoogleSearchResult {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  reviewCount?: number;
}

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request);
  if (!rateLimiters.api.check(clientId)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    // Check if Google Places API key is configured
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      // Return mock data for development
      console.log("Google Places API key not configured, returning mock data");
      
      const mockResults: GoogleSearchResult[] = [
        {
          placeId: "mock_place_id_1",
          name: query,
          address: "123 Main Street, New York, NY",
          rating: 4.5,
          reviewCount: 47,
        },
        {
          placeId: "mock_place_id_2",
          name: `${query} - Downtown`,
          address: "456 Broadway, New York, NY",
          rating: 4.2,
          reviewCount: 23,
        },
      ];

      return NextResponse.json({ results: mockResults });
    }

    // Call Google Places API
    const googleUrl = new URL(
      "https://maps.googleapis.com/maps/api/place/textsearch/json"
    );
    googleUrl.searchParams.set("query", query);
    googleUrl.searchParams.set("key", process.env.GOOGLE_PLACES_API_KEY);

    const response = await fetch(googleUrl.toString());
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places API error:", data.status);
      return NextResponse.json(
        { error: "Google search failed" },
        { status: 500 }
      );
    }

    // Transform results
    const results: GoogleSearchResult[] = (data.results || [])
      .slice(0, 5)
      .map((place: any) => ({
        placeId: place.place_id,
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        reviewCount: place.user_ratings_total,
      }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Google search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
