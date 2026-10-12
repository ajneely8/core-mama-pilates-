import { Clock, HeartHandshake, Baby, Headphones, MapPin, Users } from "lucide-react";
import { cn } from "cn";
import { site } from "@/config/site";
import { MediaSlot } from "@/components/layout/MediaSlot";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Words } from "@/components/motion/Words";

const BENEFITS = [
  {
    icon: Clock,
    title: "Flexible scheduling",
    body: "No rushing to make class times. Book the hour that fits, early, late, or between naps.",
    tone: "bg-blush text-espresso",
    icon_tone: "text-rose-deep",
  },
  {
    icon: HeartHandshake,
    title: "A non-intimidating environment",
    body: "A calm, light-filled space designed to feel like a breath, not a performance. Move at your own pace with supportive guidance.",
    tone: "bg-sage/45 text-espresso",
    icon_tone: "text-olive",
  },
  {
    icon: Baby,
    title: "Integrated childcare",
    body: `Take care of yourself; ${site.amenities.childcare.name} takes care of them. Thoughtful care for little ones a few steps from your reformer.`,
    tone: "bg-sand/60 text-espresso",
    icon_tone: "text-tan",
  },
];

export function Experience() {
  const childcare = site.amenities.childcare;
  const amenities = [
    { icon: Headphones, label: site.amenities.onDemand.label },
    { icon: Clock, label: `${site.amenities.sessionLength} · all levels welcome` },
    {
      icon: Baby,
      label:
        childcare.status === "none"
          ? null
          : childcare.status === "confirmed"
            ? `${childcare.name} childcare · ages ${childcare.ages}`
            : "Childcare · details to be confirmed",
    },
    { icon: Users, label: "Up to 2 children per family per reservation" },
    { icon: MapPin, label: `${site.address.line1}, ${site.address.city}` },
  ].filter((a): a is { icon: typeof Headphones; label: string } => Boolean(a.label));

  return (
    <section id="experience" className="scroll-mt-20 py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="eyebrow">Studio experience</p>
            </Reveal>
            <h2 className="display-lg mt-6">
              <Words text="A studio that fits around you." accentFrom={4} />
            </h2>
          </div>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
            <p className="lede">
              Most Pilates studios ask you to fit around them. Core Mama is built the other way round: a reformer
              reserved for you, a session you lead, childcare on site, and a space that feels good to walk into.
            </p>
          </Reveal>
        </div>

        <RevealGroup role="list" className="mt-16 grid gap-4 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <RevealItem
              key={b.title}
              role="listitem"
              className={cn(
                "group rounded-sm p-8 transition-transform duration-500 hover:-translate-y-1.5 md:p-10",
                b.tone,
              )}
            >
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-ivory/70 transition-transform duration-500 group-hover:rotate-6">
                <b.icon className={cn("size-5", b.icon_tone)} strokeWidth={1.5} />
              </span>
              <h3 className="display-md mt-8">{b.title}</h3>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-espresso/75">{b.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-12">
          <MediaReveal className="mx-auto w-full max-w-xs lg:col-span-4 lg:mx-0 lg:max-w-none">
            <MediaSlot id="experience" className="aspect-[340/640] w-full" sizes="(min-width: 1024px) 34vw, 80vw" />
          </MediaReveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-6">
            <p className="eyebrow">In the studio</p>
            <ul className="mt-6 space-y-4">
              {amenities.map((a) => (
                <li
                  key={a.label}
                  className="flex items-start gap-3 border-b border-espresso/10 pb-4 font-sans text-[15px] text-espresso/80"
                >
                  <a.icon className="mt-0.5 size-4 shrink-0 text-olive" strokeWidth={1.5} />
                  {a.label}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-sans text-xs leading-relaxed text-espresso/50">
              Studio hours and the full class library will be confirmed by the studio before opening.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
