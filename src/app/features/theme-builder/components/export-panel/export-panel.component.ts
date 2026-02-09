import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from "@angular/core";

import { MatButton } from "@angular/material/button";
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";

import { ScssExporterService } from "../../services/scss-exporter.service";
import { ThemeStore } from "../../store/theme.store";

@Component({
  selector: "my-export-panel",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatButton, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MatIcon],
  template: `
    <h2 matDialogTitle>Export Theme SCSS</h2>
    <mat-dialog-content>
      <pre class="overflow-x-auto rounded-lg bg-[var(--mat-sys-surface-container)] p-4 text-sm">{{ scssOutput() }}</pre>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton matDialogClose>Close</button>
      <button matButton="tonal" (click)="copyToClipboard()">
        <mat-icon>content_copy</mat-icon>
        Copy
      </button>
      <button matButton="filled" (click)="download()">
        <mat-icon>download</mat-icon>
        Download
      </button>
    </mat-dialog-actions>
  `,
})
export class ExportPanel {
  readonly #store = inject(ThemeStore);
  readonly #exporter = inject(ScssExporterService);
  readonly #snackBar = inject(MatSnackBar);

  readonly scssOutput = computed(() => {
    const config = {
      sourceColors: this.#store.sourceColors(),
      themeType: this.#store.themeType(),
      typography: this.#store.typography(),
      density: this.#store.density(),
      shape: this.#store.shape(),
    };
    return this.#exporter.generateScss(config, this.#store.palettes());
  });

  async copyToClipboard(): Promise<void> {
    await navigator.clipboard.writeText(this.scssOutput());
    this.#snackBar.open("SCSS copied to clipboard!", "Dismiss", { duration: 3000 });
  }

  download(): void {
    const blob = new Blob([this.scssOutput()], { type: "text/x-scss" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "material-theme.scss";
    a.click();
    URL.revokeObjectURL(url);
  }
}
