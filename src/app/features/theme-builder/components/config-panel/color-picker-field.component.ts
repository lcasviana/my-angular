import { ChangeDetectionStrategy, Component, input, model, ViewEncapsulation } from "@angular/core";

import { FormsModule } from "@angular/forms";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";

@Component({
  selector: "my-color-picker-field",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, MatFormField, MatInput, MatLabel],
  template: `
    <div class="flex items-center gap-3">
      <input type="color" class="h-10 w-10 shrink-0 cursor-pointer rounded border-none" [ngModel]="value()" (ngModelChange)="value.set($event)" />
      <mat-form-field class="flex-1" subscriptSizing="dynamic">
        <mat-label>{{ label() }}</mat-label>
        <input matInput [ngModel]="value()" (ngModelChange)="value.set($event)" />
      </mat-form-field>
    </div>
  `,
})
export class ColorPickerField {
  readonly label = input.required<string>();
  readonly value = model.required<string>();
}
