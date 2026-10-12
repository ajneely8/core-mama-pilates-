# Core Mama Pilates — website, booking demo, founding-member funnel

Production-quality demo site for Core Mama Pilates, a self-guided reformer
Pilates studio with on-site childcare in Yuba City, CA. Next.js App Router,
TypeScript, Tailwind v4, shadcn/ui (Base UI), Framer Motion, React Hook Form +
Zod.

```bash
npm install
cp .env.example .env.local   # optional for the demo
npm run dev                  # http://localhost:5330
```

`npm run build` must pass before deploying. `npm run typecheck` and `npm run lint`
are wired up too.

## What is in the box

| Route | What it does |
| --- | --- |
| `/` | Animated logo intro → full-height hero → marquee → soft-opening band → studio statement + founder → **Your Practice. Your Pace.** (3 steps) → studio experience → CoreNest childcare → how it works (dark) → memberships → marquee → founding member signup → FAQ → Instagram strip → contact |
| `/book` | Six-step booking wizard: session → date → time → details (incl. CoreNest childcare) → review → confirmation, with cancel + reschedule |
| `/founding-members` | Conversion landing page for the Instagram bio / QR codes, minimal nav, large form, FAQ |
| `/api/booking/availability` | `GET ?typeId=` → open slots (UTC) inside the booking window |
| `/api/booking` | `POST` create a reservation |
| `/api/booking/[id]` | `GET` / `PATCH` (reschedule) / `DELETE` (cancel) |
| `/api/founding-member` | `POST` founding-member signup (upsert, tag, workflow, source, de-dupe) |
| `/api/contact` | `POST` contact-form message |

Everything runs in **demo mode** out of the box: sample availability, an
in-memory reservation store (double bookings are rejected, cancel/reschedule
work), and form submissions that are clearly labelled as demo and not sent
anywhere.

## Where the content came from

| On the site | Source |
| --- | --- |
| Logo mark, two-tone wordmark, colours | Studio's Instagram avatar, wall sign and graphics (measured with `scripts/palette.mjs`) |
| CoreNest hero graphic, lounge, keys-day and founder photos, studio graphics | Studio's Instagram posts at full resolution (1254–1440px), from the profile page Aiden saved from his browser on 2026-10-11 |
| Membership tiers, CoreNest childcare pricing, "all memberships include" | Studio's membership post, 27 Aug 2026 |
| 1-hour reservations, 1,000+ on-demand classes, kiosk + headphones, all levels | Studio's how-it-works post, 24 Sep 2026 |
| Soft opening date, time and address | Studio's post, 9 Oct 2026 |
| Founder quote | Studio's post, 30 Sep 2026 |

Nothing was invented. Everything above should still be confirmed by the owner
before launch; `BRAND-AUDIT.md` has the full list.

## Demo vs. live, honestly labelled

- Booking: the review step and confirmation screen say *demo* until GoHighLevel
  is connected. No confirmation email or text is claimed.
- Founding member form: success shows the required copy ("You're on the list!…")
  plus a small note saying whether the lead was saved to a CRM or was a demo.
- Session types and studio hours: **sample values** flagged `sample: true` in
  `src/config/booking.ts`. The calendar shows a "Sample availability for demo"
  pill. Reformer capacity for the demo is 4.
- Memberships: shown because the studio published them; a footnote says they
  are subject to confirmation. `memberships.show = false` hides the section.
- FAQ answers that still depend on policy carry a "Studio to confirm" pill.

## Configuration (no redesign needed later)

| File | Controls |
| --- | --- |
| `src/config/site.ts` | Name, tagline, description, timezone, Instagram, email/phone, address, founder quote, soft-opening banner, hours note, childcare details, footer credit |
| `src/config/memberships.ts` | Tiers, prices, inclusions, childcare pricing, grand-opening bonus, `show` flag |
| `src/config/booking.ts` | Booking types (name, duration, description, GHL calendar env var), booking window, minimum notice, sample hours/capacity |
| `src/config/brand.ts` | Palette status, fonts, logo flags (official mark, two-tone wordmark) |
| `src/config/media.ts` | Every photo slot (`src`, alt, caption, crop position) |
| `src/content/faq.ts` | Homepage and landing-page FAQ copy, with `toConfirm` markers |
| `src/app/globals.css` | Brand colour tokens (`--color-cream`, `--color-rose`, …) and type scale utilities |
| `.env.example` | GHL keys, calendar IDs, tag, workflow IDs, timezone |

## Brand assets

1. **Colours** — `@theme` tokens at the top of `src/app/globals.css` (and the
   `:root` shadcn variables under them). Current values were measured from the
   studio's own photos; official brand files replace them in one place.
2. **Fonts** — `src/app/layout.tsx` (`next/font/google`, Cormorant Garamond +
   Manrope, provisional). If the studio's display face is licensed, load it with
   `next/font/local` and re-run the wordmark trace so the intro draws the same
   letterforms:

   ```bash
   npm run wordmark -- path/to/DisplayFont.ttf 500
   ```

   This writes `src/components/brand/wordmark-paths.ts` (one SVG path per
   letter, which is what makes the draw-on animation possible).

