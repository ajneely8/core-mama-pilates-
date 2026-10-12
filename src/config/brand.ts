/**
 * Brand assets and palette.
 *
 * Palette status: SAMPLED. Colours were measured from the studio's own
 * Instagram photography and graphics (scripts/palette.mjs) and matched to the
 * wall wordmark (espresso "Core" + dusty-rose "Mama"), the blush lounge chairs,
 * the cream walls and the olive line-art mark. Official brand files, when they
 * arrive, replace these in src/app/globals.css (@theme) and here.
 */
export const brand = {
  palette: {
    cream: "#f7f1ea",
    creamDeep: "#eee5da",
    ivory: "#fbf8f3",
    sand: "#dccbb6",
    tan: "#a7876e",
    blush: "#ead6ce",
    rose: "#c08c84",
    roseDeep: "#a8736b",
    sage: "#a9b49a",
    olive: "#4f5236",
    espresso: "#3b2f27",
  },
  paletteStatus: "sampled" as "provisional" | "sampled" | "official",

  fonts: {
    display: "Cormorant Garamond",
    body: "Manrope",
    status: "provisional" as "provisional" | "official",
  },

  logo: {
    /**
     * The studio's mark: a line-art mother holding her baby, with a sage sprig
     * and a rose heart. Sourced from the public Instagram avatar (150px) and
     * converted to a transparent PNG by scripts/make-logo-mark.mjs. Replace
     * with the vector original (SVG) for crisp large sizes.
     */
    markOfficial: true,
    markSrc: "/brand/logo-mark.png",
    markIsVector: false,
    wordmark: "CoreMama",
    descriptor: "PILATES",
    /** Letters 0–3 ("Core") take the first colour, 4–7 ("Mama") the second. */
    wordmarkTwoTone: true,
  },
};
