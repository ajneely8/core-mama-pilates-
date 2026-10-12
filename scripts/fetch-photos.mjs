// Downloads a list of {name,url} images into a folder.
// Usage: node scripts/fetch-photos.mjs <urls.json> <outDir>
// Used once to pull the studio's own public Instagram photos for the demo.
import fs from "node:fs";
import path from "node:path";

const [, , listPath, outDir = "public/photos"] = process.argv;
const list = JSON.parse(fs.readFileSync(listPath, "utf8"));
fs.mkdirSync(outDir, { recursive: true });

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
  Referer: "https://www.instagram.com/",
};

for (const item of list) {
  const variants = [item.url];
  // Try a larger avatar if the CDN accepts it.
  if (item.name === "avatar") variants.unshift(item.url.replace("s150x150", "s320x320"));
  let saved = false;
  for (const url of variants) {
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) {
        console.log(`${item.name}: ${res.status} for ${url.slice(0, 60)}…`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      const file = path.join(outDir, `${item.name}.jpg`);
      fs.writeFileSync(file, buf);
      console.log(`${item.name}: ${(buf.length / 1024).toFixed(0)} KB`);
      saved = true;
      break;
    } catch (e) {
      console.log(`${item.name}: ${e.message}`);
    }
  }
  if (!saved) console.log(`${item.name}: FAILED`);
}
