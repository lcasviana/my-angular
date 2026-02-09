import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

import { M3PaletteGeneratorService } from "../services/m3-palette-generator.service";
import { getDensityTokens } from "../utils/density-token-map";
import { buildDarkColorVariables, buildLightColorVariables } from "../utils/m3-color-mappings";
import { buildShapeVariables } from "../utils/shape-mappings";
import { buildTypographyVariables } from "../utils/typography-mappings";
import type { ThemeConfig, ThemePalettes, ThemeShape, ThemeSourceColors, ThemeType, ThemeTypography } from "./theme.models";

const INITIAL_STATE: ThemeConfig = {
  sourceColors: {
    primary: "#7d00fa",
    secondary: "#645b70",
    tertiary: "#7d00fa",
    neutral: "#605d61",
    error: "#ba1a1a",
  },
  themeType: "light",
  typography: {
    brandFamily: "Roboto",
    plainFamily: "Roboto",
    boldWeight: 700,
    mediumWeight: 500,
    regularWeight: 400,
  },
  density: 0,
  shape: {
    cornerExtraSmall: 4,
    cornerSmall: 8,
    cornerMedium: 12,
    cornerLarge: 16,
    cornerExtraLarge: 28,
    cornerFull: 9999,
  },
};

export const ThemeStore = signalStore(
  { providedIn: "root" },
  withState(INITIAL_STATE),
  withComputed((store) => {
    const paletteGen = inject(M3PaletteGeneratorService);

    const palettes = computed<ThemePalettes>(() => {
      const colors = store.sourceColors();
      return {
        primary: paletteGen.generateTonalPalette(colors.primary),
        secondary: paletteGen.generateTonalPalette(colors.secondary),
        tertiary: paletteGen.generateTonalPalette(colors.tertiary),
        neutral: paletteGen.generateTonalPalette(colors.neutral),
        neutralVariant: paletteGen.generateNeutralVariantPalette(colors.neutral),
        error: paletteGen.generateTonalPalette(colors.error),
      };
    });

    const cssVariables = computed<Record<string, string>>(() => {
      const p = palettes();
      const themeType = store.themeType();
      const colorVars = themeType === "dark" ? buildDarkColorVariables(p) : buildLightColorVariables(p);
      const typographyVars = buildTypographyVariables(store.typography());
      const shapeVars = buildShapeVariables(store.shape());

      return { ...colorVars, ...typographyVars, ...shapeVars };
    });

    const densityTokens = computed<Record<string, string>>(() => getDensityTokens(store.density()));

    return { palettes, cssVariables, densityTokens };
  }),
  withMethods((store) => ({
    updateSourceColor(role: keyof ThemeSourceColors, hex: string): void {
      patchState(store, { sourceColors: { ...store.sourceColors(), [role]: hex } });
    },
    setThemeType(type: ThemeType): void {
      patchState(store, { themeType: type });
    },
    updateTypography(partial: Partial<ThemeTypography>): void {
      patchState(store, { typography: { ...store.typography(), ...partial } });
    },
    setDensity(scale: number): void {
      patchState(store, { density: Math.max(-3, Math.min(0, scale)) });
    },
    updateShape(partial: Partial<ThemeShape>): void {
      patchState(store, { shape: { ...store.shape(), ...partial } });
    },
    resetToDefaults(): void {
      patchState(store, INITIAL_STATE);
    },
  })),
);
