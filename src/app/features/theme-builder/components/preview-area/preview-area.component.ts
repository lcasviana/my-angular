import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, viewChild, ViewEncapsulation } from "@angular/core";

import { MatTab, MatTabGroup } from "@angular/material/tabs";

import { CssVariableApplierService } from "../../services/css-variable-applier.service";
import { ThemeStore } from "../../store/theme.store";
import { PreviewButtons } from "./preview-buttons.component";
import { PreviewCards } from "./preview-cards.component";
import { PreviewDialogs } from "./preview-dialogs.component";
import { PreviewForms } from "./preview-forms.component";
import { PreviewNavigation } from "./preview-navigation.component";
import { PreviewTable } from "./preview-table.component";
import { PreviewTypography } from "./preview-typography.component";

@Component({
  selector: "my-preview-area",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatTab, MatTabGroup, PreviewButtons, PreviewCards, PreviewDialogs, PreviewForms, PreviewNavigation, PreviewTable, PreviewTypography],
  template: `
    <div #previewContainer class="min-h-full p-6">
      <h2 class="mb-4 text-2xl font-medium">Live Preview</h2>
      <mat-tab-group>
        <mat-tab label="Buttons">
          <div class="p-4">
            <my-preview-buttons />
          </div>
        </mat-tab>
        <mat-tab label="Cards">
          <div class="p-4">
            <my-preview-cards />
          </div>
        </mat-tab>
        <mat-tab label="Forms">
          <div class="p-4">
            <my-preview-forms />
          </div>
        </mat-tab>
        <mat-tab label="Table">
          <div class="p-4">
            <my-preview-table />
          </div>
        </mat-tab>
        <mat-tab label="Dialogs">
          <div class="p-4">
            <my-preview-dialogs />
          </div>
        </mat-tab>
        <mat-tab label="Navigation">
          <div class="p-4">
            <my-preview-navigation />
          </div>
        </mat-tab>
        <mat-tab label="Typography">
          <div class="p-4">
            <my-preview-typography />
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class PreviewArea {
  private readonly previewContainer = viewChild.required<ElementRef<HTMLElement>>("previewContainer");
  readonly themeStore = inject(ThemeStore);
  private readonly cssApplier = inject(CssVariableApplierService);

  constructor() {
    effect(() => {
      const vars = this.themeStore.cssVariables();
      const densityVars = this.themeStore.densityTokens();
      const el = this.previewContainer().nativeElement;
      this.cssApplier.clearAllVariables(el);
      this.cssApplier.applySystemVariables(el, vars);
      this.cssApplier.applyComponentVariables(el, densityVars);
      el.style.setProperty("background-color", "var(--mat-sys-surface)");
      el.style.setProperty("color", "var(--mat-sys-on-surface)");
      el.style.setProperty("color-scheme", this.themeStore.themeType());
    });
  }
}
