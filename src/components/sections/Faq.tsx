import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/Reveal";
import type { FaqItem } from "@/content/faq";

export function Faq({
  items,
  eyebrow = "Questions",
  title = "Questions, answered.",
  compact = false,
}: {
  items: FaqItem[];
  eyebrow?: string;
  title?: string;
  compact?: boolean;
}) {
  return (
    <section id="faq" className={compact ? "scroll-mt-20 py-20" : "scroll-mt-20 bg-ivory py-24 md:py-32"}>
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="display-lg mt-6">{title}</h2>
            {!compact && (
              <p className="mt-6 font-sans text-sm text-espresso/60">
                Something else on your mind?{" "}
                <Link href="/#contact" className="text-espresso underline underline-offset-4">
                  Get in touch
                </Link>
                .
              </p>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
          <Accordion className="border-t border-espresso/12">
            {items.map((f) => (
              <AccordionItem key={f.id} value={f.id} className="border-b border-espresso/12">
                <AccordionTrigger className="py-5 font-display text-xl text-espresso hover:no-underline md:py-6 md:text-2xl [&_svg]:mt-1.5 [&_svg]:size-4 [&_svg]:text-espresso/50">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 font-sans text-[15px] leading-relaxed text-espresso/72">
                  <p>{f.answer}</p>
                  {f.toConfirm && (
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-olive/30 px-2.5 py-1 font-sans text-[11px] font-medium tracking-wide text-olive uppercase">
                      <span className="size-1 rounded-full bg-olive" /> Studio to confirm
                    </span>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
