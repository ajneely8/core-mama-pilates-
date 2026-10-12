import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Words } from "@/components/motion/Words";

const STEPS = [
  { n: "01", title: "Reserve online", body: "Pick a session, a date, and a time." },
  { n: "02", title: "Get your details", body: "Your reservation summary, ready to save." },
  { n: "03", title: "Arrive & settle in", body: "Come in, get comfortable, take a breath." },
  { n: "04", title: "Move your way", body: "Your reformer, your session, your pace." },
  { n: "05", title: "Rebook anytime", body: "Same simple flow, whenever it suits." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-espresso py-24 text-cream md:py-32">
      <div className="container-x">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow text-sage">How it works</p>
          </Reveal>
          <h2 className="display-lg mt-6 text-cream">
            <Words text="Simple on purpose." accentFrom={2} accentClassName="italic font-normal text-rose" />
          </h2>
        </div>

        <RevealGroup
          role="list"
          className="mt-14 grid gap-x-8 gap-y-10 border-t border-cream/15 pt-10 sm:grid-cols-2 lg:grid-cols-5"
        >
          {STEPS.map((s) => (
            <RevealItem key={s.n} role="listitem" className="group">
              <span className="inline-flex size-9 items-center justify-center rounded-full border border-cream/25 font-sans text-[11px] font-semibold tracking-[0.1em] text-rose transition-colors duration-500 group-hover:border-rose group-hover:bg-rose group-hover:text-espresso">
                {s.n}
              </span>
              <h3 className="mt-5 font-display text-2xl leading-tight text-cream">{s.title}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-cream/65">{s.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button size="lg" variant="cream" render={<Link href="/book" />}>
            Book a Session <ArrowRight data-arrow />
          </Button>
          <Button
            size="lg"
            variant="link"
            className="text-cream/80 hover:text-cream"
            render={<Link href="/book?type=studio-tour" />}
          >
            Or book a studio tour first
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
