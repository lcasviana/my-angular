import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from "@angular/core";

import { MatButton } from "@angular/material/button";
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "my-preview-dialogs",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatButton, MatIcon],
  template: `
    <h3 class="mb-4 text-lg font-medium">Dialogs & Snackbars</h3>

    <div class="flex flex-wrap gap-3">
      <button matButton="filled" (click)="openDialog()">
        <mat-icon>open_in_new</mat-icon>
        Open Dialog
      </button>
      <button matButton="tonal" (click)="openSnackbar()">
        <mat-icon>notifications</mat-icon>
        Show Snackbar
      </button>
    </div>
  `,
})
export class PreviewDialogs {
  readonly #dialog = inject(MatDialog);
  readonly #snackBar = inject(MatSnackBar);

  openDialog(): void {
    this.#dialog.open(SampleDialog);
  }

  openSnackbar(): void {
    this.#snackBar.open("This is a snackbar message", "Dismiss", {
      duration: 3000,
    });
  }
}

@Component({
  selector: "my-sample-dialog",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle],
  template: `
    <h2 matDialogTitle>Sample Dialog</h2>
    <mat-dialog-content>
      <p>This is a sample dialog to preview how dialogs look with your current theme configuration.</p>
      <p class="mt-2">Dialogs use the surface and on-surface color tokens from your theme.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button matButton matDialogClose>Cancel</button>
      <button matButton="filled" matDialogClose>Confirm</button>
    </mat-dialog-actions>
  `,
})
export class SampleDialog {}
