import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { newsletterSubscribers } from "../../db/schema.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let email: unknown;
  try {
    ({ email } = await req.json());
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const normalized = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!normalized || normalized.length > 254 || !EMAIL_PATTERN.test(normalized)) {
    return Response.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  // Re-subscribing with an existing email is treated as success.
  await db.insert(newsletterSubscribers).values({ email: normalized }).onConflictDoNothing();
  return Response.json({ ok: true }, { status: 201 });
};

export const config: Config = {
  path: "/api/newsletter",
};
