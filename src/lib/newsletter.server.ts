import { createServerFn } from "@tanstack/react-start";
import { eq, sql } from "drizzle-orm";
import { db } from "../../db/index";
import { newsletterSubscribers } from "../../db/schema";
import { checkRateLimit } from "./rate-limit.server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOURCES = new Set(["hero", "footer", "popup", "about", "article", "resources"]);

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const input = data as { email?: unknown; source?: unknown; website?: unknown } | null;
    const email = input?.email;
    const source = input?.source;
    return {
      email: typeof email === "string" ? email.trim().toLowerCase() : "",
      source: typeof source === "string" && SOURCES.has(source) ? source : "footer",
      /** Honeypot: a hidden field real visitors never fill in. Bots that auto-fill every field trip it. */
      website: typeof input?.website === "string" ? input.website : "",
    };
  })
  .handler(async ({ data }) => {
    if (data.website) return { ok: true } as const;
    if (!data.email || data.email.length > 254 || !EMAIL_PATTERN.test(data.email)) {
      return { ok: false, error: "Please enter a valid email address" } as const;
    }
    if (!(await checkRateLimit("newsletter", 5, 600))) {
      return { ok: false, error: "Too many attempts. Try again in a few minutes." } as const;
    }
    // Re-subscribing with an existing email refreshes consent and clears any prior unsubscribe.
    await db
      .insert(newsletterSubscribers)
      .values({ email: data.email, source: data.source, unsubscribeToken: crypto.randomUUID() })
      .onConflictDoUpdate({
        target: newsletterSubscribers.email,
        set: { consentedAt: sql`now()`, source: data.source, unsubscribedAt: null },
      });
    return { ok: true } as const;
  });

export const unsubscribeNewsletter = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const token = (data as { token?: unknown } | null)?.token;
    return { token: typeof token === "string" ? token : "" };
  })
  .handler(async ({ data }) => {
    if (!data.token) return { ok: false } as const;
    const [row] = await db
      .update(newsletterSubscribers)
      .set({ unsubscribedAt: sql`now()` })
      .where(eq(newsletterSubscribers.unsubscribeToken, data.token))
      .returning({ email: newsletterSubscribers.email });
    return { ok: Boolean(row) } as const;
  });
