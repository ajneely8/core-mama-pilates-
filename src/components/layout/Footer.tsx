import Link from "next/link";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { site } from "@/config/site";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { LeafMark } from "@/components/brand/LeafMark";

const studioLinks = [
  { href: "/#experience", label: "The Studio" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/book", label: "Book a Session" },
  { href: "/#memberships", label: "Memberships" },
  { href: "/founding-members", label: "Founding Members" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-espresso text-cream">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
        <div className="max-w-sm">
          <LogoLockup size="md" onDark />
          <p className="mt-5 font-display text-xl italic text-cream/85">{site.tagline}</p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-cream/65">
            Self-guided reformer Pilates with on-site childcare in {site.address.city}, {site.address.region}. Reserve
            a reformer, settle in, and move at your own pace.
          </p>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-sans text-sm font-medium text-cream transition-colors hover:text-rose"
          >
            <Instagram className="size-4" /> @{site.instagram.handle}
          </a>
        </div>

        <div>
          <p className="eyebrow text-sage">Studio</p>
          <ul className="mt-4 space-y-2.5 font-sans text-sm text-cream/75">
            {studioLinks.map((l) => (
              <li key={l.href}>
                <Link className="transition-colors hover:text-cream" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-sage">Visit</p>
          <address className="mt-4 font-sans text-sm leading-relaxed text-cream/80 not-italic">
            {site.address.line1}
            <br />
            {site.address.city}, {site.address.region} {site.address.postalCode ?? ""}
          </address>
          <p className="mt-3 font-sans text-xs text-cream/50">
            {site.hours.note}
            {!site.address.verified && " Location details are being finalized."}
          </p>
          <p className="mt-3 font-sans text-sm text-cream/80">
            Self-guided reformer Pilates · {site.amenities.childcare.name} childcare
          </p>
          <p className="mt-3 font-sans text-sm text-cream/80">
            {site.contact.email ?? <span className="text-cream/50">Email coming soon</span>}
            <br />
            {site.contact.phone ?? <span className="text-cream/50">Phone coming soon</span>}
          </p>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col items-start justify-between gap-3 py-6 font-sans text-xs text-cream/50 sm:flex-row sm:items-center">
          <p className="inline-flex items-center gap-2">
            <LeafMark className="size-4 text-sage" /> © {year} {site.name}. All rights reserved.
          </p>
          <p>
            {site.credit.url ? (
              <a href={site.credit.url} className="hover:text-cream">
                {site.credit.label}
              </a>
            ) : (
              site.credit.label
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
