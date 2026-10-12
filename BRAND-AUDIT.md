# Core Mama Pilates — Brand Audit (from Instagram, 2026-10-11)

Source: https://www.instagram.com/coremamapilates (public view, logged out; modal blocked
scrolling past the first row of posts, so this is a partial audit).

## Confirmed from the profile
- Display name: "CoreMama Pilates | Reformer Pilates & Childcare"
- Bio lines: "Movement designed for real life 🤍" / "On-demand reformer Pilates" /
  "Flexible scheduling + childcare" / "Motherhood-centered. Open..." (truncated)
- ~925 followers, 1,518 following. Bio link is a Google Form (interest/signup form).
- Story highlights: "How it Works", "FAQ", "About" — pull copy from these once logged-in access exists.
- Visible posts: a "COREMAMA" schedule/price-style grid graphic, a bright studio shot with
  several reformer machines, a close-up of hands on equipment.

## Implications for the brief
- The brief says "self-guided" and "do not claim equipment unless confirmed." The bio itself
  says REFORMER Pilates and ON-DEMAND, so reformer can be referenced. Confirm with the client
  whether "self-guided" = on-demand reformer sessions.
- CHILDCARE is a headline differentiator in the bio that the brief does not mention. Ask the
  client whether to feature it on the site.
- "Motherhood-centered" is core positioning; target audience is moms.

## Logo (as observed, low-res avatar)
- Circular mark: line-art mother holding a child, with a leaf/botanical sprig.
- Dark olive/sage-green line work on a cream/off-white ground.
- Needs the real vector file from the client for the stroke-draw animation.

## PROVISIONAL palette (not official — replace with client assets)
- Cream ground:      #F4EFE6
- Olive/sage ink:    #4F5B3F
- Soft sage accent:  #A9B49A
- Warm sand:         #D9C7B2
- Near-black text:   #1F221C
Typography direction: editorial serif for headlines (e.g. Fraunces / Cormorant), clean
humanist sans for body (e.g. Inter / Manrope). Confirm against the client's actual fonts.

## Still needed from client
Logo vector, brand fonts, real studio photos, hours, address/phone/email, pricing,
membership details, whether sessions are instructor-free, and what "on-demand" means.

---

## Second pass (post grid, logged out, 2026-10-11)

### Logo (clear view)
- Avatar: cream circle, line-art illustration of a mother holding a baby, dark olive-brown
  line work, a sage-green leaf sprig at lower right and a small dusty-rose heart.
- Wordmark on the studio wall and posts: "CoreMama" in a high-contrast classic serif,
  "PILATES" beneath in widely letter-spaced sans small caps. Dark brown/near-black on cream.
- Highlight covers: cream circles with thin olive line icons + tiny leaf accents.

### Photography / content style
- Bright, warm, natural light. Cream walls, white reformers, light wood reception desk,
  blush-pink velvet lounge chairs, "CoreMama PILATES" wall signage.
- Real moms with babies/toddlers in the studio; a keys-in-hand "we got the keys" post.
- Graphic posts: cream background, dusty-rose/blush panels, serif headlines, sans body.

### Palette (observed, still provisional until brand files arrive)
- Cream page ground      #F5F0E8
- Warm white             #FBF8F3
- Blush (chairs/panels)  #E6CFC7
- Dusty rose accent      #C9A39B
- Olive/sage (leaves)    #6B7257
- Espresso ink (text)    #3E342E

### Business model confirmed by the client's own posts
- Bio: "On-demand reformer Pilates", "Flexible scheduling + childcare", "Motherhood-centered".
- "Pilates, on your schedule — here's how it works" post:
  1. Reserve your session  2. Choose your class (on-demand, expert-led library)
  3. Put on your headphones  4. Move & feel good.
  => "Self-guided" = members book a reformer slot and follow an on-demand class on their own.
- Soft Opening post: Sunday, October 25th, 2–5 PM, 444 Colusa Ave, Ste B, Yuba City.
  "Tour the studio • Try the reformers • Explore our on-demand classes • See the childcare space."
- A membership pricing poster exists (several monthly tiers named "... Mama" and a
  "Founding" tier). Low-res read; NOT used on the site. Get the exact tiers from the client.

