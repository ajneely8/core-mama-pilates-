import { MapPin, Mail, Phone } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { site } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { Words } from "@/components/motion/Words";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 bg-sage/20 py-24 md:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow">Contact</p>
          </Reveal>
          <h2 className="display-lg mt-6">
            <Words text="Say hello." accentFrom={1} accentClassName="italic font-normal text-olive" />
          </h2>
          <Reveal>
            <p className="lede mt-7 max-w-md">
              Questions about sessions, memberships, or childcare? Send a note or find us on Instagram.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-10 space-y-5 font-sans text-[15px] text-espresso/80">
              <li className="flex items-start gap-3">
                <Instagram className="mt-0.5 size-4 text-olive" />
                <a href={site.instagram.url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                  @{site.instagram.handle}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-olive" strokeWidth={1.5} />
                <span>
                  {site.address.line1}, {site.address.city}, {site.address.region}
                  {!site.address.verified && (
                    <span className="block font-sans text-xs text-espresso/50">Location details being finalized</span>
                  )}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 text-olive" strokeWidth={1.5} />
                {site.contact.email ? (
                  <a href={`mailto:${site.contact.email}`} className="underline-offset-4 hover:underline">
                    {site.contact.email}
                  </a>
                ) : (
                  <span className="text-espresso/50">Email address coming soon</span>
                )}
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 text-olive" strokeWidth={1.5} />
                {site.contact.phone ? (
                  <a href={`tel:${site.contact.phone}`} className="underline-offset-4 hover:underline">
                    {site.contact.phone}
                  </a>
                ) : (
                  <span className="text-espresso/50">Phone number coming soon</span>
                )}
              </li>
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-sm border border-espresso/10 bg-ivory p-7 shadow-[0_30px_60px_-40px_rgba(59,47,39,0.35)] sm:p-10">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
