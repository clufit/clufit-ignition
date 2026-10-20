# Clufit Ignition

Build a multi-page website for CLUFIT, a fitness community brand based in the USA. Phase 1 goal: grow a community and capture newsletter emails. The site must be bold, strong and HIGHLY interactive, with many animations — but fast and SEO-friendly.

== BRAND ==

Values: Commit. Challenge. Progress.

Tagline: "Nobody trains alone."

Voice: a demanding training partner. Short, punchy sentences, imperative verbs ("Commit. Show up. Push."). No emojis. Avoid clichés like "journey" or "best version of yourself". All copy in US English.

== VISUAL STYLE ==

Inspired by gritty, high-contrast gym websites: black backgrounds, black & white photography, diagonal section cuts, huge condensed uppercase headlines.

- Colors: 

  - Black #0A0A0A (main background)

  - Strong gray #1A1A1A (secondary backgrounds, cards)

  - Light gray #E5E5E5 (alternate light sections, text on dark)

  - Red #E10600 (primary accent: buttons, highlights, hover states — use sparingly)

  - Light blue #4FC3F7 (secondary accent: progress, data, small details)

- Typography:

  - Headings: Trade Gothic Bold Condensed No. 20 style. Use "Oswald" (700) from Google Fonts as the web font. Always UPPERCASE, very large, tight letter-spacing.

  - Body: Helvetica style. Use font stack "Helvetica Neue", Helvetica, Arial, sans-serif.

- Photos: black & white only, gritty, high contrast, people training (ideally in pairs). Use Unsplash placeholders converted to grayscale via CSS. NEVER use photos of famous athletes.

- Sections separated by diagonal/angled cuts (clip-path), not straight lines.

== NAVBAR ==

Logo "CLUFIT" on the left. Links: Home, Journal, Resources, About us, Contact. Red button "JOIN THE CLUB" on the right (scrolls to hero email form / opens newsletter modal).

- Transparent over the hero, turns solid black with blur on scroll; hides on scroll down, shows on scroll up.

- Links: animated red underline on hover.

- Mobile: hamburger opens a FULLSCREEN black menu with giant condensed uppercase links stacked vertically, staggered slide-in animation, social icons and small text at the bottom right, close "X" top right.

== HOME PAGE SECTIONS ==

1. HERO

- Fullscreen B&W photo of two people training together, dark overlay, subtle slow zoom (Ken Burns) + parallax on scroll.

- Headline: "NOBODY TRAINS ALONE." — letters animate in with a hard, punchy stagger (like a rep).

- Subline: "Join the club. Weekly training, nutrition and mindset intel — straight to your inbox."

- Email input + red button "JOIN THE CLUB". On submit: success state "You're in. Show up." 

- Small scroll indicator animated at the bottom.

2. WHO WE ARE

- Headline: "WE'RE NOT A GYM. WE'RE A CLUB."

- Short paragraph: Clufit is a community for people who train with purpose — and train better together.

- Three columns: COMMIT / CHALLENGE / PROGRESS, each with a big number (01, 02, 03), one-line description, and a thin red line that draws in on scroll.

- Light gray background (#E5E5E5) with black text for contrast, diagonal cuts top and bottom.

3. JOURNAL INTRO — "STRAIGHT FROM THE TOP"

- Subline: "What the best are doing right now. Training, nutrition, news."

- 3 slanted/skewed image cards (parallelogram shape) showing the latest Journal articles: B&W image, category tag in red, title, "READ MORE" link with animated arrow.

- Cards: hover lifts, image goes from grayscale to slight color, subtle 3D tilt following the cursor.

- Button: "READ THE JOURNAL".

4. RESOURCES INTRO — "TRAIN SMARTER. FREE."

- Subline: "Programs, calculators and guides built to make you better."

- 3 cards: PROGRAMS (free training plans), CALCULATORS (macros, 1RM, calories), GUIDES (downloadable PDFs).

- Icons animate on hover, cards have red border reveal on hover.

- Button: "EXPLORE RESOURCES".

5. COMMUNITY STRIP — "#CLUFITDUO"

- Two rows of B&W square images scrolling horizontally in opposite directions (infinite marquee), pausing on hover.

- Text: "Tag your partner. Show the work." with Instagram and TikTok icons.

6. DIAGONAL DIVIDER + CONTACT CTA

- Big diagonal red band divider.

- Headline: "GOT SOMETHING TO SAY?"

- Subline: "Brands, athletes, coaches, members — let's talk."

- Button "CONTACT US" → /contact.

7. FOOTER

- Black. Logo + tagline, newsletter mini form, columns: Navigation, Journal categories, Social (Instagram, TikTok), Legal (Privacy Policy, Terms).

- Giant "CLUFIT" wordmark at the bottom in dark gray outline text.

== OTHER PAGES ==

/journal — Styled like a NEWSPAPER:

- Masthead: "THE CLUFIT JOURNAL" + current date + "Issue No."

- Featured story (large), then grid of latest articles, "Trending" sidebar.

- Category filters: All, Training, Nutrition, Habits & Mindset, Recovery, Athletes. Each category must be its own route (/journal/training, etc.), not just a JS filter.

- Create 6 placeholder articles.

/journal/:slug — Article template:

- Red reading progress bar at top, title, category, author, date, reading time, table of contents, body, inline newsletter CTA box mid-article, "Try this with your partner" highlight box, FAQ section, related articles, breadcrumbs.

- Keep animations light on this page (fast loading).

/resources — Grid of Programs, Calculators, Guides. Build one working interactive calculator (1RM calculator). Guides require email to download (newsletter gate).

/about — Manifesto page: big typographic statements revealed on scroll, story of Clufit, values.

/contact — Contact form (name, email, reason dropdown: Partnership, Athlete, Press, Other, message) + social links.

== ANIMATION & INTERACTION ==

- Custom cursor on desktop: small red dot that grows and shows "VIEW" / "JOIN" over interactive elements. Disabled on touch devices.

- Scroll-triggered reveals on every section (fade + slide up, staggered), fast and snappy (0.4–0.6s), never floaty.

- Page transitions: fullscreen black diagonal wipe between routes.

- Animated number counters where numbers appear.

- Buttons: fill animation from left in red on hover.

- Respect prefers-reduced-motion.

== SEO & PERFORMANCE ==

- Semantic HTML (one H1 per page, proper H2/H3), unique title + meta description + Open Graph tags per page and per article (react-helmet-async).

- Clean URLs, sitemap.xml, robots.txt, Article schema (JSON-LD) on articles, FAQ schema where FAQs exist, breadcrumbs.

- Lazy-load images, optimized sizes, alt text on all images.

- Fully responsive, mobile-first.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c0de4e7c-9104-4cb8-93d2-e5dce7c3a7c3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
