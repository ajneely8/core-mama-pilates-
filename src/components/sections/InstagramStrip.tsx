"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { instagramPosts } from "@/config/media";
import { site } from "@/config/site";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { Reveal } from "@/components/motion/Reveal";
import { EASE } from "@/components/motion/Reveal";

/** The studio's own posts, shown whole, each linking back to Instagram. */
export function InstagramStrip() {
  return (
    <section aria-labelledby="follow" className="overflow-hidden py-20 md:py-24">
      <div className="container-x flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <p className="eyebrow text-rose-deep">Follow along</p>
          <h2 id="follow" className="display-md mt-3">
            From the studio&apos;s Instagram
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-espresso underline-offset-4 hover:underline"
          >
            <InstagramIcon className="size-4" /> @{site.instagram.handle}
          </a>
        </Reveal>
      </div>

      <motion.ul
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 sm:px-8 lg:px-12 [scrollbar-width:thin]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        {instagramPosts.map((p, i) => (
          <motion.li
            key={p.src}
            className="w-[72vw] shrink-0 snap-start sm:w-[44vw] lg:w-[300px]"
            variants={{
              hidden: { opacity: 0, y: 30, rotate: i % 2 ? 1.5 : -1.5 },
              show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.9, ease: EASE } },
            }}
          >
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="group relative block overflow-hidden rounded-sm bg-cream-deep shadow-[0_20px_40px_-30px_rgba(59,47,39,0.5)] transition-transform duration-500 hover:-translate-y-2"
              style={{ aspectRatio: p.ratio }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 300px, 72vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <span className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-cream/90 text-espresso opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ArrowUpRight className="size-4" />
              </span>
            </a>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
