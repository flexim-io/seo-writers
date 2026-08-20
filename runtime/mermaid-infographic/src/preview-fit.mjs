import {
  DESIGN_TOKENS,
  tokenBoolean,
  tokenNumber,
  tokenOptionalNumber,
} from "./tokens.mjs";

export const PREVIEW_LAYOUT = Object.freeze({
  mobileFullWidthThreshold: tokenNumber(
    DESIGN_TOKENS,
    "--flexim-canvas-mobile-full-width-threshold",
  ),
});

const FULL_WIDTH_FIT = Object.freeze({
  allowUpscale: tokenBoolean(
    DESIGN_TOKENS,
    "--flexim-fit-full-width-allow-upscale",
  ),
  contentInset: tokenOptionalNumber(
    DESIGN_TOKENS,
    "--flexim-fit-full-width-content-inset",
  ),
  minimumWidthRatio: tokenNumber(
    DESIGN_TOKENS,
    "--flexim-fit-full-width-minimum-width-ratio",
  ),
});

const EDGE_TO_EDGE_FIT = Object.freeze({
  ...FULL_WIDTH_FIT,
  framePadding: tokenNumber(
    DESIGN_TOKENS,
    "--flexim-fit-edge-to-edge-frame-padding",
  ),
});

export const PREVIEW_FIT_MAP = Object.freeze({
  default: Object.freeze({
    allowUpscale: tokenBoolean(
      DESIGN_TOKENS,
      "--flexim-fit-default-allow-upscale",
    ),
    contentInset: tokenOptionalNumber(
      DESIGN_TOKENS,
      "--flexim-fit-default-content-inset",
    ),
    minimumWidthRatio: tokenNumber(
      DESIGN_TOKENS,
      "--flexim-fit-default-minimum-width-ratio",
    ),
  }),
  journey: Object.freeze({
    allowUpscale: tokenBoolean(
      DESIGN_TOKENS,
      "--flexim-fit-journey-allow-upscale",
    ),
    contentInset: tokenOptionalNumber(
      DESIGN_TOKENS,
      "--flexim-fit-journey-content-inset",
    ),
    minimumWidthRatio: tokenNumber(
      DESIGN_TOKENS,
      "--flexim-fit-journey-minimum-width-ratio",
    ),
  }),
  sequenceDiagram: FULL_WIDTH_FIT,
  classDiagram: FULL_WIDTH_FIT,
  "ishikawa-beta": FULL_WIDTH_FIT,
  "cynefin-beta": EDGE_TO_EDGE_FIT,
});
