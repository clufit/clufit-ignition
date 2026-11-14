import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { unsubscribeNewsletter } from "@/lib/newsletter.server";

export const Route = createFileRoute("/unsubscribe")({
  validateSearch: z.object({ token: z.string().optional() }),
  head: () => ({ meta: [{ title: "Unsubscribe — CLUFIT" }] }),
  component: Unsubscribe,
});

function Unsubscribe() {
  const { token } = Route.useSearch();
  const [state, setState] = useState<"pending" | "done" | "error">("pending");

  useEffect(() => {
    if (!token) { setState("error"); return; }
    unsubscribeNewsletter({ data: { token } })
      .then((res) => setState(res.ok ? "done" : "error"))
      .catch(() => setState("error"));
  }, [token]);

  return (
    <div className="page legal-page">
      <header className="page-hero">
        <p className="kicker">NEWSLETTER</p>
        <h1>UNSUBSCRIBE</h1>
      </header>
      <section>
        {state === "pending" && <p>Working on it…</p>}
        {state === "done" && <p>You're off the list. You won't get any more emails from CLUFIT. You can rejoin anytime from the homepage.</p>}
        {state === "error" && <p>We couldn't find that subscription. If you keep getting emails, use the <a href="/contact">Contact page</a> and we'll remove you by hand.</p>}
      </section>
    </div>
  );
}
