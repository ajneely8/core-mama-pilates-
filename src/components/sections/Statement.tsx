import { site } from "@/config/site";
import { MediaSlot } from "@/components/layout/MediaSlot";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Reveal, RuleReveal } from "@/components/motion/Reveal";
import { Words } from "@/components/motion/Words";

export function Statement() {
  return (
    <section className="container-x py-24 md:py-32">
      <RuleReveal />
      <div className="grid gap-10 pt-12 md:grid-cols-12 md:pt-16">
        <Reveal className="md:col-span-4">
          <p className="eyebrow">The studio</p>
        </Reveal>
        <div className="md:col-span-8">
          <h2 className="display-lg max-w-3xl">
            <Words text={site.tagline} accentFrom={3} accentClassName="italic font-normal text-rose-deep" />
          </h2>
          <Reveal delay={0.1}>
            <p className="lede mt-8 max-w-2xl">
              Core Mama Pilates is a reformer studio built around the way you actually live. Reserve a time that fits,
              arrive to a calm, welcoming space, and move through your session at your own pace. No class schedule to
              work around, no pressure to keep up with the room, and childcare a few steps away.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-20 grid items-center gap-10 md:mt-28 md:grid-cols-12">
        <MediaReveal className="md:col-span-5 lg:col-span-4">
          <MediaSlot id="founder" className="aspect-[4/5] w-full" sizes="(min-width: 768px) 36vw, 100vw" />
        </MediaReveal>
        <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
          <p className="eyebrow text-rose-deep">Meet the mama behind CoreMama</p>
          <blockquote className="mt-6 font-display text-2xl leading-snug text-espresso md:text-3xl">
            &ldquo;{site.founder.quote}&rdquo;
          </blockquote>
          <p className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-espresso/70">
            Core Mama was built by a mom who knows how much planning it takes to carve out an hour for yourself. The
            studio is designed so that hour is easier to find and better when you get there.
          </p>
          <p className="mt-4 font-sans text-sm text-espresso/55">— {site.founder.firstName}, founder</p>
        </Reveal>
      </div>
    </section>
  );
}
