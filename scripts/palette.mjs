// Samples dominant colours from the studio's photos so the palette is measured,
// not guessed. Usage: node scripts/palette.mjs public/photos
import fs from "node:fs";
import path from "node:path";
import jpeg from "jpeg-js";

const dir = process.argv[2] ?? "public/photos";
const files = fs.readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f));

const toHex = (r, g, b) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

function quantize(pixels, k = 6, iters = 12) {
  // tiny k-means on a sample of pixels
  let centers = pixels.filter((_, i) => i % Math.ceil(pixels.length / k) === 0).slice(0, k);
  for (let it = 0; it < iters; it++) {
    const sums = centers.map(() => [0, 0, 0, 0]);
    for (const p of pixels) {
      let best = 0;
      let bd = Infinity;
      centers.forEach((c, ci) => {
        const d = (c[0] - p[0]) ** 2 + (c[1] - p[1]) ** 2 + (c[2] - p[2]) ** 2;
        if (d < bd) {
          bd = d;
          best = ci;
        }
      });
      const s = sums[best];
      s[0] += p[0];
      s[1] += p[1];
      s[2] += p[2];
      s[3]++;
    }
    centers = sums.map((s, i) => (s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3], s[3]] : [...centers[i], 0]));
  }
  return centers
    .filter((c) => c[3] > 0)
    .sort((a, b) => b[3] - a[3])
    .map((c) => ({ hex: toHex(Math.round(c[0]), Math.round(c[1]), Math.round(c[2])), share: +(c[3] / pixels.length).toFixed(3) }));
}

const all = [];
for (const f of files) {
  const { data, width, height } = jpeg.decode(fs.readFileSync(path.join(dir, f)), { useTArray: true });
  const px = [];
  const step = Math.max(1, Math.floor((width * height) / 4000));
  for (let i = 0; i < width * height; i += step) {
    px.push([data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]);
  }
  all.push(...px);
  console.log(f.padEnd(28), quantize(px, 5).map((c) => `${c.hex} ${(c.share * 100).toFixed(0)}%`).join("  "));
}
console.log("\nOVERALL".padEnd(28), quantize(all, 8).map((c) => `${c.hex} ${(c.share * 100).toFixed(0)}%`).join("  "));
