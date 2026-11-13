import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — CLUFIT" },
      { name: "description", content: "The terms that govern your use of the CLUFIT website." },
      { property: "og:title", content: "Terms of Use — CLUFIT" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="page legal-page">
      <header className="page-hero">
        <p className="kicker">LEGAL</p>
        <h1>TERMS OF USE</h1>
        <p>Last updated: November 13, 2026</p>
      </header>

      <section>
        <p>
          These Terms of Use ("Terms") govern your use of clufit.app (the "Site"), operated by
          CLUFIT. By using the Site, you agree to these Terms. If you don't agree, please don't
          use the Site.
        </p>

        <h2>1. Who we are</h2>
        <p>CLUFIT is a non-profit training community built around free content — articles, programs, calculators and guides. We are not a gym, a medical provider, a supplement brand, or a retailer.</p>

        <h2>2. No affiliation or endorsement</h2>
        <p>
          CLUFIT does not commercialize, sell, or run advertising campaigns using the name, image
          or likeness of any fitness influencer, athlete or content creator. Any photo of people
          training on this Site is used for illustrative purposes only and does not imply that
          the person pictured endorses, sponsors or is affiliated with CLUFIT. If you believe your
          image is used on this Site without permission, contact us through the <a href="/contact">Contact page</a> and we will remove it promptly.
        </p>

        <h2>3. Not medical advice</h2>
        <p>
          Training programs, calculators, guides and articles on this Site are for general
          informational and educational purposes only. They are not medical advice and are not a
          substitute for professional medical or health guidance. Talk to a qualified healthcare
          provider before starting any training, nutrition or exercise program, especially if you
          have an existing health condition. You use this content, and train, at your own risk.
        </p>

        <h2>4. Intellectual property</h2>
        <p>The CLUFIT name, logo, and the content we publish (articles, graphics, copy, programs) are owned by CLUFIT or used with permission. You may read and share links to our content; you may not republish, resell, or present it as your own without our written permission.</p>

        <h2>5. Acceptable use</h2>
        <p>Don't misuse the Site: no automated scraping or spamming our forms, no attempting to access accounts or data that aren't yours, no uploading harmful code, and no using the contact or newsletter forms for anything other than their intended purpose.</p>

        <h2>6. No warranty</h2>
        <p>The Site and its content are provided "as is", without warranties of any kind, express or implied. We don't guarantee the Site will be uninterrupted, error-free, or that any training result will be achieved.</p>

        <h2>7. Limitation of liability</h2>
        <p>To the fullest extent permitted by law, CLUFIT is not liable for any indirect, incidental or consequential damages arising from your use of the Site, including any injury related to following training content published here.</p>

        <h2>8. Changes</h2>
        <p>We may update these Terms as the Site evolves (for example, when Phase 2 adds shipping, returns or payments for physical products). Continued use of the Site after a change means you accept the updated Terms.</p>

        <h2>9. Governing law</h2>
        <p>These Terms are governed by the laws of the United States and the state in which CLUFIT operates, without regard to conflict-of-law rules. <em>(Placeholder — confirm the specific state once CLUFIT's registered business address is finalized.)</em></p>

        <h2>10. Contact</h2>
        <p>Questions about these Terms? Reach us through the <a href="/contact">Contact page</a>.</p>
      </section>
    </div>
  );
}
