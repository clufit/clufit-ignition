import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";
import { db } from "../../db/index";
import { contactMessages, journalArticles, newsletterSubscribers, resources } from "../../db/schema";
import { requireAdminSession } from "./admin-auth.server";

export const getDashboardSummary = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  const [subscriberRows, articleRows, resourceRows, unreadRows] = await Promise.all([
    db.select({ value: count() }).from(newsletterSubscribers),
    db.select({ value: count() }).from(journalArticles),
    db.select({ value: count() }).from(resources),
    db.select({ value: count() }).from(contactMessages).where(eq(contactMessages.read, false)),
  ]);
  return {
    subscribers: subscriberRows[0]?.value ?? 0,
    articles: articleRows[0]?.value ?? 0,
    resources: resourceRows[0]?.value ?? 0,
    unreadMessages: unreadRows[0]?.value ?? 0,
  };
});
