import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatCheckbox } from "@angular/material/checkbox";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatSlideToggle } from "@angular/material/slide-toggle";

@Component({
  selector: "my-preview-forms",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, MatCheckbox, MatFormField, MatIcon, MatInput, MatLabel, MatOption, MatRadioButton, MatRadioGroup, MatSelect, MatSlideToggle],
  template: `
    <h3 class="mb-4 text-lg font-medium">Forms & Inputs</h3>

    <div class="flex flex-col gap-4">
      <!-- Text Inputs -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <mat-form-field>
          <mat-label>First Name</mat-label>
          <input matInput placeholder="Enter first name" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput type="email" placeholder="user@example.com" />
          <mat-icon matPrefix>email</mat-icon>
        </mat-form-field>
      </div>

      <!-- Select -->
      <mat-form-field>
        <mat-label>Country</mat-label>
        <mat-select>
          <mat-option value="us">United States</mat-option>
          <mat-option value="uk">United Kingdom</mat-option>
          <mat-option value="ca">Canada</mat-option>
          <mat-option value="au">Australia</mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Textarea -->
      <mat-form-field>
        <mat-label>Notes</mat-label>
        <textarea matInput rows="3" placeholder="Enter additional notes"></textarea>
      </mat-form-field>

      <!-- Checkboxes -->
      <div>
        <p class="mb-2 text-sm font-medium">Options</p>
        <div class="flex flex-col gap-1">
          <mat-checkbox [checked]="true">Enable notifications</mat-checkbox>
          <mat-checkbox>Subscribe to newsletter</mat-checkbox>
          <mat-checkbox disabled>Disabled option</mat-checkbox>
        </div>
      </div>

      <!-- Radio Buttons -->
      <div>
        <p class="mb-2 text-sm font-medium">Priority</p>
        <mat-radio-group class="flex gap-4" value="medium">
          <mat-radio-button value="low">Low</mat-radio-button>
          <mat-radio-button value="medium">Medium</mat-radio-button>
          <mat-radio-button value="high">High</mat-radio-button>
        </mat-radio-group>
      </div>

      <!-- Slide Toggle -->
      <div class="flex flex-col gap-2">
        <mat-slide-toggle [checked]="true">Dark Mode</mat-slide-toggle>
        <mat-slide-toggle>Airplane Mode</mat-slide-toggle>
      </div>
    </div>
  `,
})
export class PreviewForms {}
