import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Lazy-initialized database client
let _db: NeonHttpDatabase<typeof schema> | null = null;

/**
 * Get database instance (lazy initialization)
 * This prevents errors during build when DATABASE_URL is not set
 */
export function getDb(): NeonHttpDatabase<typeof schema> {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL environment variable is not set. " +
        "Please configure your Neon database connection."
      );
    }
    const sql = neon(process.env.DATABASE_URL);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

// For backwards compatibility, export a getter
// This will throw at runtime if DATABASE_URL is not set, not at import time
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_, prop) {
    return getDb()[prop as keyof NeonHttpDatabase<typeof schema>];
  },
});

// Re-export schema for convenience
export * from "./schema";
