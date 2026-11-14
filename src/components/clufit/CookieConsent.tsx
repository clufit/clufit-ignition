import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const COOKIE_CONSENT_STORAGE_KEY = "clufit-cookie-consent";
export const COOKIE_CONSENT_EVENT = "clufit:cookie-consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "clufit:open-cookie-settings";
const STORAGE_KEY = COOKIE_CONSENT_STORAGE_KEY;

/** Reopens the banner so a visitor can change a choice they already made (footer "Cookie Settings" link). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}

function hasGlobalPrivacyControl() {
  try {
    return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
  } catch { return false; }
}

function setConsentCookie(value: "accepted" | "declined") {
  try {
    document.cookie = `clufit_cookie_consent=${value}; max-age=31536000; path=/; samesite=lax`;
    localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: value }));
  } catch { /* storage unavailable */ }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let answered = true;
    try { answered = Boolean(localStorage.getItem(STORAGE_KEY)); } catch { /* storage unavailable */ }
    if (!answered) {
      // A browser sending the Global Privacy Control signal is an opt-out request on its own —
      // honor it immediately instead of still prompting (required for CT residents from Jan 2026).
      if (hasGlobalPrivacyControl()) setConsentCookie("declined");
      else setVisible(true);
    }
    const reopen = () => setVisible(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  function respond(value: "accepted" | "declined") {
    setConsentCookie(value);
    setVisible(false);
  }

  if (!visible) return null;
  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <p>We use cookies to run this site and understand how it's used. Accept or decline — your call. See our <a href="/privacy#cookies">Cookie Policy</a>.</p>
      <div className="cookie-actions">
        <Button variant="clufitOutline" onClick={() => respond("declined")}>DECLINE</Button>
        <Button variant="clufit" onClick={() => respond("accepted")}>ACCEPT</Button>
      </div>
    </div>
  );
}
