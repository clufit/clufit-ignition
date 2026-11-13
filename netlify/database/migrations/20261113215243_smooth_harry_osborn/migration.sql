CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY,
	"window_start" timestamp DEFAULT now() NOT NULL,
	"count" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD COLUMN "source" text DEFAULT 'footer' NOT NULL;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD COLUMN "consented_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD COLUMN "unsubscribe_token" text;--> statement-breakpoint
UPDATE "newsletter_subscribers" SET "unsubscribe_token" = gen_random_uuid()::text WHERE "unsubscribe_token" IS NULL;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ALTER COLUMN "unsubscribe_token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD COLUMN "unsubscribed_at" timestamp;--> statement-breakpoint
ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_subscribers_unsubscribe_token_key" UNIQUE("unsubscribe_token");