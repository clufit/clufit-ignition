import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, isNotNull, lte } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db/index";
import { journalArticles } from "../../db/schema";
import { requireAdminSession } from "./admin-auth.server";
import { categories } from "./clufit-data";

const ARTICLE_CATEGORIES = categories.filter((c) => c !== "All") as [string, ...string[]];

const urlOrPath = z.string().trim().min(1).refine(
  (v) => /^https?:\/\//.test(v) || v.startsWith("/"),
  "Enter a full URL (https://...) or a site path starting with /",
);

const articleInput = z.object({
  slug: z.string().trim().min(1).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  title: z.string().trim().min(1),
  deck: z.string().trim().min(1),
  body: z.string().trim().min(1),
  category: z.enum(ARTICLE_CATEGORIES),
  image: urlOrPath,
  author: z.string().trim().min(1),
  readTime: z.string().trim().min(1),
  published: z.boolean(),
});

function publishedWhere() {
  return and(isNotNull(journalArticles.publishedAt), lte(journalArticles.publishedAt, new Date()));
}

export const listPublishedArticles = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(journalArticles).where(publishedWhere()).orderBy(desc(journalArticles.publishedAt));
});

export const listArticlesByCategory = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ category: z.string() }).parse(data))
  .handler(async ({ data }) => {
    return db
      .select()
      .from(journalArticles)
      .where(and(publishedWhere(), eq(journalArticles.category, data.category)))
      .orderBy(desc(journalArticles.publishedAt));
  });

export const getArticleBySlug = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const [article] = await db
      .select()
      .from(journalArticles)
      .where(and(eq(journalArticles.slug, data.slug), publishedWhere()))
      .limit(1);
    return article ?? null;
  });

export const listAllArticlesAdmin = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  return db.select().from(journalArticles).orderBy(desc(journalArticles.createdAt));
});

export const createArticle = createServerFn({ method: "POST" })
  .validator((data: unknown) => articleInput.parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const [row] = await db
      .insert(journalArticles)
      .values({
        slug: data.slug,
        title: data.title,
        deck: data.deck,
        body: data.body,
        category: data.category,
        image: data.image,
        author: data.author,
        readTime: data.readTime,
        publishedAt: data.published ? new Date() : null,
      })
      .returning();
    return row;
  });

export const updateArticle = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.number().int(), values: articleInput }).parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const [existing] = await db.select().from(journalArticles).where(eq(journalArticles.id, data.id)).limit(1);
    if (!existing) throw new Error("Article not found.");
    const publishedAt = data.values.published ? (existing.publishedAt ?? new Date()) : null;
    const [row] = await db
      .update(journalArticles)
      .set({
        slug: data.values.slug,
        title: data.values.title,
        deck: data.values.deck,
        body: data.values.body,
        category: data.values.category,
        image: data.values.image,
        author: data.values.author,
        readTime: data.values.readTime,
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(journalArticles.id, data.id))
      .returning();
    return row;
  });

export const deleteArticle = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.number().int() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();
    await db.delete(journalArticles).where(eq(journalArticles.id, data.id));
    return { ok: true } as const;
  });

export type JournalArticle = typeof journalArticles.$inferSelect;
