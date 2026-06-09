# AIESEC in Deutschland — B2B Website · Build Status

> Working notes for future sessions. The full spec is in
> `AIESEC_CLAUDE_CODE_HANDOFF_v2.md`. This file tracks what's actually built and
> what's next. Design reference: `Copy of [BD] B2B Webseite.pdf` (read it before
> any new page). Guiding principle from the owner: **stay faithful to the
> reference, just lift the craft. Don't over-design.**

## Stack & deploy
- Pure HTML + CSS + vanilla JS. No frameworks, no build step. Open files directly.
- One shared stylesheet `assets/css/style.css`, one shared script `assets/js/main.js`.
  Sub-pages link them with `../` (e.g. `../assets/css/style.css`).
- Host: GitHub Pages → `unternehmen.aiesec.de`.
- **Forms: Web3Forms.** Access key `f0ba8c58-9857-47f0-b545-d6d283ebc418`.
  Every contact form posts to `https://api.web3forms.com/submit` with that key,
  a per-page `subject`, and (on sub-pages) a hidden `interest`/`profil` field so
  leads are tagged by page. `main.js` intercepts submit → fetch → green success state.

## Design system (already built — reuse, don't reinvent)
Defined in `assets/css/style.css`:
- **Tokens** at `:root` — brand blue `#037EF3`, `--blue-deep #0A1628`, `--teal #00C49A`,
  neutrals, layered `--shadow*`, `--radius*`, `--trans`. DM Sans everywhere; Dancing
  Script only for "Developing young leaders since 1948".
- **Icons:** inline SVG line-icons with class `.icon` (NO emoji anywhere). The `.icon`
  class sets stroke/fill — just drop in `<svg class="icon" viewBox="0 0 24 24">…</svg>`.
- **Reusable blocks:** `.btn`(+variants), `.section-overline`, `.section-title`,
  `.section-intro`, `.hero`(+`.hero--sub` shorter), hero word-reveal (`.hero-title .word`
  with staggered `animation-delay`), `.stats-grid`/`.stat-card` (animated counters via
  `data-target`), `.feature-grid`/`.feature-card`, `.process-layout`+`.steps`/`.step`,
  `.quote-card` (dark text testimonial), `.stories-grid`/`.story-card`, `.partners-logos`,
  `.section-dark` contact, `.footer`, `.cta-banner`.
- **Animation:** add `animate-up|left|right` + optional inline `animation-delay`;
  `main.js` IntersectionObserver adds `.in-view`. `prefers-reduced-motion` fully handled.
- **Scroll progress bar:** `<div class="scroll-progress" id="scrollProgress">` at top of `<body>`.

## DONE
- **`index.html` (homepage)** — fully rebuilt & polished. Navbar, cinematic hero
  (word-reveal), "Was ist AIESEC" (blue, 1948 script), 8-stat band, Standorte pills,
  4 event cards, CTA banner, 4 partnership value cards + DHL testimonial image,
  partner logo wall, dark contact form, footer. Verified desktop + narrow, zero
  horizontal overflow.
- **`global-talent/index.html`** (§5.1 Internationale Praktikant:innen) — hero,
  "Warum Global Talent?" (3 feature cards), "Recruiting in 4 Schritten" (numbered
  steps + side quote card), CTA banner, "Unser Netzwerk" (4 stats), "Erfolgsgeschichten"
  (2 story cards), partner wall, contact form. Verified.
- **`hochschulmarketing/index.html`** (§5.2) — hero, 3-Mio.-Studierende lead,
  "AIESEC Konferenzen" with 3 pricing tiers (Local/Regional[featured]/National) +
  **embedded YouTube video** (`.video-embed`, responsive 16:9 iframe, `youtu.be/h96R65tD08k?start=20`)
  where the fake placeholder was, region-grouped Standorte (Nord/West/Mitte&Ost/Süd),
  blue stat band (55.000+/3 Mio.+/75+/NPS 72), 2 testimonials (#2 now uses
  `partner-db-y2b.jpg`), Y2B partner wall, dark
  "Nationale Partnerschaft" CTA **now a text+photo split** (`partner-huawei-national.jpg`),
  contact form. Verified.
- **`anmeldung.html` (Partner-Anmeldung / registration page)** — replicates the old
  `/unternehmen/anmeldung` endpoint in the new template. Hero (MeCo community photo) +
  two-column section: credibility aside (MeCo photo, trust checklist, DAAD / Auswärtiges
  Amt / Transparente-Zivilgesellschaft logos) and the full form. Fields match the old
  site: Unternehmen, Website, Vorname, Nachname, E-Mail, Telefon, **Produktinteresse**
  (Internationale Praktikant:innen / Hochschulmarketing & Recruiting / Talentbindung /
  CSR / National Fördernder Beirat), **Stadt** (24 Standorte), **Quelle** (Wie gehört),
  2 consent checkboxes (contact opt-in pre-checked, Datenschutz required). Posts to
  Web3Forms (`subject="Partner-Anmeldung …"`), `id="contactForm"` so `main.js` intercepts.
  **Decision: kept as a dedicated page** (not a homepage section) — heavy 10-field B2B
  form, linkable/trackable conversion goal; light contact forms on each page stay for
  quick inquiries. All `nav-cta` "Jetzt Partner werden" buttons (home + 3 sub-pages)
  now point to `anmeldung.html`. New consent-checkbox CSS in `style.css` (`.form-consent`,
  `.trust-*`, `.anmeldung-*`, `.event-photo`, `.dark-cta-split`).
  **Note:** `--gray-300`/`--gray-400` are NOT defined in `:root` (only 50/100/200/500/700/900)
  — using them yields an invisible border. Use a literal hex or a defined token.
