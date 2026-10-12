# Brand assets

Drop official files here:

- `logo-mark.svg` — the mother-and-baby line illustration as a single-colour
  vector (paths, not embedded raster). Then set `brand.logo.markOfficial = true`
  in `src/config/brand.ts`.
- Wordmark — if the studio has its own wordmark outlines, paste the path data
  into `src/components/brand/wordmark-paths.ts` (one entry per letter keeps the
  draw-on animation staggered), or re-run `npm run wordmark -- <font.ttf>` with
  the studio's licensed display font.
- Photography — place files in `public/photos/` and point each slot in
  `src/config/media.ts` at them.
