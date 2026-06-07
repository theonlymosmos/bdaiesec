# AIESEC in Deutschland — B2B Website · Project Documentation

End-to-end documentation of the build: what the site is, how it's structured,
how it was built, how to maintain it, how it's deployed, and how it's secured.

> **Audience:** the AIESEC team (non-technical owners) and any developer who
> picks this up later. Plain language first, technical detail where it matters.

---

## 1. What this is

A marketing/B2B website for **AIESEC in Deutschland**, aimed at companies, to
present the four cooperation models and capture leads. It is a **static website**
— pure HTML, CSS, and JavaScript with **no framework and no build step**. You can
open any `.html` file directly in a browser and it works.

**Live target:** GitHub Pages → `unternehmen.aiesec.de`
**Design reference:** `Copy of [BD] B2B Webseite.pdf` (kept faithfully; craft and
polish added on top, no invented sections).

### Pages
| Page | File | Purpose |
|------|------|---------|
| Homepage | `index.html` | Brand intro, "Was ist AIESEC", stats, locations, events, partnership value, partner wall, contact |
| Internationale Praktikant:innen | `global-talent/index.html` | Global Talent program (international interns) |
| Hochschulmarketing & Recruiting | `hochschulmarketing/index.html` | On-campus recruiting, conference tiers, Y2B Forum |
| Talentbindung (GVP) | `talentbindung/index.html` | Global Volunteer Program for employee retention |
| Partner-Anmeldung | `anmeldung.html` | Full registration form (the lead-capture funnel) |

---

## 2. Tech stack & architecture

