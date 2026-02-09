export type TonalPalette = Record<number, string>;

export interface ThemeSourceColors {
  readonly primary: string;
  readonly secondary: string;
  readonly tertiary: string;
  readonly neutral: string;
  readonly error: string;
}

export type ThemeType = "light" | "dark";

export interface ThemeTypography {
  readonly brandFamily: string;
  readonly plainFamily: string;
  readonly boldWeight: number;
  readonly mediumWeight: number;
  readonly regularWeight: number;
}

export interface ThemeShape {
  readonly cornerExtraSmall: number;
  readonly cornerSmall: number;
  readonly cornerMedium: number;
  readonly cornerLarge: number;
  readonly cornerExtraLarge: number;
  readonly cornerFull: number;
}

export interface ThemeConfig {
  readonly sourceColors: ThemeSourceColors;
  readonly themeType: ThemeType;
  readonly typography: ThemeTypography;
  readonly density: number;
  readonly shape: ThemeShape;
}

export interface ThemePalettes {
  readonly primary: TonalPalette;
  readonly secondary: TonalPalette;
  readonly tertiary: TonalPalette;
  readonly neutral: TonalPalette;
  readonly neutralVariant: TonalPalette;
  readonly error: TonalPalette;
}
