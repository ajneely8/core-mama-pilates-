import { Hero } from "@/components/sections/Hero";
import { SoftOpening } from "@/components/sections/SoftOpening";
import { Statement } from "@/components/sections/Statement";
import { SelfGuided } from "@/components/sections/SelfGuided";
import { Experience } from "@/components/sections/Experience";
import { Childcare } from "@/components/sections/Childcare";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Memberships } from "@/components/sections/Memberships";
import { FoundingMember } from "@/components/sections/FoundingMember";
import { Faq } from "@/components/sections/Faq";
import { InstagramStrip } from "@/components/sections/InstagramStrip";
import { Contact } from "@/components/sections/Contact";
import { Marquee } from "@/components/motion/Marquee";
import { homeFaq } from "@/content/faq";
import { getHeroImage } from "@/lib/hero-image";

export default function HomePage() {
  const heroImage = getHeroImage();
  return (
    <>
      <Hero image={heroImage} />
      <Marquee
        tone="rose"
        items={[
          "Self-guided reformer Pilates",
          "1,000+ on-demand classes",
          "CoreNest childcare on site",
          "Your pace, your hour",
          "Yuba City, California",
        ]}
      />
      <SoftOpening />
      <Statement />
      <SelfGuided />
      <Experience />
      <Childcare />
      <HowItWorks />
      <Memberships />
      <Marquee
        tone="olive"
        items={["Month-to-month", "No enrollment fees", "No cancellation fees", "No minimum commitment", "All levels welcome"]}
      />
      <FoundingMember />
      <Faq items={homeFaq} />
      <InstagramStrip />
      <Contact />
    </>
  );
}
