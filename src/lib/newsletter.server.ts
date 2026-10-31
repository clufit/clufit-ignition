import { createServerFn } from "@tanstack/react-start";
import { db } from "../../db/index";
import { newsletterSubscribers } from "../../db/schema";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const email = (data as { email?: unknown } | null)?.email;
    return { email: typeof email === "string" ? email.trim().toLowerCase() : "" };
  })
  .handler(async ({ data }) => {
    if (!data.email || data.email.length > 254 || !EMAIL_PATTERN.test(data.email)) {
      return { ok: false, error: "Please enter a valid email address" } as const;
    }
    // Re-subscribing with an existing email is treated as success.
    await db.insert(newsletterSubscribers).values({ email: data.email }).onConflictDoNothing();
    return { ok: true } as const;
  });
