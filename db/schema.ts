import { pgTable, serial, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial().primaryKey(),
  email: text().notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const journalArticles = pgTable("journal_articles", {
  id: serial().primaryKey(),
  slug: text().notNull().unique(),
  title: text().notNull(),
  deck: text().notNull(),
  body: text().notNull(),
  category: text().notNull(),
  image: text().notNull(),
  author: text().notNull(),
  readTime: text("read_time").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const resources = pgTable("resources", {
  id: serial().primaryKey(),
  section: text().notNull(),
  title: text().notNull(),
  description: text().notNull(),
  image: text(),
  fileUrl: text("file_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  reason: text().notNull(),
  message: text().notNull(),
  read: boolean().default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
