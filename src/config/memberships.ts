/**
 * Membership tiers AS PUBLISHED by the studio on Instagram (27 Aug 2026 post).
 * Nothing here is invented, but prices and limits can change before opening:
 * the owner must confirm them. Set `show: false` to hide the section.
 */
export type MembershipTier = {
  id: string;
  name: string;
  price: number;
  sessions: string;
  childcare: string;
  note?: string;
  featured?: boolean;
  badge?: string;
  extras?: string[];
};

export const memberships = {
  show: true,
  source: "Instagram membership announcement, 27 Aug 2026 — confirm before launch",
  headline: "Flexible. Supportive. Made for busy lives.",
  currency: "$",
  sessionLength: "1-hour reservation",

  tiers: [
    {
      id: "balanced",
      name: "Balanced Mama",
      price: 109,
      sessions: "4 reformer sessions / month",
      childcare: "2 childcare reservations included",
    },
    {
      id: "strong",
      name: "Strong Mama",
      price: 159,
      sessions: "8 reformer sessions / month",
      childcare: "4 childcare reservations included",
    },
    {
      id: "empowered",
      name: "Empowered Mama",
      price: 199,
      sessions: "12 reformer sessions / month",
      childcare: "6 childcare reservations included",
    },
    {
      id: "founding-flex",
      name: "Founding FlexMama",
      price: 219,
      sessions: "Unlimited reformer sessions · 1 session / day",
      childcare: "8 childcare reservations included",
      featured: true,
      badge: "Founding offer",
      extras: ["Only 10 available", "Rate locked while active"],
    },
    {
      id: "flex-unlimited",
      name: "FlexMama Unlimited",
      price: 249,
      sessions: "Unlimited reformer sessions · 1 session / day",
      childcare: "8 childcare reservations included",
      note: "After founding spots are gone",
    },
  ] satisfies MembershipTier[],

  includes: ["Month-to-month", "No enrollment fees", "No cancellation fees", "No minimum commitment"],

  childcare: {
    name: "CoreNest",
    oneChild: 8,
    twoChildren: 10,
    ages: "6 months – 6 years",
    note: "Reservations required. Additional childcare for members is $8 per extra reservation, up to 2 children per family.",
  },

  grandOpening: {
    show: true,
    bonus: "Join during grand opening week and receive one free extra session in your first month.",
  },
};
