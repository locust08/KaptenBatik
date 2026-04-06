import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import pg from "pg";

import { normalizePostgresConnectionString } from "@/lib/utils/postgres";

const { Client } = pg;

const TABLE_PROVISION_SQL_PATH = resolve(
  process.cwd(),
  "supabase/migrations/20260406010000_leads_kaptenbatik.sql",
);

let provisioningPromise: Promise<void> | null = null;

function readSupabaseDatabaseUrl() {
  const value = process.env.SUPABASE_DB_URL?.trim();

  if (!value) {
    throw new Error("Missing required environment variable: SUPABASE_DB_URL");
  }

  return value;
}

export async function ensureLeadsKaptenBatikTable() {
  if (provisioningPromise) {
    return provisioningPromise;
  }

  provisioningPromise = (async () => {
    const sql = readFileSync(TABLE_PROVISION_SQL_PATH, "utf8");
    const client = new Client({
      connectionString: normalizePostgresConnectionString(readSupabaseDatabaseUrl()),
      ssl: { rejectUnauthorized: false },
    });

    try {
      await client.connect();
      await client.query(sql);
    } finally {
      await client.end().catch(() => {});
    }
  })();

  try {
    await provisioningPromise;
  } finally {
    provisioningPromise = null;
  }
}