- **HTML5 + CSS3 + vanilla JavaScript.** No React/Vue, no bundler, no npm.
- **One shared stylesheet:** `assets/css/style.css` — all design tokens, components, responsive rules.
- **One shared script:** `assets/js/main.js` — scroll effects, animations, mobile nav, form handling, video facade.
- **Sub-pages** link assets with `../` (e.g. `../assets/css/style.css`).
- **Fonts:** Google Fonts — *DM Sans* (everything) and *Dancing Script* (only the "since 1948" script line).
- **Icons:** inline SVG line-icons (class `.icon`). No emoji anywhere (they render inconsistently on Windows).
- **Forms:** [Web3Forms](https://web3forms.com) — a no-backend form-to-email service.

**Why static?** Fast, free to host, nothing to patch server-side, and trivial to
hand over. The trade-off is no server logic — handled by Web3Forms for forms and
GitHub Pages for hosting.

---

## 3. Project structure

```
aiesec-de-business/
├── index.html                  # Homepage
├── anmeldung.html              # Registration / Anmeldung page
├── global-talent/index.html    # Sub-page
├── hochschulmarketing/index.html
├── talentbindung/index.html
├── assets/
│   ├── css/style.css           # The single stylesheet
│   ├── js/main.js              # The single script
│   └── images/                 # All shipped images (optimized)
│       └── _originals/         # Full-res backups — NOT deployed
├── CNAME                       # Custom domain for GitHub Pages
├── .nojekyll                   # Tells GitHub Pages to serve files as-is
├── .gitignore                  # Keeps heavy/raw files out of the repo
├── CLAUDE.md                   # Internal build log / engineering notes
└── DOCUMENTATION.md            # This file
```

Folders **excluded from the repo** (reference material / raw drops, see `.gitignore`):
`assets/images/_originals/`, `assets/images/to be used as well in the  showcaing/`,
`original anmeldung endpoint/`, `oldwebsite endpoints/`, `New folder (28)/`, the
reference PDF, and stray screenshots.

---

## 4. Design system (in `assets/css/style.css`)

**Tokens (`:root`):** brand blue `#037EF3`, deep navy `#0A1628`, teal `#00C49A`,
a neutral gray ramp (`--gray-50/100/200/500/700/900`), layered shadows, radii, and
a shared transition.

> ⚠️ Only grays **50, 100, 200, 500, 700, 900** exist. `--gray-300`/`--gray-400`
> are **not defined** — using them produces an invisible/blank value. Use a defined
> token or a literal hex.

**Reusable components:** `.btn` (+variants), `.section-overline`, `.section-title`,
`.hero`/`.hero--sub`, hero word-reveal, `.stats-grid`/`.stat-card` (animated
counters), `.feature-grid`/`.feature-card`, `.process-layout`+`.steps`, `.quote-card`
(and `.quote-card.is-cta` for an honest non-quote CTA card), `.stories-grid`,
`.partners-logos`/`.partner-logo-card`, `.video-embed`/`.video-facade`, `.contact-form`
+ form fields, `.form-consent` (checkboxes), `.event-photo`, `.dark-cta-split`,
`.footer`, `.cta-banner`.

**Animation:** add `animate-up|left|right` (+ optional inline `animation-delay`);
`main.js` reveals them on scroll via IntersectionObserver. Fully guarded by
`prefers-reduced-motion`.

**Premium layer:** cursor-follow spotlight + subtle 3D tilt on cards, magnetic
buttons, hero pointer-parallax — all disabled on touch / reduced-motion.

---

## 5. Forms (Web3Forms)

Every contact/registration form posts to `https://api.web3forms.com/submit`.

- **Access key:** `f0ba8c58-9857-47f0-b545-d6d283ebc418` (this is a *public*
  submission key by design — it only allows sending to the configured inbox; it is
  not a secret).
- Each form carries a per-page `subject` and hidden interest fields so leads are
  tagged by which page they came from.
- `main.js` intercepts the submit, sends via `fetch`, and shows an inline green
  success state (no page reload). The form `id="contactForm"`, button `id="submitBtn"`,
  success box `id="formSuccess"` are the hooks.

**The Anmeldung form** (`anmeldung.html`) mirrors the old AIESEC registration page:
company, website, first/last name, email, phone, product interest, nearest city,
"how did you hear about us", plus two consent checkboxes (contact opt-in pre-checked;
privacy consent required).

---

## 6. Build process — start to finish

A chronological summary of how the site came together.

1. **Foundation & homepage.** Built the design system in `style.css`, then the
   homepage faithfully to the reference PDF: navbar, cinematic hero (word-reveal),
   "Was ist AIESEC", stats band, locations, event cards, partnership value cards +
   DHL testimonial image, partner logo wall, contact form, footer.
2. **Three cooperation sub-pages.** `global-talent`, `hochschulmarketing`,
   `talentbindung` — each with hero, value/feature sections, process steps,
   stats, partner content, and a tagged contact form.
3. **Forms wired** to Web3Forms with per-page tagging.
4. **Image optimization.** ~47 MB of raw photos → ~2.6 MB shipped (resized to
   ≤1600px, JPEG q82, progressive, EXIF-orientation fixed). Full-res originals
   kept in `assets/images/_originals/` (never deployed).
5. **Premium interaction layer** + load polish (navbar drop-in, hero focus-in),
   dropdown hover-gap fix.
6. **Text fidelity pass.** Restored homepage copy to match the reference PDF
   exactly after earlier drift (hero, "Was ist AIESEC", CTA, partnership cards).
7. **New photos wired in** (real Y2B / DB / Huawei / MeCo community shots).
8. **Anmeldung page built** — replicating the old registration endpoint's inputs
   in the new template, with the previously-missing dropdowns. Kept as a dedicated
   page (linkable, trackable conversion funnel) rather than buried at page bottom.
9. **Footer credit** ("Crafted with ♥ by Mousa & Helene", LinkedIn links).
10. **QA + security + honesty pass** (see §7 and §8).
11. **Deploy prep** — `.gitignore`, `.nojekyll`, `CNAME`, git repo initialized.

---

## 7. Key fixes & decisions

- **Fabricated testimonials removed.** An earlier build had invented customer
  quotes and names. These were **not** from any real source and were removed
  entirely — invented social proof is a credibility risk. **Rule going forward:
  never fabricate testimonials, names, quotes, logos, or statistics.** Real social
  proof comes from the owner (with permission) or doesn't appear.
- **Internal links use explicit `index.html`** (e.g. `global-talent/index.html`,
  not `global-talent/`). Bare folder links don't open when previewing locally via
  `file://`. Same reason the logo/home links use `../index.html`, not `../`.
- **CSR links** point to the homepage contact section (there is no standalone CSR
  page yet).
- **YouTube embed** uses a click-to-load *facade* (poster image + play button;
  the real player loads only on click, via the privacy `youtube-nocookie` domain).
  This avoids the "error 153" you get when an embed loads from a local `file://`
  page, and it's faster.
- **Faithful to the reference.** No new sections beyond the reference PDF without
  the owner's say-so.

---

## 8. Security

The site is static, which removes whole classes of risk (no database, no server
code, no user accounts, no sessions). The remaining surface is the browser, the
third-party services (Web3Forms, Google Fonts, YouTube), and the host. Here's how
each item of the **OWASP Top 10** is addressed, plus the known limits.

### 8.1 What's implemented

- **Content-Security-Policy (CSP)** — a `<meta http-equiv="Content-Security-Policy">`
  on every page restricts what the browser may load/execute:
  - `script-src 'self'` — only our own `main.js` runs; injected/inline scripts are blocked (this is the primary defense against XSS).
  - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` — our CSS + Google Fonts. (`'unsafe-inline'` is needed because the markup uses inline `style=` attributes.)
  - `font-src https://fonts.gstatic.com` — font files only from Google.
  - `img-src 'self' data: https://i.ytimg.com` — local images + YouTube poster thumbnails.
  - `frame-src https://www.youtube-nocookie.com https://www.youtube.com` — only YouTube can be framed in.
  - `connect-src https://api.web3forms.com` + `form-action https://api.web3forms.com` — form data can only be sent to Web3Forms.
  - `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`.
- **Referrer-Policy** `strict-origin-when-cross-origin` (`<meta name="referrer">`) — limits referrer leakage to third parties.
- **Tabnabbing protection** — every external `target="_blank"` link carries `rel="noopener"`, so opened pages can't control the original tab.
- **No inline JavaScript / no inline event handlers** — all behavior is in `main.js`, which keeps the strict `script-src 'self'` workable.
- **No secrets in the codebase** — the only key (Web3Forms) is a public submission key by design.
- **HTTPS** — GitHub Pages serves over HTTPS automatically (enable "Enforce HTTPS" in repo settings).

### 8.2 OWASP Top 10 — how it maps

| OWASP risk | Status on this site |
|------------|--------------------|
| A01 Broken Access Control | N/A — no auth, no protected resources, no server. |
| A02 Cryptographic Failures | HTTPS enforced by host; no PII stored; form data goes straight to Web3Forms over TLS. |
| A03 Injection | No server/DB → no SQL/command injection. XSS mitigated by CSP `script-src 'self'` + no inline JS + no user-generated content rendered back. |
| A04 Insecure Design | Static-by-design; minimal attack surface; lead handling delegated to a vetted provider. |
| A05 Security Misconfiguration | CSP + referrer policy + `rel=noopener` set. **Limit:** see §8.3. |
| A06 Vulnerable Components | No JS dependencies/build chain to go stale. External: Google Fonts, YouTube, Web3Forms (all maintained, pinned by URL). |
| A07 Auth Failures | N/A — no authentication. |
| A08 Data Integrity Failures | No build pipeline/CI to tamper with; assets served directly from the repo. |
| A09 Logging/Monitoring | Web3Forms logs submissions; GitHub provides deploy history. (No app-level logging — not applicable to a static site.) |
| A10 SSRF | N/A — no server makes outbound requests. |

### 8.3 Known limits & recommendations

- **HTTP security headers.** GitHub Pages **cannot send custom HTTP response
  headers**, so `X-Frame-Options`, `Strict-Transport-Security` (HSTS), and
  `X-Content-Type-Options` aren't set. `frame-ancestors 'none'` is declared in the
  CSP meta but is **ignored when delivered via `<meta>`** (it only works as a real
  header). → **Recommendation:** put **Cloudflare** (free tier) in front of the
  domain and add these headers there. That closes clickjacking/MIME-sniffing/HSTS.
- **`'unsafe-inline'` for styles** is a minor CSP weakening required by the inline
  `style=` attributes. It does not allow inline *scripts* (those stay blocked). It
  could be removed later by moving inline styles into `style.css`.
- **Third-party trust.** Web3Forms receives lead data and YouTube/Google receive
  request metadata when those resources load. All are reputable; documented here
  for transparency and GDPR awareness.
- **GDPR / privacy.** Forms collect personal data (name, email, phone). Ensure the
  linked `Datenschutzerklärung` is accurate and that Web3Forms' data handling is
  covered in it. The Anmeldung form's privacy-consent checkbox is required.
- **Dependabot / updates.** Nothing to update in code, but periodically confirm the
  external service URLs (Web3Forms, fonts, YouTube embed) still work.

---

## 9. Deployment (GitHub Pages)

The repository is initialized and committed. To publish:

1. **Create an empty repo** on github.com (e.g. `aiesec-unternehmen`) — no README/license (we already have files).
2. **Connect & push** (run in this folder; use the `! ` prefix in Claude Code so it runs in your session):
   ```bash
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```
3. **Enable Pages:** repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save. Tick **Enforce HTTPS**.
4. **Custom domain:** `CNAME` already contains `unternehmen.aiesec.de`. In your DNS
   provider, add a **CNAME record** for `unternehmen` → `<your-username>.github.io`
   (or A records to GitHub's IPs for an apex domain). GitHub will validate and issue
   the TLS certificate.
5. **(Recommended)** Add Cloudflare in front for the HTTP security headers in §8.3.

### Updating the site later
Edit the HTML/CSS/JS, then:
```bash
git add -A
git commit -m "describe your change"
git push
```
GitHub Pages redeploys automatically within a minute.

---

## 10. Maintenance notes

- **Add a partner logo:** drop the file in `assets/images/`, then add a
  `<div class="partner-logo-card"><img src="…" alt="…"/></div>` to the partner wall.
- **Add/replace a photo:** optimize first (≤1600px, JPEG q82) to keep the site fast;
  keep the original in `_originals/`.
- **Edit a form's destination tag:** change the hidden `subject`/`interest` inputs.
- **Never** reintroduce emoji icons (use `.icon` SVGs), hard-delete `_originals/`,
  add external dependencies, or add fabricated content.
- **Verify after changes:** open each page in a browser; check the nav dropdown,
  the logo→home link, forms, and that no console errors appear.

---

*Crafted with ♥ by Mousa & Helene.*
