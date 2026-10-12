/**
 * FAQ copy. Answers that still depend on studio policy carry `toConfirm: true`
 * and render a small "studio to confirm" marker. Facts without the marker come
 * from the studio's own published posts.
 */
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  toConfirm?: boolean;
};

export const homeFaq: FaqItem[] = [
  {
    id: "what-is-self-guided",
    question: "What does self-guided Pilates mean?",
    answer:
      "You reserve a reformer for yourself for one hour, choose from more than a thousand expert-led on-demand classes at your personal kiosk, put on your headphones, and follow along at your own pace. There is no instructor at the front of the room and no fixed class time to work around.",
  },
  {
    id: "group-class",
    question: "Is this a group class?",
    answer:
      "No. Core Mama is not a conventional instructor-led group class. Your reservation is your own time on a reformer, moving the way you want to, with clear guided instruction in your ears.",
  },
  {
    id: "beginners",
    question: "I'm new to Pilates. Is this for me?",
    answer:
      "Yes. All levels are welcome, the on-demand library covers every fitness level, and you set the pace. If it's your first visit, we recommend booking a First Visit & Orientation so you can get comfortable on the reformer before your first full session.",
    toConfirm: true,
  },
  {
    id: "childcare",
    question: "Do you offer childcare?",
    answer:
      "Yes. CoreNest is our on-site childcare space for little ones aged 6 months to 6 years. Childcare reservations are required and cost $8 for one child or $10 for two, with a number of reservations included in each membership. Up to 2 children per family per reservation.",
  },
  {
    id: "how-to-book",
    question: "How do I book?",
    answer:
      "Choose a session type, pick a date and time that works, add a childcare reservation if you need one, and enter your details. You'll see a summary before you confirm.",
  },
  {
    id: "membership",
    question: "Do I need a membership?",
    answer:
      "Memberships are month-to-month with no enrollment fees, no cancellation fees, and no minimum commitment. Drop-in and class-pack options, if any, will be confirmed before opening.",
    toConfirm: true,
  },
  {
    id: "what-to-bring",
    question: "What should I wear and bring?",
    answer:
      "Comfortable, fitted clothing you can move in and a water bottle. Grip socks are typical for reformer Pilates.",
    toConfirm: true,
  },
  {
    id: "cancel",
    question: "Can I cancel or reschedule a session?",
    answer:
      "Yes. Reservations can be cancelled or rescheduled from your confirmation. The cancellation window for individual sessions will be published before opening.",
    toConfirm: true,
  },
  {
    id: "when-open",
    question: "When do you open?",
    answer:
      "Our soft opening is Sunday, October 25, 2–5 PM at 444 Colusa Ave, Ste B in Yuba City. Join the founding member list to hear about opening day, membership details, and early access first.",
  },
];

export const foundingFaq: FaqItem[] = [
  {
    id: "what-is-list",
    question: "What is the founding member list?",
    answer:
      "It's the first group of people we'll talk to about opening day, membership options, and early access. Joining the list doesn't commit you to anything.",
  },
  {
    id: "founding-offer",
    question: "What is the Founding FlexMama membership?",
    answer:
      "An unlimited membership (one session per day) with 8 childcare reservations included, at $219 per month with the rate locked while your membership is active. Only 10 are available, and the list hears about them first.",
  },
  {
    id: "cost",
    question: "Does it cost anything to join the list?",
    answer: "No. The list is free. Membership details are shared with the list first.",
  },
  {
    id: "what-happens",
    question: "What happens after I sign up?",
    answer:
      "You'll receive Core Mama updates by email, and by text if you share a phone number. You can unsubscribe at any time.",
  },
  {
    id: "where",
    question: "Where is the studio?",
    answer: "444 Colusa Ave, Ste B, Yuba City, California. Come see it at the soft opening on Sunday, October 25, 2–5 PM.",
  },
];
