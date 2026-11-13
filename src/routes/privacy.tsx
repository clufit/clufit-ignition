import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — CLUFIT" },
      { name: "description", content: "How CLUFIT collects, uses and protects your data, including our cookie policy." },
      { property: "og:title", content: "Privacy Policy — CLUFIT" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="page legal-page">
      <header className="page-hero">
        <p className="kicker">LEGAL</p>
        <h1>PRIVACY POLICY</h1>
        <p>Last updated: November 13, 2026</p>
      </header>

      <section>
        <p>
          This Privacy Policy explains what information CLUFIT ("CLUFIT", "we", "us") collects
          through clufit.app (the "Site"), why we collect it, and the choices you have. CLUFIT is
          a US-based, non-profit fitness community brand — not a gym, store or commercial sponsor
          of any individual athlete, influencer or content creator. By using the Site you agree to
          this policy.
        </p>

        <h2>1. Information we collect</h2>
        <ul>
          <li><strong>Email address</strong> — when you join the newsletter, download a guide, or submit the contact form.</li>
          <li><strong>Contact form details</strong> — name, reason for contact, and your message.</li>
          <li><strong>Cookie and analytics data</strong> — only after you accept cookies: pages viewed, approximate location (city/country), device and browser type, via Google Analytics 4.</li>
          <li><strong>IP address and basic request logs</strong> — collected automatically by our hosting provider (Cloudflare) for security and abuse prevention, independent of cookie consent.</li>
        </ul>

        <h2>2. How we use your information</h2>
        <ul>
          <li>To send the newsletter you signed up for (training, nutrition and mindset content).</li>
          <li>To respond to messages sent through the Contact page.</li>
          <li>To understand how the Site is used and improve it (analytics, only with consent).</li>
          <li>To detect and prevent spam, abuse and automated submissions.</li>
        </ul>
        <p>We do not sell, rent or share your personal data with advertisers, and we do not use it to promote or commercialize any third-party athlete, influencer or content creator's image or likeness.</p>

        <h2 id="cookies">3. Cookies</h2>
        <p>When you first visit, we ask you to accept or decline non-essential cookies. You can change your answer at any time from the footer "Cookie Settings" link. If your browser sends a Global Privacy Control (GPC) signal, we treat that as a decline automatically.</p>
        <table className="legal-table">
          <thead><tr><th>Cookie</th><th>Type</th><th>Purpose</th><th>Duration</th></tr></thead>
          <tbody>
            <tr><td>clufit_cookie_consent</td><td>Essential</td><td>Remembers your cookie choice</td><td>1 year</td></tr>
            <tr><td>clufit-cookie-consent (localStorage)</td><td>Essential</td><td>Remembers your cookie choice on this device</td><td>Until cleared</td></tr>
            <tr><td>clufit-newsletter-popup (localStorage)</td><td>Essential</td><td>Avoids re-showing the signup popup</td><td>Until cleared</td></tr>
            <tr><td>clufit_admin</td><td>Essential</td><td>Keeps staff signed in to the admin dashboard</td><td>7 days</td></tr>
            <tr><td>_ga, _ga_*</td><td>Analytics (only if accepted)</td><td>Google Analytics 4 — traffic and usage measurement</td><td>Up to 2 years</td></tr>
          </tbody>
        </table>

        <h2>4. Who we share data with</h2>
        <p>We don't sell your data. We share it only with the services that run the Site:</p>
        <ul>
          <li><strong>Cloudflare</strong> — hosting and security.</li>
          <li><strong>Neon</strong> — database storage for subscribers and messages.</li>
          <li><strong>Google Analytics 4</strong> — traffic analytics, only after you accept cookies.</li>
        </ul>

        <h2>5. How long we keep your data</h2>
        <p>Newsletter emails are kept until you unsubscribe using the link in any email or the link on this Site. Contact messages are kept as long as needed to respond and for a reasonable record afterward. You can ask us to delete your data sooner — see Section 6.</p>

        <h2>6. Your rights</h2>
        <p>You can ask us, at any time, to:</p>
        <ul>
          <li>Tell you what personal data we hold about you.</li>
          <li>Correct or delete that data.</li>
          <li>Unsubscribe from the newsletter — every subscriber gets a personal unsubscribe link.</li>
        </ul>
        <p>To exercise any of these, use the <a href="/contact">Contact page</a>. We'll respond within a reasonable time, and no later than required by applicable law.</p>

        <h2>7. Children's privacy</h2>
        <p>CLUFIT is not directed at children under 13, and we do not knowingly collect personal information from them. If you believe a child has given us information, contact us and we'll remove it.</p>

        <h2>8. Changes to this policy</h2>
        <p>We may update this policy as the Site evolves. Material changes will be reflected by updating the "Last updated" date above.</p>

        <h2>9. Contact</h2>
        <p>Questions about this policy? Reach us through the <a href="/contact">Contact page</a>.</p>
      </section>
    </div>
  );
}
