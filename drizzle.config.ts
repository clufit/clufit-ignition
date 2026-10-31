import { defineConfig } from "drizzle-kit";

try { process.loadEnvFile(".env.local"); } catch { /* no local env file, e.g. in CI */ }

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "netlify/database/migrations",
  dbCredentials: { url: process.env.DATABASE_URL ?? process.env.NETLIFY_DB_URL ?? "" },
});