3. **Logo mark** — `public/brand/logo-mark.png` is the studio's mother-and-baby
   mark, converted from the 150px Instagram avatar to a transparent PNG by
   `scripts/make-logo-mark.mjs`. It is sharp at nav/intro sizes; drop the vector
   original at `public/brand/logo-mark.svg` and point `brand.logo.markSrc` at it
   for large uses.

4. **Photography** — files live in `public/photos/`; each slot in
   `src/config/media.ts` points at one, and no image is used twice.

   **Front page**: the CoreNest graphic, shown whole at screen height on the
   plain page cream, served untouched (no optimizer re-encode). The two buttons
   stack to its left on wide screens (16:10 and wider, the `wide:` variant in
   globals.css) and sit centred in a strip under it on squarer screens, so they
   never cover its words. To swap in another original, save it as
   **`public/photos/corenest-hero.png`** (or `.jpg`): `src/lib/hero-image.ts`
   picks it up automatically and reads its size.

   Instagram exports with white side margins were trimmed (`*-trim.jpg`,
   `scripts/trim-margins.mjs`) and the "what makes CoreMama different"
   graphic is pre-cropped to its photo half (`p08-right.jpg`) so no lettering
   shows. Sources are now full resolution; the avatar (150px) is the only small file left.

## Connecting GoHighLevel

The site never talks to GHL from the browser. All calls go through
`src/lib/ghl/ghl-adapter.ts` on the server, chosen by `getAdapter()` in
`src/lib/ghl/index.ts`.

1. In the GHL sub-account create one calendar per booking type (reformer session,
   first visit, tour). Note each calendar ID and the location ID.
2. Create a Private Integration token with calendar + contact + workflow scopes.
3. Create the workflows: founding-member launch sequence, booking confirmation /
   reminders (attached to the calendars), and optionally a contact-form
   notification. Note the founding-member workflow ID.
4. Fill `.env.local` (or the host's environment):

   ```
   GHL_MODE=live
   GHL_API_KEY=…
   GHL_LOCATION_ID=…
   GHL_CALENDAR_ID_REFORMER=…
   GHL_CALENDAR_ID_FIRST_VISIT=…
   GHL_CALENDAR_ID_TOUR=…
   GHL_FOUNDING_TAG=CoreMama-FoundingMember
   GHL_FOUNDING_WORKFLOW_ID=…
   GHL_CONTACT_WORKFLOW_ID=…   # optional
   NEXT_PUBLIC_STUDIO_TIMEZONE=America/Los_Angeles
   ```

5. Redeploy. Availability now comes from `GET /calendars/{id}/free-slots`,
   bookings from `POST /calendars/events/appointments` (GHL enforces free-slot
   validation, so double bookings are rejected server-side), founding members
   from `POST /contacts/upsert` + tags + workflow enrolment. A childcare
   reservation is written into the appointment notes.

The GHL adapter follows the public API v2 reference but has **not yet been run
against a live account**. Test it on a sandbox sub-account first; endpoint
shapes occasionally change.

### Data flow once live

- **Booking**: upsert contact → create appointment on the type's calendar →
  return appointment id. Reminders and confirmations are GHL workflow jobs on
  the calendar, so email/SMS copy lives in GHL, not in code.
- **Founding member**: upsert contact (dedupes by email/phone in GHL) → apply
  `CoreMama-FoundingMember` → enrol in the launch workflow → `source` field
  records `homepage` or `landing-page`.
- **Contact form**: upsert contact with tag `CoreMama-ContactForm`, message saved
  as a contact note, optional notification workflow.

## Time zones

Slots are generated and stored as UTC instants. The server knows the studio
zone (`NEXT_PUBLIC_STUDIO_TIMEZONE`); the browser renders every time in the
visitor's zone and says so. Helpers live in `src/lib/time.ts` and use only
`Intl`, so there is no timezone database to ship.

## Accessibility & motion

- `prefers-reduced-motion` collapses the intro to a short fade and disables
  transform animations site-wide (`MotionConfig reducedMotion="user"`).
- Intro is skippable by click/tap, plays on every load of the homepage, and replays when the logo in the nav is clicked.
- Skip link, focus rings, labelled form fields with inline errors, `aria-pressed`
  calendar/time buttons, live regions for success states.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run wordmark -- <font.ttf> [weight]` | Trace "CoreMama" into SVG paths for the draw-on intro |
| `node scripts/make-logo-mark.mjs <in.jpg> <out.png>` | Knock the white out of a raster mark |
| `node scripts/palette.mjs public/photos` | Measure dominant colours across the photo set |
| `node scripts/fetch-photos.mjs <urls.json> <dir>` | One-off image pull used for the Instagram assets |

## Deploying

Any Node host works. For Vercel:

1. Import the repo, set the root directory to `core-mama-pilates`.
2. Add the environment variables above (demo needs none).
3. Build command `npm run build`, output default.
4. Point the domain at the project; update `NEXT_PUBLIC_SITE_URL` so metadata,
   sitemap and robots use the real origin.

## Before presenting to the client

See `BRAND-AUDIT.md`. In short: confirm memberships and childcare pricing,
studio hours, email/phone, the session cancellation window, the founder quote,
and collect the vector logo, brand fonts and full-resolution photos.
