import "server-only";
import fs from "node:fs";
import path from "node:path";
import { media } from "@/config/media";

export type HeroImage = { src: string; width: number; height: number };

/**
 * Picks the front-page image. If a higher-resolution original has been
 * dropped at public/photos/corenest-hero.(png|jpg|jpeg|webp) it wins;
 * otherwise the Instagram pull in src/config/media.ts is used. Dimensions
 * are read from the file header so the hero can size its side fills.
 */
export function getHeroImage(): HeroImage {
  const candidates = ["corenest-hero.png", "corenest-hero.jpg", "corenest-hero.jpeg", "corenest-hero.webp"];
  for (const name of candidates) {
    const file = path.join(process.cwd(), "public", "photos", name);
    if (fs.existsSync(file)) {
      const dims = readDimensions(file);
      if (dims) return { src: `/photos/${name}`, ...dims };
    }
  }
  const fallback = media.hero.src ?? "";
  const file = path.join(process.cwd(), "public", fallback);
  const dims = (fs.existsSync(file) && readDimensions(file)) || { width: 640, height: 640 };
  return { src: fallback, ...dims };
}

function readDimensions(file: string): { width: number; height: number } | null {
  const b = fs.readFileSync(file);
  // PNG
  if (b[0] === 0x89 && b[1] === 0x50) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  // JPEG
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xc3) return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  // WebP (VP8X / VP8 / VP8L)
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const chunk = b.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (chunk === "VP8 ") return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }
  return null;
}
