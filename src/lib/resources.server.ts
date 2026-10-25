import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db/index";
import { resources } from "../../db/schema";
import { requireAdminSession } from "./admin-auth.server";

const urlOrPath = z.string().trim().refine(
  (v) => v === "" || /^https?:\/\//.test(v) || v.startsWith("/"),
  "Enter a full URL (https://...) or a site path starting with /",
);

const resourceInput = z.object({
  section: z.enum(["program", "guide"]),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  image: urlOrPath.optional(),
  fileUrl: urlOrPath.optional(),
  sortOrder: z.number().int(),
});

export const listResources = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(resources).orderBy(asc(resources.sortOrder), asc(resources.id));
});

export const listResourcesAdmin = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  return db.select().from(resources).orderBy(asc(resources.sortOrder), asc(resources.id));
});

export const createResource = createServerFn({ method: "POST" })
  .validator((data: unknown) => resourceInput.parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const [row] = await db
      .insert(resources)
      .values({
        section: data.section,
        title: data.title,
        description: data.description,
        image: data.image || null,
        fileUrl: data.fileUrl || null,
        sortOrder: data.sortOrder,
      })
      .returning();
    return row;
  });

export const updateResource = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.number().int(), values: resourceInput }).parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const [row] = await db
      .update(resources)
      .set({
        section: data.values.section,
        title: data.values.title,
        description: data.values.description,
        image: data.values.image || null,
        fileUrl: data.values.fileUrl || null,
        sortOrder: data.values.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(resources.id, data.id))
      .returning();
    return row;
  });

export const deleteResource = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.number().int() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();
    await db.delete(resources).where(eq(resources.id, data.id));
    return { ok: true } as const;
  });

export type Resource = typeof resources.$inferSelect;
