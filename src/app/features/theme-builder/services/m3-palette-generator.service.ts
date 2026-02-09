import { Injectable } from "@angular/core";
import { argbFromHex, Hct, hexFromArgb, TonalPalette } from "@material/material-color-utilities";

import type { TonalPalette as TonalPaletteMap } from "../store/theme.models";

const REQUIRED_TONES = [0, 4, 6, 10, 12, 17, 20, 22, 24, 25, 30, 35, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100] as const;

@Injectable({ providedIn: "root" })
export class M3PaletteGeneratorService {
  generateTonalPalette(hexColor: string): TonalPaletteMap {
    const argb = argbFromHex(hexColor);
    const palette = TonalPalette.fromInt(argb);
    const result: Record<number, string> = {};
    for (const tone of REQUIRED_TONES) {
      result[tone] = hexFromArgb(palette.tone(tone));
    }
    return result;
  }

  generateNeutralVariantPalette(hexColor: string): TonalPaletteMap {
    const argb = argbFromHex(hexColor);
    const hct = Hct.fromInt(argb);
    const palette = TonalPalette.fromHueAndChroma(hct.hue, Math.max(hct.chroma, 6));
    const result: Record<number, string> = {};
    for (const tone of REQUIRED_TONES) {
      result[tone] = hexFromArgb(palette.tone(tone));
    }
    return result;
  }
}
