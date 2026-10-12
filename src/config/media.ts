/**
 * Photography slots. Every `src` below is the studio's own image, taken at full
 * resolution (1254–1440px) from the Instagram page Aiden saved on 2026-10-11.
 * Each slot uses a DIFFERENT image. Swap in originals when the owner supplies
 * them: same keys, larger files. `position` is the CSS object-position used
 * when a slot crops the image; crops are chosen so the graphics' own lettering
 * stays out of frame.
 */
export type MediaTone = "sand" | "blush" | "cream" | "olive";

export type MediaItem = {
  src: string | null;
  alt: string;
  caption: string;
  tone: MediaTone;
  position?: string;
  /** Where the image came from, for the hand-off notes. */
  source?: string;
};

export const media = {
  /** Front page, full screen (Aiden's pick): the CoreNest graphic. Centred so the
   *  headline and arch stay in frame; the Hero anchors the buttons to the artwork's divider band. */
  hero: {
    src: "/photos/p09-trim.jpg",
    alt: "CoreNest announcement: through an arch, a small table and chairs, baskets of toys, a teddy bear and a wooden pull-along toy, with the words “More than childcare. Meet CoreNest.”",
    caption: "Studio image — CoreNest",
    tone: "sand",
    position: "50% 50%",
    source: "Instagram, 30 May 2026",
  },
  /** Self-guided section (4:3, bottom crop): the arched reformer room. */
  selfGuided: {
    src: "/photos/p10-trim.jpg",
    alt: "Reformers lined up in a sunlit studio with arched alcoves, olive trees and wood slat walls.",
    caption: "Studio image — a visit to CoreMama",
    tone: "blush",
    position: "50% 100%",
    source: "Instagram, 29 May 2026",
  },
  /** Studio experience: the right half of the "what makes CoreMama different" graphic (reformers and a knit blanket), pre-cropped so none of its lettering shows. */
  experience: {
    src: "/photos/p08-right.jpg",
    alt: "Reformers in a warm studio with an arched doorway, a knit blanket and a CoreMama water bottle in the foreground.",
    caption: "Studio image — what makes CoreMama different",
    tone: "cream",
    position: "100% 50%",
    source: "Instagram, 1 Jun 2026",
  },
  /** CoreNest band (square). Real photo of the lounge. */
  childcare: {
    src: "/photos/p06-2026-09-04.jpg",
    alt: "The Core Mama Pilates lounge: blush armchairs, a wood reception desk, an olive tree, an arched mirror, and the CoreMama wordmark on a cream wall.",
    caption: "Studio photo — lounge",
    tone: "sand",
    position: "50% 50%",
    source: "Instagram, 4 Sep 2026",
  },
  /** Founder block. Real photo of Becca and her children. */
  founder: {
    src: "/photos/p04-2026-09-30-founder.jpg",
    alt: "Becca, founder of Core Mama Pilates, seated on a sofa holding her newborn twins with her toddler beside her.",
    caption: "Studio photo — Becca and family",
    tone: "olive",
    position: "50% 30%",
    source: "Instagram, 30 Sep 2026",
  },
  /** Founding member section. Real photo: getting the keys. */
  founding: {
    src: "/photos/p01-2026-09-03.jpg",
    alt: "The studio keys held up in front of the Core Mama storefront, with three children at the glass doors.",
    caption: "Studio photo — the beginning",
    tone: "olive",
    position: "50% 50%",
    source: "Instagram, 3 Sep 2026",
  },
  /** Founding-members landing page (shown whole, 3:4): the CoreMama experience graphic. */
  landing: {
    src: "/photos/p12-trim.jpg",
    alt: "The CoreMama Experience: a woman stretching beside a reformer, with the studio's five promises — flexible scheduling, a non-intimidating environment, integrated childcare, self-guided reformer Pilates, and all levels welcome.",
    caption: "Studio image — the CoreMama experience",
    tone: "sand",
    position: "50% 50%",
    source: "Instagram, 27 May 2026",
  },
  /** Brand poster, available for future use. */
  poster: {
    src: "/photos/hero-coremama-is-for-you.jpg",
    alt: "CoreMama Pilates brand image: a reformer beside an arched window, an olive branch, a candle, stacked books and a CoreMama water bottle, with the words “CoreMama is for you if… Wellness designed for real life.”",
    caption: "Brand image — CoreMama is for you if…",
    tone: "sand",
    position: "50% 50%",
    source: "Instagram, 28 May 2026",
  },
} satisfies Record<string, MediaItem>;

export type MediaKey = keyof typeof media;

/** Posts shown whole in the "Follow along" strip, each linking to Instagram. */
export const instagramPosts = [
  {
    src: "/photos/p13-extra-a.jpg",
    alt: "CoreMama Pilates — coming soon. Movement designed for motherhood: virtual reformer Pilates, flexible scheduling, childcare-centered concept, wellness for every stage.",
    href: "https://www.instagram.com/coremamapilates/",
    ratio: "1 / 1",
  },
  {
    src: "/photos/p07-2026-07-13.jpg",
    alt: "7 benefits of reformer Pilates — more than a workout.",
    href: "https://www.instagram.com/coremamapilates/p/DawFv-yj_m_/",
    ratio: "1 / 1",
  },
  {
    src: "/photos/p14-extra-b.jpg",
    alt: "Wellness should fit your life, not compete with it.",
    href: "https://www.instagram.com/coremamapilates/",
    ratio: "1 / 1",
  },
  {
    src: "/photos/p05-trim.jpg",
    alt: "Pilates, on your schedule: reserve your session, choose your class, put on your headphones, move and feel good.",
    href: "https://www.instagram.com/coremamapilates/p/DdsOuvyGvLU/",
    ratio: "4 / 5",
  },
  {
    src: "/photos/p02-trim.jpg",
    alt: "CoreMama Pilates memberships — flexible, supportive, made for busy lives.",
    href: "https://www.instagram.com/coremamapilates/p/DcjDQZVp_PY/",
    ratio: "2 / 3",
  },
  {
    src: "/photos/p03-trim.jpg",
    alt: "CoreMama Pilates soft opening — Sunday, October 25, 2–5 PM, 444 Colusa Ave Ste B, Yuba City. All are welcome.",
    href: "https://www.instagram.com/coremamapilates/p/DeSbvA0yAiw/",
    ratio: "4 / 5",
  },
];
