import type { ThemeShape } from "../store/theme.models";

/**
 * Mirrors `core/tokens/m3/_md-sys-shape.scss :: md-sys-shape-values()`
 */
export function buildShapeVariables(shape: ThemeShape): Record<string, string> {
  return {
    "corner-extra-large": `${shape.cornerExtraLarge}px`,
    "corner-extra-large-top": `${shape.cornerExtraLarge}px ${shape.cornerExtraLarge}px 0 0`,
    "corner-extra-small": `${shape.cornerExtraSmall}px`,
    "corner-extra-small-top": `${shape.cornerExtraSmall}px ${shape.cornerExtraSmall}px 0 0`,
    "corner-full": `${shape.cornerFull}px`,
    "corner-large": `${shape.cornerLarge}px`,
    "corner-large-end": `0 ${shape.cornerLarge}px ${shape.cornerLarge}px 0`,
    "corner-large-start": `${shape.cornerLarge}px 0 0 ${shape.cornerLarge}px`,
    "corner-large-top": `${shape.cornerLarge}px ${shape.cornerLarge}px 0 0`,
    "corner-medium": `${shape.cornerMedium}px`,
    "corner-none": "0",
    "corner-small": `${shape.cornerSmall}px`,
  };
}