- **`talentbindung/index.html`** (§5.3 GVP) — hero, 3 pain→Lösung cards, "Wie
  funktioniert das GVP?" (5-step flow + Broschüre CTA), 2 program cards (GVP +
  Global Volunteer, external link to aiesec.de/volunteer), CTA banner, 4 network
  stats, 2 stories, "Partnerländer & Projekte" (6 cards: map-pin tile + SDG badge —
  NOT flag emoji, which break on Windows), contact form. Verified.
- **All 4 contact forms wired to Web3Forms** (key `f0ba8c58-…`) with per-page
  `subject` + hidden `interest`/`profil`/`paket`/`teamgroesse` so leads are tagged.
- **Images optimized** — all photos resized/compressed (~47 MB → ~2.6 MB shipped).
  Originals backed up in `assets/images/_originals/` (**do NOT deploy this folder**).
  Latest batch wired in: `event-y2b-booth.jpg` (real Y2B career-fair booth → homepage
  Y2B event card, has a Tesla banner in shot), `partner-db-y2b.jpg` (DB rep at the
  Germany Y2B Forum banner → hochschulmarketing), `partner-huawei-national.jpg`
  ("Premium National Partner" / Huawei → hochschulmarketing dark CTA),
  `community-meco.jpg` (big MeCo group photo → anmeldung hero + aside). Source folders
  `assets/images/to be used as well in the  showcaing/` and `original anmeldung endpoint/`
  are raw drops — **do NOT deploy them**.
- **Logos fixed** — MLP, Ventuseo, Zoho, DB and the **AIESEC logo** all shipped with
  black backgrounds; black was keyed to transparent at the image level. All render
  clean full-color on white cards and the dark footer.
- **Nav/footer:** CSR links point to `#kontakt` (no CSR section exists yet). On
  sub-pages, top-level nav points back to home with `../#…`; `Kontakt`/`Partnerschaften`
  are local anchors.
- **Internal page links use explicit `index.html`** (e.g. `global-talent/index.html`,
  not `global-talent/`). Bare folder links don't open under local `file://` preview —
  the owner reviews locally, so always append `index.html`. Fixed across all 5 pages
  (nav dropdown, homepage Standorte pills, footer).

## DONE — premium interaction layer
Cursor-follow spotlight + subtle 3D tilt on cards (`.fx-card`, auto-applied via
`main.js` to stat/feature/event/package/project/story/logo cards), magnetic buttons,
button shine sweep, refined blur-in reveals, hero pointer-parallax (bg keeps
scale(1.06) overscan so it never gaps). All `prefers-reduced-motion` + touch guarded.

**High-end polish sprinkle (2026-06-09)** — additive only, no asset/content changes:
- **Film grain** — `.grain-overlay` (fixed, `mix-blend:overlay`, opacity .20, SVG `feTurbulence`
  data-URI) appended to `<body>` by `main.js`. Filmic over imagery/dark, ~invisible on white.
  Hidden under `prefers-reduced-motion`. (data: URI allowed by CSP `img-src data:`.)
- **Back-to-top** — `.to-top` button injected by `main.js`, shows after 600px scroll (rAF-throttled).
- **Partner-logo wall** — JS adds `.animate-up` + staggered `animationDelay`, revealed by a dedicated
  IntersectionObserver (logos were static before).
- **Nav underline** → blue→teal gradient; **`.partner-showcase figure`** lift+glow on hover.
- Owner directive: *high-end, catchy, professional* — but still **don't over-design** (subtle > flashy).

## DONE — fixes & load polish
- **Dropdown hover bug fixed** — the nav "Kooperationsmöglichkeiten" menu had a gap
  that closed it before you could reach the items. Fixed with an invisible `::before`
  bridge over the gap, an 8px (was 12px) offset, a `.22s` close delay, and
  `:focus-within` (keyboard). All in `.dropdown-menu` CSS.
- **Page-load entrance** — navbar drops in (`@keyframes navDrop`), hero image focuses
  in from a soft blur (`@keyframes heroFocus`), hero content cascades. Reduced-motion safe.

