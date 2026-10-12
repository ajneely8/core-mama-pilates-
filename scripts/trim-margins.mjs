// Trims flat white side margins from Instagram exports (or crops a fixed left
// fraction). Usage: node scripts/trim-margins.mjs <in.jpg> <out.jpg> [leftFraction]
import fs from "node:fs";
import jpeg from "jpeg-js";

const [, , input, output, leftFracArg] = process.argv;
const src = jpeg.decode(fs.readFileSync(input), { useTArray: true });
const { width, height, data } = src;

function colMin(x) {
  let s = 0;
  for (let y = 0; y < height; y += 3) {
    const i = (y * width + x) * 4;
    s += Math.min(data[i], data[i + 1], data[i + 2]);
  }
  return s / Math.ceil(height / 3);
}

let left = 0;
let right = width - 1;
if (leftFracArg) {
  left = Math.round(width * Number(leftFracArg));
} else {
  while (left < width && colMin(left) > 243) left++;
  while (right > 0 && colMin(right) > 243) right--;
  // ignore tiny antialias slivers
  if (left < 4) left = 0;
  if (width - 1 - right < 4) right = width - 1;
}
const w = right - left + 1;
const out = Buffer.alloc(w * height * 4);
for (let y = 0; y < height; y++) {
  const rowStart = (y * width + left) * 4;
  out.set(data.subarray(rowStart, rowStart + w * 4), y * w * 4);
}
fs.writeFileSync(output, jpeg.encode({ data: out, width: w, height }, 92).data);
console.log(`${input} -> ${output}: cut left ${left}px, right ${width - 1 - right}px => ${w}x${height}`);
