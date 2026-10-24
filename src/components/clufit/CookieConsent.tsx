import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "clufit-cookie-consent";

function setConsentCookie(value: "accepted" | "declined") {
  try {
    document.cookie = `clufit_cookie_consent=${value}; max-age=31536000; path=/; samesite=lax`;
    localStorage.setItem(STORAGE_KEY, value);
  } catch { /* storage unavailable */ }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let answered = true;
    try { answered = Boolean(localStorage.getItem(STORAGE_KEY)); } catch { /* storage unavailable */ }
    if (!answered) setVisible(true);
  }, []);

  function respond(value: "accepted" | "declined") {
    setConsentCookie(value);
    setVisible(false);
  }

  if (!visible) return null;
  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <p>We use cookies to run this site and understand how it's used. Accept or decline — your call.</p>
      <div className="cookie-actions">
        <Button variant="clufitOutline" onClick={() => respond("declined")}>DECLINE</Button>
        <Button variant="clufit" onClick={() => respond("accepted")}>ACCEPT</Button>
      </div>
    </div>
  );
}
