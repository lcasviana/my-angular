import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import * as uuid from 'uuid';

@Component({
  selector: 'my-form-input-text',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field appearance="outline">
      <mat-label *ngIf="label"> {{ label }} </mat-label>
      <input [id]="id" matInput [formControl]="control" [placeholder]="placeholder" type="text" />
      <mat-hint *ngIf="hint"> {{ hint }} </mat-hint>
    </mat-form-field>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInputTextComponent {
  @HostBinding('class') protected class = 'inline-block';

  @Input() id: string = uuid.v4();
  @Input({ required: true }) control!: FormControl<string>;
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() hint?: string;
}
