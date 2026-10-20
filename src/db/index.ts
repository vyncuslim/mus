import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let cachedDb: PostgresJsDatabase<typeof schema> | null = null;
let cachedClient: ReturnType<typeof postgres> | null = null;

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  return Boolean(url && (url.startsWith("postgres://") || url.startsWith("postgresql://")));
}

export function getDb(): PostgresJsDatabase<typeof schema> | null {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (cachedDb) {
    return cachedDb;
  }

  try {
    const connectionString = process.env.DATABASE_URL!.trim();
    cachedClient = postgres(connectionString, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 5,
      prepare: false,
    });
    cachedDb = drizzle(cachedClient, { schema });
    return cachedDb;
  } catch {
    return null;
  }
}

export async function checkDatabaseHealth(): Promise<{
  configured: boolean;
  connected: boolean;
  mode: "postgresql" | "starter_dataset";
  message: string;
}> {
  if (!isDatabaseConfigured()) {
    return {
      configured: false,
      connected: false,
      mode: "starter_dataset",
      message:
        "DATABASE_URL is not configured; serving verified Wiktionary/Wiktextract starter dataset in read-only mode.",
    };
  }

  try {
    if (!cachedClient) {
      getDb();
    }
    if (!cachedClient) {
      return {
        configured: true,
        connected: false,
        mode: "starter_dataset",
        message: "Database client initialization failed; falling back to verified starter dataset.",
      };
    }
    await cachedClient`SELECT 1`;
    return {
      configured: true,
      connected: true,
      mode: "postgresql",
      message: "Connected to PostgreSQL dictionary database.",
    };
  } catch {
    return {
      configured: true,
      connected: false,
      mode: "starter_dataset",
      message:
        "PostgreSQL connection unreachable; automatically serving verified starter dataset fallback.",
    };
  }
}
