import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db/index";
import { contactMessages } from "../../db/schema";
import { requireAdminSession } from "./admin-auth.server";

const contactInput = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  reason: z.string().trim().min(1),
  message: z.string().trim().min(1),
  /** Honeypot: a hidden field real visitors never fill in. Bots that auto-fill every field trip it. */
  website: z.string().optional(),
});

export const submitContactMessage = createServerFn({ method: "POST" })
  .validator((data: unknown) => contactInput.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true } as const;
    await db.insert(contactMessages).values({
      name: data.name,
      email: data.email,
      reason: data.reason,
      message: data.message,
    });
    return { ok: true } as const;
  });

export const listMessages = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
});

export const markMessageRead = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.number().int(), read: z.boolean() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();
    await db.update(contactMessages).set({ read: data.read }).where(eq(contactMessages.id, data.id));
    return { ok: true } as const;
  });

export const deleteMessage = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.number().int() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();
    await db.delete(contactMessages).where(eq(contactMessages.id, data.id));
    return { ok: true } as const;
  });

export type ContactMessage = typeof contactMessages.$inferSelect;
