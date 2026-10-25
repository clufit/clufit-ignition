/**
 * One-off seed for the content that used to live in src/lib/clufit-data.ts and
 * resources.tsx before the admin backend migrated journal articles and
 * resources into the database. Run once with: npx tsx db/seed.ts
 * Requires NETLIFY_DB_URL in the environment (e.g. via .env.local).
 */
import { db } from "./index";
import { journalArticles, resources } from "./schema";

const BODY = [
  "Training advice gets complicated when standards get soft. Strip away the noise and the work becomes obvious: choose the right target, execute with intent, and recover hard enough to do it again.",
  "Before the first rep, decide what success looks like. A session needs a purpose. Strength, speed, volume, or skill. Pick one. Write it down. Build every set around it.",
  "Quality work is repeatable. Keep the movements stable long enough to learn them. Add load when the reps are clean. Stop the set when execution breaks—not when your ego says it should.",
  "The strongest athletes are not constantly searching for novelty. They repeat useful work and pay attention. Keep a simple log. Track load, reps, effort, sleep, and one technical note.",
].join("\n\n");

const ARTICLES = [
  { slug: "strength-without-the-noise", category: "Training", title: "Strength Without the Noise", deck: "The five movements that earn their place in every serious program.", image: "/images/clufit-squat.jpg", readTime: "6 min", author: "Maya Brooks", publishedAt: new Date("2026-09-18") },
  { slug: "eat-for-the-work", category: "Nutrition", title: "Eat for the Work", deck: "Fuel the session in front of you. Recover for the one after it.", image: "/images/clufit-ropes.jpg", readTime: "5 min", author: "Evan Cole", publishedAt: new Date("2026-09-15") },
  { slug: "the-partner-rule", category: "Habits & Mindset", title: "The Partner Rule", deck: "Accountability is not motivation. It is architecture.", image: "/images/clufit-hero.jpg", readTime: "4 min", author: "Nia James", publishedAt: new Date("2026-09-12") },
  { slug: "recovery-is-training", category: "Recovery", title: "Recovery Is Training", deck: "Adaptation happens after the last rep. Treat it that way.", image: "/images/clufit-squat.jpg", readTime: "7 min", author: "Dr. Leo Grant", publishedAt: new Date("2026-09-08") },
  { slug: "built-under-pressure", category: "Athletes", title: "Built Under Pressure", deck: "Three competitors on standards, nerves and showing up anyway.", image: "/images/clufit-ropes.jpg", readTime: "8 min", author: "Clufit Editors", publishedAt: new Date("2026-09-04") },
  { slug: "stop-testing-start-building", category: "Training", title: "Stop Testing. Start Building.", deck: "Why chasing a new max every week keeps you exactly where you are.", image: "/images/clufit-hero.jpg", readTime: "5 min", author: "Marcus Reed", publishedAt: new Date("2026-08-29") },
].map((a) => ({ ...a, body: BODY }));

const RESOURCES = [
  { section: "program", title: "4-Week Strength Base", description: "4 weeks · 3 days/week", image: "/images/clufit-squat.jpg", sortOrder: 0 },
  { section: "program", title: "The Duo Conditioning Block", description: "6 weeks · partner-ready", image: "/images/clufit-ropes.jpg", sortOrder: 1 },
  { section: "program", title: "Run Strong: 5K Support", description: "5 weeks · 2 days/week", image: "/images/clufit-hero.jpg", sortOrder: 2 },
  { section: "guide", title: "The Warm-Up That Earns Its Time", description: "PDF · 12 pages", image: null, sortOrder: 0 },
  { section: "guide", title: "Protein: A Practical Field Guide", description: "PDF · 12 pages", image: null, sortOrder: 1 },
  { section: "guide", title: "Build Your Training Week", description: "PDF · 12 pages", image: null, sortOrder: 2 },
] as const;

async function main() {
  for (const article of ARTICLES) {
    await db.insert(journalArticles).values(article).onConflictDoNothing();
  }
  for (const resource of RESOURCES) {
    await db.insert(resources).values(resource);
  }
  console.log(`Seeded ${ARTICLES.length} articles and ${RESOURCES.length} resources.`);
}

main().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
