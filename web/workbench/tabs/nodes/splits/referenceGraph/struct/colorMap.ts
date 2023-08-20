import { CSSProperties } from "react";
import { tokens } from "@fluentui/react-components";

export const EDGE_STYLE_MAP: Record<string, CSSProperties> = {
  property: { color: tokens.colorPaletteBerryForeground2, fontWeight: 700 },
  internal: { color: tokens.colorPaletteBeigeBorderActive },
  context: { color: tokens.colorPaletteBeigeBorderActive },
  element: { color: tokens.colorPaletteBeigeBorderActive },
  hidden: { color: tokens.colorPaletteBeigeBorderActive },
  shortcut: { color: tokens.colorPaletteBeigeBorderActive },
  weak: { color: tokens.colorPaletteBeigeBorderActive },
};

export const NODE_STYLE_MAP: Record<string, CSSProperties> = {
  hidden: {
    color: tokens.colorPaletteBeigeBorderActive,
  },
  array: {},
  string: {
    color: tokens.colorPaletteRedForeground1,
  },
  object: {},
  code: {},
  closure: {
    color: tokens.colorPaletteGreenForeground1,
    fontStyle: "italic",
  },
  regexp: {
    color: tokens.colorPaletteRedForeground1,
  },
  number: {
    color: tokens.colorPaletteNavyBorderActive,
  },
  native: {},
  synthetic: {},
  "concatenated string": {
    color: tokens.colorPaletteRedForeground1,
  },
  "sliced string": {
    color: tokens.colorPaletteRedForeground1,
  },
  symbol: {
    color: tokens.colorPaletteGreenForeground1,
  },
  bigint: {
    color: tokens.colorPaletteGreenForeground1,
  },
  "object shape": {},
};
