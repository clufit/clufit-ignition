import { sql } from "drizzle-orm";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { db } from "../../db/index";

function clientIp(): string {
  return (
    getRequestHeader("cf-connecting-ip") ??
    getRequestIP({ xForwardedFor: true }) ??
    "unknown"
  );
}

/**
 * Fixed-window counter stored in Postgres (Cloudflare Workers isolates don't
 * share memory, so an in-process counter would not catch repeat requests).
 * Returns false once `limit` requests land inside the same `windowSeconds`.
 */
export async function checkRateLimit(bucket: string, limit: number, windowSeconds: number): Promise<boolean> {
  const key = `${bucket}:${clientIp()}`;
  const result = await db.execute(sql`
    INSERT INTO rate_limits (key, window_start, count)
    VALUES (${key}, now(), 1)
    ON CONFLICT (key) DO UPDATE SET
      count = CASE WHEN rate_limits.window_start < now() - make_interval(secs => ${windowSeconds}) THEN 1 ELSE rate_limits.count + 1 END,
      window_start = CASE WHEN rate_limits.window_start < now() - make_interval(secs => ${windowSeconds}) THEN now() ELSE rate_limits.window_start END
    RETURNING count
  `);
  const row = (result as unknown as { rows: Array<{ count: number }> }).rows[0];
  return (row?.count ?? 0) <= limit;
}
