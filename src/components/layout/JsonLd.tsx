import { site } from "@/config/site";

/** LocalBusiness structured data. Address is included only once verified. */
export function JsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: site.name,
    description: site.description,
    url: site.url,
    sameAs: [site.instagram.url],
  };
  if (site.address.verified) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode ?? undefined,
      addressCountry: "US",
    };
  }
  if (site.contact.phone) data.telephone = site.contact.phone;
  if (site.contact.email) data.email = site.contact.email;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
