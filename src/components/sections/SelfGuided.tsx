import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaSlot } from "@/components/layout/MediaSlot";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Words } from "@/components/motion/Words";

const STEPS = [
  {
    n: "01",
    title: "Book Your Time",
    body: "Reserve a session online. One hour on a reformer, on the day and time that fits around your life.",
  },
  {
    n: "02",
    title: "Arrive & Settle In",
    body: "Enter the studio and get comfortable. Your reformer is ready, and your little ones can settle into CoreNest.",
  },
  {
    n: "03",
    title: "Move Your Way",
    body: "Choose a class from the on-demand library, put on your headphones, and enjoy your self-guided Pilates session at your pace.",
  },
];

export function SelfGuided() {
  return (
    <section id="self-guided" className="bg-sage/25 py-24 md:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow">Self-guided Pilates</p>
          </Reveal>
          <h2 className="display-lg mt-6">
            <Words text="Your Practice." />
            <br />
            <Words text="Your Pace." accentFrom={0} accentClassName="italic font-normal text-olive" />
          </h2>
          <Reveal delay={0.08}>
            <p className="lede mt-7">
              This isn&apos;t a conventional instructor-led group class. There&apos;s no teacher at the front of the
              room and no fixed start time. You book a reformer for yourself, pick from more than a thousand expert-led
              on-demand classes at your personal kiosk, and follow along at the pace that feels right for you.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-8 border-l-2 border-rose-deep pl-5">
              <p className="font-display text-xl italic text-espresso/85">Not a group class.</p>
              <p className="mt-1 font-sans text-sm leading-relaxed text-espresso/65">
                One reformer, reserved for you. Nobody counting reps for the room, nobody waiting on you.
              </p>
            </div>
          </Reveal>
          <MediaReveal className="mt-10 hidden lg:block" delay={0.1}>
            <MediaSlot id="selfGuided" className="aspect-[4/3] w-full" sizes="(min-width: 1024px) 40vw, 100vw" />
          </MediaReveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <RevealGroup role="list" className="border-t border-espresso/15">
            {STEPS.map((s) => (
              <RevealItem
                key={s.n}
                role="listitem"
                className="group grid grid-cols-[3.5rem_1fr] gap-5 border-b border-espresso/15 py-9 transition-colors duration-500 hover:bg-ivory/60 md:grid-cols-[5rem_1fr] md:py-11 md:px-4 md:-mx-4"
              >
                <span className="font-display text-3xl leading-none text-rose-deep transition-transform duration-500 group-hover:-translate-y-1 md:text-4xl">
                  {s.n}
                </span>
                <div>
                  <h3 className="display-md">{s.title}</h3>
                  <p className="mt-3 max-w-md font-sans text-[15px] leading-relaxed text-espresso/70">{s.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-sans text-sm text-espresso/60">All levels welcome. Ready when you are.</p>
            <Button render={<Link href="/book" />}>
              Book a Session <ArrowRight data-arrow />
            </Button>
          </Reveal>
          <MediaReveal className="mt-12 lg:hidden">
            <MediaSlot id="selfGuided" className="aspect-[4/3] w-full" />
          </MediaReveal>
        </div>
      </div>
    </section>
  );
}
