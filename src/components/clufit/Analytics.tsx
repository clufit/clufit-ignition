import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_STORAGE_KEY } from "./CookieConsent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID = import.meta.env["VITE_GA_MEASUREMENT_ID"] as string | undefined;

function loadGtag(id: string) {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  script.async = true;
  document.head.appendChild(script);
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false });
}

/** Loads GA4 only after cookie consent is accepted, and tracks SPA route changes as page_view events (gtag's own page_view only fires on a hard load). Renders nothing. */
export function Analytics() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!GA_ID) return;
    const id = GA_ID;
    function tryLoad() {
      let consent: string | null = null;
      try { consent = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY); } catch { /* storage unavailable */ }
      if (consent === "accepted" && !loadedRef.current) {
        loadedRef.current = true;
        loadGtag(id);
        window.gtag?.("event", "page_view", { page_path: path });
      }
    }
    tryLoad();
    window.addEventListener(COOKIE_CONSENT_EVENT, tryLoad);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, tryLoad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loadedRef.current) window.gtag?.("event", "page_view", { page_path: path });
  }, [path]);

  return null;
}
