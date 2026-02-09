import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

import { MatButton } from "@angular/material/button";
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "my-preview-cards",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatButton, MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle, MatIcon],
  template: `
    <h3 class="mb-4 text-lg font-medium">Cards</h3>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <!-- Elevated Card -->
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>Outlined Card</mat-card-title>
          <mat-card-subtitle>With subtitle</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>This is an example of an outlined card. Cards contain content and actions about a single subject.</p>
        </mat-card-content>
        <mat-card-actions>
          <button matButton>Action 1</button>
          <button matButton>Action 2</button>
        </mat-card-actions>
      </mat-card>

      <!-- Filled Card -->
      <mat-card appearance="raised">
        <mat-card-header>
          <mat-card-title>Raised Card</mat-card-title>
          <mat-card-subtitle>With actions</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>This is a raised card with elevation. It provides more visual emphasis than an outlined card.</p>
        </mat-card-content>
        <mat-card-actions align="end">
          <button matButton="filled">
            <mat-icon>check</mat-icon>
            Confirm
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- Simple Card -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>Default Card</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>A simple default card with minimal content. Useful for displaying basic information.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class PreviewCards {}
