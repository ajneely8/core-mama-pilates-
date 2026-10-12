/**
 * Studio-level configuration. Everything the client may want to change without
 * touching components lives here. `source` notes say where a fact came from so
 * the owner can confirm it before launch.
 */
export type ConfirmStatus = "confirmed" | "confirm" | "none";

export const site = {
  name: "Core Mama Pilates",
  shortName: "CoreMama",
  tagline: "Movement designed for real life.",
  description:
    "Self-guided reformer Pilates with on-site childcare in Yuba City, California. Reserve a reformer, settle in, and move at your own pace on a schedule that fits your life.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5330",
  timezone: process.env.NEXT_PUBLIC_STUDIO_TIMEZONE ?? "America/Los_Angeles",
  timezoneLabel: "Pacific Time",

  instagram: {
    handle: "coremamapilates",
    url: "https://www.instagram.com/coremamapilates",
  },

  /** Null = not yet provided by the studio; the UI shows a "coming soon" state. */
  contact: {
    email: null as string | null,
    phone: null as string | null,
  },

  address: {
    line1: "444 Colusa Ave, Ste B",
    city: "Yuba City",
    region: "CA",
    postalCode: null as string | null,
    verified: true,
    source: "Studio's soft-opening announcement on Instagram (Oct 2026)",
  },

  founder: {
    firstName: "Becca",
    /** Quoted from the studio's own 30 Sep 2026 Instagram post; owner to approve. */
    quote:
      "Hi, I'm Becca! A wife, mom of three little ones—including twins—and the founder of CoreMama Pilates.",
    source: "Instagram post, 30 Sep 2026",
  },

  /** Public event announced on Instagram. `show` controls whether the site mentions it. */
  softOpening: {
    show: true,
    dateLabel: "Sunday, October 25",
    timeLabel: "2–5 PM",
    bullets: ["Tour the studio", "Try the reformers", "Explore our on-demand classes", "See the childcare space"],
    note: "All are welcome.",
    source: "Instagram post, 9 Oct 2026",
  },

  hours: {
    status: "confirm" as ConfirmStatus,
    note: "Studio hours will be confirmed before opening.",
  },

  amenities: {
    childcare: {
      status: "confirmed" as ConfirmStatus,
      name: "CoreNest",
      ages: "6 months – 6 years",
      note: "Reservations required. Up to 2 children per family per reservation.",
      source: "Instagram membership post, 27 Aug 2026",
    },
    onDemand: {
      label: "1,000+ expert-led on-demand classes at your personal kiosk",
      source: "Instagram post, 24 Sep 2026",
    },
    sessionLength: "1-hour reservations",
  },

  credit: { label: "Website by Nimvora", url: null as string | null },
};

export type SiteConfig = typeof site;
