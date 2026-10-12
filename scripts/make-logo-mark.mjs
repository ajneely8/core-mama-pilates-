// Turns the studio's avatar (dark line art on white) into a transparent PNG so
// the mark sits cleanly on the cream page. Usage:
//   node scripts/make-logo-mark.mjs public/photos/avatar.jpg public/brand/logo-mark.png
import fs from "node:fs";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";

const [, , input = "public/photos/avatar.jpg", output = "public/brand/logo-mark.png"] = process.argv;
const { data, width, height } = jpeg.decode(fs.readFileSync(input), { useTArray: true });
const png = new PNG({ width, height });
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
for (let i = 0; i < width * height; i++) {
  const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
  // distance from white, normalised 0..1
  const d = Math.sqrt((255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2) / 441.67;
  const a = Math.max(0, Math.min(1, d / 0.34));
  // un-premultiply against white so anti-aliased edges keep their hue
  const un = (c) => (a > 0 ? clamp(255 - (255 - c) / a) : 0);
  png.data[i * 4] = un(r);
  png.data[i * 4 + 1] = un(g);
  png.data[i * 4 + 2] = un(b);
  png.data[i * 4 + 3] = clamp(a * 255);
}
fs.writeFileSync(output, PNG.sync.write(png));
console.log(`wrote ${output} (${width}x${height})`);
