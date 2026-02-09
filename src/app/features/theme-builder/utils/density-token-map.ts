/**
 * Static density token map extracted from Angular Material 21's component SCSS files.
 * Each entry maps a `--mat-{token-name}` to its values at density scales 0, -1, -2, -3.
 * Values at indices beyond a component's max supported scale are clamped.
 *
 * Source: `node_modules/@angular/material/{component}/_m3-{component}.scss`
 */

type DensityValues = [string, string, string, string];

// [scale 0, scale -1, scale -2, scale -3]
const DENSITY_TOKENS: Record<string, DensityValues> = {
  // Checkbox (max: -3)
  "checkbox-state-layer-size": ["40px", "36px", "32px", "28px"],

  // Chip (max: -2, clamped at -2 for -3)
  "chip-container-height": ["32px", "28px", "24px", "24px"],

  // Button (max: -3)
  "button-filled-container-height": ["40px", "36px", "32px", "28px"],
  "button-outlined-container-height": ["40px", "36px", "32px", "28px"],
  "button-protected-container-height": ["40px", "36px", "32px", "28px"],
  "button-text-container-height": ["40px", "36px", "32px", "28px"],
  "button-tonal-container-height": ["40px", "36px", "32px", "28px"],

  // Expansion (max: -3)
  "expansion-header-collapsed-state-height": ["48px", "44px", "40px", "36px"],
  "expansion-header-expanded-state-height": ["64px", "60px", "56px", "48px"],

  // Form Field (max: -3, clamped from -5)
  "form-field-container-height": ["56px", "52px", "48px", "44px"],
  "form-field-container-vertical-padding": ["16px", "14px", "12px", "10px"],
  "form-field-filled-with-label-container-padding-top": ["24px", "22px", "12px", "10px"],
  "form-field-filled-with-label-container-padding-bottom": ["8px", "6px", "12px", "10px"],

  // Icon Button (max: -3, clamped from -5)
  "icon-button-state-layer-size": ["40px", "36px", "32px", "28px"],

  // List (max: -3, clamped from -5)
  "list-list-item-leading-icon-start-space": ["16px", "12px", "8px", "4px"],
  "list-list-item-leading-icon-end-space": ["16px", "12px", "8px", "4px"],
  "list-list-item-one-line-container-height": ["48px", "44px", "40px", "36px"],
  "list-list-item-two-line-container-height": ["64px", "60px", "56px", "52px"],
  "list-list-item-three-line-container-height": ["88px", "84px", "80px", "76px"],

  // Paginator (max: -3, clamped from -5)
  "paginator-container-size": ["56px", "52px", "48px", "40px"],

  // Radio (max: -3)
  "radio-state-layer-size": ["40px", "36px", "32px", "28px"],

  // Tabs (max: -3, clamped from -4)
  "tab-container-height": ["48px", "44px", "40px", "36px"],

  // Button Toggle (max: -3, clamped from -4)
  "button-toggle-height": ["40px", "40px", "40px", "36px"],

  // Stepper (max: -3, clamped from -4)
  "stepper-header-height": ["72px", "68px", "64px", "60px"],

  // Table (max: -3, clamped from -4)
  "table-header-container-height": ["56px", "52px", "48px", "44px"],
  "table-footer-container-height": ["52px", "48px", "44px", "40px"],
  "table-row-item-container-height": ["52px", "48px", "44px", "40px"],

  // Toolbar (max: -3)
  "toolbar-standard-height": ["64px", "60px", "56px", "52px"],
  "toolbar-mobile-height": ["56px", "52px", "48px", "44px"],

  // Tree (max: -3, clamped from -4)
  "tree-node-min-height": ["48px", "44px", "40px", "36px"],
};

/**
 * Returns the density token overrides for a given scale.
 * Scale 0 returns empty (default values, no overrides needed).
 * Scales -1 to -3 return the corresponding token values.
 */
export function getDensityTokens(scale: number): Record<string, string> {
  if (scale >= 0) return {};

  const index = Math.min(Math.abs(scale), 3);
  const result: Record<string, string> = {};

  for (const [token, values] of Object.entries(DENSITY_TOKENS)) {
    result[token] = values[index];
  }

  return result;
}