## DONE — QA, security & honesty pass (2026-06-08)
- **Fabricated testimonials REMOVED.** A prior session invented customer quotes + names
  (Anna Klein, Markus Roth, Julia Krämer, Sandra Meyer, Thomas Berger, Claudia Wagner,
  David Lang). These were NOT from any source. Removed the 3 standalone testimonial
  sections (`#stimmen` on hochschulmarketing, `#erfolge` on global-talent & talentbindung)
  and converted global-talent's in-process quote card to an honest non-attributed CTA card
  (`.quote-card.is-cta`). See DECISIONS: never fabricate testimonials/quotes/stats.
  (Side effect: resolved the `about-1.jpg` double-use; freed `partner-db-y2b.jpg` &
  `event-y2b-networking.jpg` for reuse.)
- **Tesla added** to partner walls (home, global-talent, hochschulmarketing) —
  `assets/images/logo-tesla.png` (red, square; sits slightly smaller than wordmark logos).
- **YouTube embed** = click-to-load facade (`.video-facade` in `main.js`), loads
  `youtube-nocookie.com` only on click. Fixes "error 153" (player rejects `null` origin
  on local `file://` preview) and lazy-loads. Poster from `i.ytimg.com`.
- **CSR links fixed** — were local `#kontakt` on sub-pages (so CSR "went to GVP"); now all
  point to homepage contact (`../index.html#kontakt`).
- **Logo / "Für Unternehmen" home links fixed** — sub-pages used bare `../` (opens a dir
  listing under `file://`); now `../index.html`.
- **OWASP pass:** CSP + `referrer` `<meta>` on all 5 pages (script/style/img/font/frame/
  connect/form-action allowlisted; blocks injected scripts). No inline JS/handlers; all
  `target=_blank` carry `rel=noopener`. **Limit:** GitHub Pages can't send real HTTP
  headers — `X-Frame-Options`/HSTS need a proxy (Cloudflare) in front for full hardening.
- **Link validator** (regex sweep of every href/src/anchor across 5 pages) → all resolve.
- **Deploy artifacts created:** `.gitignore` (excludes originals/raw drops/reference docs/
  root screenshots), `.nojekyll` (plain static serving), `CNAME` (`unternehmen.aiesec.de`).
  Repo not yet `git init`-ed.

## DECISIONS (settled — do not relitigate)
- **NEVER fabricate content.** No invented testimonials, customer names, quotes, logos, or
  statistics. Social proof must come from the owner (real, with permission) or not appear.
  This caused a credibility incident on 2026-06-08; do not repeat.
- **Follow the PDF reference exactly.** Owner chose to keep the homepage and overall
  flow faithful to `Copy of [BD] B2B Webseite.pdf`. The reference + flow is the
  ultimate factor — polish/effects on top are welcome, new sections are not.
- **No "Unser Ansatz"/"our way" showcase section** was added (owner picked option B).
  The "how we work" story lives in the sub-pages' existing process sections
  (`.steps`). Do not add it to the homepage unless the owner explicitly reverses this.

## NEXT (in priority order)
1. **Deploy** — deploy artifacts ready (`.gitignore`, `.nojekyll`, `CNAME`). Just need
   `git init` + first commit (not a repo yet) → push to owner's GitHub → enable Pages →
   point `unternehmen.aiesec.de` DNS (CNAME → `<user>.github.io`). Owner asked to commit
   to their GitHub before the talentbindung slice.
2. **NEXT SLICE — talentbindung overhaul + honest social proof** (runs after GitHub commit).
   Scope:
   - Add back **real, owner-supplied testimonials** (the fabricated ones were removed
     2026-06-08) across the sub-pages — real names/roles/quotes WITH permission, or real
     headshots. Until then the pages ship without testimonials (honest).
   - Source **distinct abroad / volunteer-project photos** for talentbindung (the stories
     section that double-used `about-1.jpg` is gone; the page now needs fresh GVP imagery).
   - Give the 6 "Partnerländer & Projekte" cards **real project imagery** if photos
     arrive (today they're map-pin tiles + SDG badges — NOT flag emoji, which break on
     Windows; keep that constraint).
   - Audit copy/flow once more vs. the GVP narrative; no PDF reference exists for the
     sub-pages, so keep current wording unless owner provides new text.
   - Carryover assets to slot in where they fit: `partner-zoho-booth.jpg`,
     `event-companyday-db.jpg`. Still missing a real **Tesla** logo (a Tesla banner is
     visible inside `event-y2b-booth.jpg` as a stopgap).
3. Optional, only if owner asks: `/blog/index.html` placeholder; the Y2B Forum /
   partner-jobs page (reference p.6–7 — needs per-partner photos + job-listing data).

## Verify a page (headless Chrome, no extra tooling)
Chrome on Windows clamps the min viewport to ~484px, so true mobile can't be shot
locally — but `scrollWidth ≤ innerWidth` at 484/752/1424 confirms no overflow.
Heroes use `min-height:vh`, so for a full-page screenshot, inject a preview style
capping `.hero{min-height:640px}` and forcing `.animate-*{opacity:1}`, shoot at a tall
window (e.g. `--window-size=1440,5800`), then slice the PNG to read it.

## Don'ts
- Don't deviate from the reference layout/feel without asking.
- Don't reintroduce emoji icons — use `.icon` SVGs.
- Don't hard-delete or overwrite originals in `_originals/`.
- Don't add new external dependencies. Pure HTML/CSS/JS only.
