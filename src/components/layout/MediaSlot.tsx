import Image from "next/image";
import { cn } from "cn";
import { media, type MediaKey } from "@/config/media";
import { LeafMark } from "@/components/brand/LeafMark";

const tones = {
  sand: "bg-sand/55",
  blush: "bg-blush/70",
  cream: "bg-cream-deep",
  olive: "bg-sage/35",
};

/**
 * Photography slot. Renders the real image when `src` is set in
 * src/config/media.ts; otherwise a quiet, clearly captioned placeholder so
 * the layout can be reviewed before studio photography is delivered.
 *
 * `fit="contain"` shows the whole image at its natural aspect inside the slot;
 * `imgClassName` can carry responsive object-position utilities, in which case
 * the config `position` is not applied inline.
 */
export function MediaSlot({
  id,
  className,
  imgClassName,
  fit = "cover",
  priority = false,
  quality = 82,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  id: MediaKey;
  className?: string;
  imgClassName?: string;
  fit?: "cover" | "contain";
  priority?: boolean;
  /** JPEG quality for the optimizer; 100 keeps small source files from softening further. */
  quality?: number;
  sizes?: string;
}) {
  const m = media[id];
  if (m.src) {
    return (
      <div className={cn("relative overflow-hidden", fit === "cover" && "bg-cream-deep", className)}>
        <Image
          src={m.src}
          alt={m.alt}
          fill
          priority={priority}
          sizes={sizes}
          quality={quality}
          className={cn(fit === "cover" ? "object-cover" : "object-contain", imgClassName)}
          style={imgClassName ? undefined : { objectPosition: m.position ?? "50% 50%" }}
        />
      </div>
    );
  }
  return (
    <div role="img" aria-label={m.alt} className={cn("relative overflow-hidden", tones[m.tone], className)}>
      <div aria-hidden className="absolute inset-4 border border-espresso/12" />
      <div aria-hidden className="absolute inset-0 flex items-center justify-center">
        <LeafMark className="size-12 text-espresso/25" />
      </div>
      <span aria-hidden className="absolute bottom-7 left-7 font-display text-sm italic text-espresso/55 sm:text-base">
        {m.caption}
      </span>
    </div>
  );
}
