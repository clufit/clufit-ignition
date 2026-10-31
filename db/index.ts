import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

type DB = ReturnType<typeof createDb>;

function createDb() {
  // Cloudflare only exposes env vars during a request, so the client is created lazily.
  const url = process.env["DATABASE_URL"] ?? process.env["NETLIFY_DB_URL"];
  if (!url) throw new Error("DATABASE_URL is not set");
  return drizzle({ client: neon(url), schema });
}

let instance: DB | undefined;

export const db = new Proxy({} as DB, {
  get(_target, prop) {
    instance ??= createDb();
    const value = Reflect.get(instance, prop);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
