import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import pg from "pg";

function encodeUserInfo(userInfo) {
  const [username = "", password = ""] = userInfo.split(":", 2);

  if (!password) {
    return encodeURIComponent(username);
  }

  return `${encodeURIComponent(username)}:${encodeURIComponent(password)}`;
}

function normalizePostgresConnectionString(connectionString) {
  try {
    const url = new URL(connectionString);

    if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
      return connectionString;
    }

    const rawUserInfo = url.username || url.password ? `${url.username}:${url.password}` : "";
    if (rawUserInfo) {
      url.username = "";
      url.password = "";
      const encodedUserInfo = encodeUserInfo(rawUserInfo);
      const [encodedUsername, encodedPassword] = encodedUserInfo.split(":", 2);
      url.username = decodeURIComponent(encodedUsername ?? "");
      if (encodedPassword !== undefined) {
        url.password = decodeURIComponent(encodedPassword);
      }
    }

    return url.toString();
  } catch {
    const match = connectionString.match(/^(postgres(?:ql)?:\/\/)([^@/]+)@(.+)$/i);

    if (!match) {
      return connectionString;
    }

    const [, prefix, userInfo, rest] = match;
    return `${prefix}${encodeUserInfo(userInfo)}@${rest}`;
  }
}

const { Client } = pg;

const dbUrl = process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.error("Missing required env var: SUPABASE_DB_URL");
  process.exitCode = 1;
  process.exit(1);
}

const sqlPath = resolve(process.cwd(), "supabase/migrations/20260406010000_leads_kaptenbatik.sql");
const sql = readFileSync(sqlPath, "utf8");

const client = new Client({
  connectionString: normalizePostgresConnectionString(dbUrl),
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log("Applied leads_kaptenbatik schema successfully.");
} catch (error) {
  console.error("Failed to apply leads_kaptenbatik schema.");
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
