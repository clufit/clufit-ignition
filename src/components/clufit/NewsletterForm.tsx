import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/lib/newsletter.server";

export function NewsletterForm({ compact = false, outline = false, source = "footer", cta = "JOIN THE CLUB", successMessage = "YOU'RE IN. SHOW UP.", onSuccess }: { compact?: boolean; outline?: boolean; source?: "hero" | "footer" | "popup" | "about" | "article" | "resources"; cta?: string; successMessage?: string; onSuccess?: () => void }) {
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email");
    const website = form.get("website");
    setPending(true); setError(null);
    try {
      const res = await subscribeNewsletter({ data: { email, source, website } });
      if (!res.ok) throw new Error(res.error);
      setDone(true); onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally { setPending(false); }
  }
  if (done) return <p className="newsletter-success" role="status">{successMessage}</p>;
  return (
    <>
      <form className={compact ? "newsletter newsletter-compact" : "newsletter"} onSubmit={submit}>
        <label className="sr-only" htmlFor={compact ? "footer-email" : "club-email"}>Email address</label>
        <input id={compact ? "footer-email" : "club-email"} name="email" type="email" required placeholder="YOUR EMAIL" autoComplete="email" aria-invalid={error ? true : undefined} />
        <input name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
        <Button type="submit" variant={outline ? "clufitOutline" : "clufit"} disabled={pending}>{pending ? "JOINING…" : <>{cta} <ArrowRight /></>}</Button>
      </form>
      {error && <p className="newsletter-error" role="alert">{error}</p>}
      <p className="newsletter-legal">By subscribing you agree to our <a href="/privacy">Privacy Policy</a>.</p>
    </>
  );
}
