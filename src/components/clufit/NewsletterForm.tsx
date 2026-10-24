import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterForm({ compact = false, outline = false, onSuccess }: { compact?: boolean; outline?: boolean; onSuccess?: () => void }) {
  const [done, setDone] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setDone(true); onSuccess?.(); }
  if (done) return <p className="newsletter-success" role="status">YOU'RE IN. SHOW UP.</p>;
  return (
    <form className={compact ? "newsletter newsletter-compact" : "newsletter"} onSubmit={submit}>
      <label className="sr-only" htmlFor={compact ? "footer-email" : "club-email"}>Email address</label>
      <input id={compact ? "footer-email" : "club-email"} name="email" type="email" required placeholder="YOUR EMAIL" autoComplete="email" />
      <Button type="submit" variant={outline ? "clufitOutline" : "clufit"}>JOIN THE CLUB <ArrowRight /></Button>
    </form>
  );
}
