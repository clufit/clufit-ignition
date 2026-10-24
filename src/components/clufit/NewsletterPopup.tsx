import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "./NewsletterForm";

export const NEWSLETTER_POPUP_STORAGE_KEY = "clufit-newsletter-popup";

export function rememberNewsletterPopup(value: "dismissed" | "subscribed") {
  try { localStorage.setItem(NEWSLETTER_POPUP_STORAGE_KEY, value); } catch { /* storage unavailable */ }
}

export function NewsletterPopup({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  function dismiss() { onOpenChange(false); rememberNewsletterPopup("dismissed"); }
  function subscribed() { rememberNewsletterPopup("subscribed"); }

  if (!open) return null;
  return (
    <div className="modal-backdrop newsletter-popup" role="dialog" aria-modal="true" aria-labelledby="newsletter-popup-title">
      <div className="gate-modal">
        <Button variant="iconDark" size="icon" onClick={dismiss} aria-label="Close">
          <X />
        </Button>
        <span className="kicker">DON'T TRAIN BLIND</span>
        <h2 id="newsletter-popup-title">GET THE INTEL.</h2>
        <p>Weekly training, nutrition and mindset intel — straight to your inbox. No spam, ever.</p>
        <NewsletterForm onSuccess={subscribed} />
      </div>
    </div>
  );
}
