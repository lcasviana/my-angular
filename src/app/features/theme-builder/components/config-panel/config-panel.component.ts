import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatButton } from "@angular/material/button";
import { MatButtonToggle, MatButtonToggleGroup } from "@angular/material/button-toggle";
import { MatDialog } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatSlider, MatSliderThumb } from "@angular/material/slider";

import { FontLoaderService, GOOGLE_FONTS } from "../../services/font-loader.service";
import type { ThemeSourceColors } from "../../store/theme.models";
import { ThemeStore } from "../../store/theme.store";
import { ExportPanel } from "../export-panel/export-panel.component";
import { ColorPickerField } from "./color-picker-field.component";

@Component({
  selector: "my-config-panel",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ColorPickerField,
    FormsModule,
    MatButton,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatExpansionModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSlider,
    MatSliderThumb,
  ],
  template: `
    <div class="p-4">
      <h2 class="mb-4 text-xl font-medium">Theme Configuration</h2>

      <mat-accordion multi>
        <!-- Colors -->
        <mat-expansion-panel expanded>
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon class="mr-2">palette</mat-icon>
              Colors
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div class="flex flex-col gap-3">
            <my-color-picker-field label="Primary" [value]="store.sourceColors().primary" (valueChange)="onColorChange('primary', $event)" />
            <my-color-picker-field label="Secondary" [value]="store.sourceColors().secondary" (valueChange)="onColorChange('secondary', $event)" />
            <my-color-picker-field label="Tertiary" [value]="store.sourceColors().tertiary" (valueChange)="onColorChange('tertiary', $event)" />
            <my-color-picker-field label="Neutral" [value]="store.sourceColors().neutral" (valueChange)="onColorChange('neutral', $event)" />
            <my-color-picker-field label="Error" [value]="store.sourceColors().error" (valueChange)="onColorChange('error', $event)" />
          </div>
        </mat-expansion-panel>

        <!-- Theme Type -->
        <mat-expansion-panel expanded>
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon class="mr-2">contrast</mat-icon>
              Theme Type
            </mat-panel-title>
          </mat-expansion-panel-header>
          <mat-button-toggle-group [value]="store.themeType()" (change)="store.setThemeType($event.value)" class="w-full">
            <mat-button-toggle value="light" class="flex-1"> Light </mat-button-toggle>
            <mat-button-toggle value="dark" class="flex-1"> Dark </mat-button-toggle>
          </mat-button-toggle-group>
        </mat-expansion-panel>

        <!-- Typography -->
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon class="mr-2">text_fields</mat-icon>
              Typography
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div class="flex flex-col gap-3">
            <mat-form-field subscriptSizing="dynamic">
              <mat-label>Brand Font (Headings)</mat-label>
              <mat-select [value]="store.typography().brandFamily" (selectionChange)="onFontChange('brandFamily', $event.value)">
                @for (font of fonts; track font) {
                  <mat-option [value]="font">{{ font }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field subscriptSizing="dynamic">
              <mat-label>Plain Font (Body)</mat-label>
              <mat-select [value]="store.typography().plainFamily" (selectionChange)="onFontChange('plainFamily', $event.value)">
                @for (font of fonts; track font) {
                  <mat-option [value]="font">{{ font }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>
        </mat-expansion-panel>

        <!-- Density -->
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon class="mr-2">density_small</mat-icon>
              Density
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div>
            <p class="mb-1 text-sm">Scale: {{ store.density() }}</p>
            <mat-slider min="-3" max="0" step="1" class="w-full">
              <input matSliderThumb aria-label="Density scale" [ngModel]="store.density()" (ngModelChange)="store.setDensity($event)" />
            </mat-slider>
          </div>
        </mat-expansion-panel>

        <!-- Shape -->
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon class="mr-2">rounded_corner</mat-icon>
              Shape
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div class="flex flex-col gap-3">
            <mat-form-field subscriptSizing="dynamic">
              <mat-label>Extra Small (px)</mat-label>
              <input
                matInput
                type="number"
                [ngModel]="store.shape().cornerExtraSmall"
                (ngModelChange)="store.updateShape({ cornerExtraSmall: $event })"
              />
            </mat-form-field>
            <mat-form-field subscriptSizing="dynamic">
              <mat-label>Small (px)</mat-label>
              <input matInput type="number" [ngModel]="store.shape().cornerSmall" (ngModelChange)="store.updateShape({ cornerSmall: $event })" />
            </mat-form-field>
            <mat-form-field subscriptSizing="dynamic">
              <mat-label>Medium (px)</mat-label>
              <input matInput type="number" [ngModel]="store.shape().cornerMedium" (ngModelChange)="store.updateShape({ cornerMedium: $event })" />
            </mat-form-field>
            <mat-form-field subscriptSizing="dynamic">
              <mat-label>Large (px)</mat-label>
              <input matInput type="number" [ngModel]="store.shape().cornerLarge" (ngModelChange)="store.updateShape({ cornerLarge: $event })" />
            </mat-form-field>
            <mat-form-field subscriptSizing="dynamic">
              <mat-label>Extra Large (px)</mat-label>
              <input
                matInput
                type="number"
                [ngModel]="store.shape().cornerExtraLarge"
                (ngModelChange)="store.updateShape({ cornerExtraLarge: $event })"
              />
            </mat-form-field>
          </div>
        </mat-expansion-panel>
      </mat-accordion>

      <!-- Actions -->
      <div class="mt-4 flex flex-col gap-2">
        <button matButton="filled" (click)="openExport()" class="w-full">
          <mat-icon>download</mat-icon>
          Export SCSS
        </button>
        <button matButton="outlined" (click)="store.resetToDefaults()" class="w-full">
          <mat-icon>restart_alt</mat-icon>
          Reset
        </button>
      </div>
    </div>
  `,
})
export class ConfigPanel {
  readonly store = inject(ThemeStore);
  readonly #fontLoader = inject(FontLoaderService);
  readonly #dialog = inject(MatDialog);
  readonly fonts = GOOGLE_FONTS;

  openExport(): void {
    this.#dialog.open(ExportPanel, { width: "700px", maxHeight: "80vh" });
  }

  onColorChange(role: keyof ThemeSourceColors, hex: string): void {
    this.store.updateSourceColor(role, hex);
  }

  onFontChange(field: "brandFamily" | "plainFamily", fontFamily: string): void {
    this.#fontLoader.loadFont(fontFamily);
    this.store.updateTypography({ [field]: fontFamily });
  }
}
