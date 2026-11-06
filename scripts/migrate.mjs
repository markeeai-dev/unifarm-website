// Applies db/schema.sql to the database at DATABASE_URL.
// Usage: node scripts/migrate.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import postgres from "postgres";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  let raw;
  try {
    raw = readFileSync(envPath, "utf8");
  } catch {
    return; // không có .env.local (vd. chạy trong container) — dùng process.env
  }
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL not set (checked process.env and .env.local)");
  }

  const schema = readFileSync(path.join(__dirname, "..", "db", "schema.sql"), "utf8");

  // onnotice: schema.sql có nhiều "DROP ... IF EXISTS" → bỏ qua các NOTICE vô hại.
  const sql = postgres(databaseUrl, { ssl: "prefer", max: 1, onnotice: () => {} });
  try {
    // unsafe() không có tham số → giao thức query đơn giản, chạy được nhiều câu lệnh một lượt.
    await sql.unsafe(schema);
    console.log("Schema applied successfully.");
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