### Decisions taken in the build
- Address and soft-opening date are placed in config flagged `verified: false` (from the
  client's public post) — confirm before launch.
- Reformers and on-demand guided classes are referenced because the client's bio states them.
- Childcare is mentioned as an amenity to confirm (config flag), not as a promise.
- No prices, discounts, member caps, or launch dates for membership are shown.

---

## Third pass — assets pulled with Aiden's approval (2026-10-11)

Downloaded the 12 public grid images (640px) and the avatar (150px) with
`scripts/fetch-photos.mjs` into `public/photos/`. Palette measured with
`scripts/palette.mjs`.

### Real photographs (used on the site)
- `p06-2026-09-04.jpg` — the lounge: cream walls, two-tone wall wordmark
  ("Core" espresso / "Mama" dusty rose), blush armchairs, wood desk, mirror,
  reformer. Hero, self-guided detail crop, landing page.
- `p01-2026-09-03.jpg` — keys in hand outside 444 Colusa Ave Ste B, kids at the
  door. Studio-experience and founding sections.
- `p04-2026-09-30-founder.jpg` — Becca with her three children. Founder block.

### Not used as photos
- `p02` membership poster, `p03` soft-opening poster (its reformer photo is
  credited "courtesy of Your Reformer", i.e. a vendor image), `p05` how-it-works
  infographic, `p07–p12` branded graphics with rendered/concept studio scenes.
  Their facts were used; their imagery was not.

### Facts confirmed from the client's own posts (now on the site)
- Memberships: Balanced Mama $109 (4 sessions, 2 childcare), Strong Mama $159
  (8/4), Empowered Mama $199 (12/6), Founding FlexMama $219 (unlimited, 1/day,
  8 childcare, only 10, rate locked), FlexMama Unlimited $249. Month-to-month,
  no enrollment/cancellation fees, no minimum. Grand-opening bonus: one free
  extra session in month one. => `src/config/memberships.ts`, `show: true`.
- Childcare = "CoreNest": $8 one child / $10 two, ages 6 months–6 years,
  reservations required, up to 2 children per family per reservation.
- Sessions are 1-hour reservations; 1,000+ expert-led on-demand classes at a
  personal kiosk with headphones; all levels welcome.
- Soft opening Sunday Oct 25, 2–5 PM, 444 Colusa Ave Ste B, Yuba City
  (`site.softOpening.show = true`). Address now `verified: true` (client's own
  announcement).
- Founder: Becca, mom of three incl. twins (quote from the 30 Sep post).

### Measured palette (replaces the provisional one)
Overall photo sample: #faf6f1 31% · #e9dbcf 23% · #d1bcab 10% · #a7876e 8% ·
#c09e86 8% · #5f4b36 8% · #8d6c4e 8% · #241a13 5%. Graphics accent rose
#bd8882; logo line olive #4f4f36.
Tokens now: cream #f7f1ea, blush #ead6ce, rose #c08c84, rose-deep #a8736b,
olive #4f5236, espresso #3b2f27, tan #a7876e, sage #a9b49a.

### Logo
Official mark (mother + baby line art) is live from the 150px avatar, converted
to a transparent PNG (`public/brand/logo-mark.png`). It is fine at nav/intro
sizes but the vector original is still needed for anything larger or for a true
stroke-draw animation. The wordmark is now two-tone like the wall sign.

### Still needed from the client
Vector logo, brand fonts, full-resolution photos (the hero is a 640px crop),
studio hours, email/phone, session cancellation window, drop-in/class-pack
pricing if any, and sign-off on the founder quote.

---

## Fourth pass — full-resolution assets (2026-10-11, evening)

Aiden saved the Instagram profile page from his logged-in browser
(`Downloads/(7) Instagram.html` + `_files`). The `_files` folder holds the
posts at their real size (1254–1440px), so every slot now uses a sharp source:

| File (public/photos) | Source post | Size |
| --- | --- | --- |
| p09 / p09-trim (hero) | CoreNest announcement | 1254² |
| p06 (CoreNest section) | lounge photo | 1440² |
| p01 (founding) | keys day | 1440² |
| p04 (founder) | Becca + kids | 1440² |
| p10-trim (self-guided) | "what will a visit look like" | 942×1670 after trim |
| p08-right (experience) | "what makes CoreMama different" (photo half) | 665×1254 |
| p12-trim (landing) | "the CoreMama experience" | 1365×1820 |
| p07, p05-trim, p02-trim, p03-trim, p13, p14 (IG strip) | benefits, how-it-works, memberships, soft opening, coming soon, quote | 1122–1440 |
| p15-extra-c (unused) | "Why I created CoreMama" founder-story card (rendered, not a photo) | 1254² |

Three posts were new: a sage "Coming Soon" card (note: it says *virtual*
reformer Pilates and "Movement designed for motherhood"), a quote card
("Wellness should fit your life — not compete with it."), and a founder-story
card. The avatar is still only 150px; the vector logo is still wanted.
