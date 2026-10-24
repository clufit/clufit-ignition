import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterForm({ compact = false, outline = false, onSuccess }: { compact?: boolean; outline?: boolean; onSuccess?: () => void }) {
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    setPending(true); setError(null);
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!res.ok) { const body = await res.json().catch(() => null) as { error?: string } | null; throw new Error(body?.error ?? "Something went wrong. Try again."); }
      setDone(true); onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally { setPending(false); }
  }
  if (done) return <p className="newsletter-success" role="status">YOU'RE IN. SHOW UP.</p>;
  return (
    <>
      <form className={compact ? "newsletter newsletter-compact" : "newsletter"} onSubmit={submit}>
        <label className="sr-only" htmlFor={compact ? "footer-email" : "club-email"}>Email address</label>
        <input id={compact ? "footer-email" : "club-email"} name="email" type="email" required placeholder="YOUR EMAIL" autoComplete="email" aria-invalid={error ? true : undefined} />
        <Button type="submit" variant={outline ? "clufitOutline" : "clufit"} disabled={pending}>{pending ? "JOINING…" : <>JOIN THE CLUB <ArrowRight /></>}</Button>
      </form>
      {error && <p className="newsletter-error" role="alert">{error}</p>}
    </>
  );
}
