import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import * as uuid from 'uuid';

@Component({
  selector: 'my-form-input',
  standalone: true,
  imports: [NgIf, MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field appearance="outline">
      <mat-label *ngIf="label"> {{ label }} </mat-label>
      <input [id]="id" matInput [placeholder]="placeholder" />
      <!-- <mat-icon matSuffix>phone</mat-icon> -->
      <mat-hint *ngIf="hint"> {{ hint }} </mat-hint>
    </mat-form-field>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInputComponent {
  @Input() id: string = uuid.v4();
  @Input() public label?: string;
  @Input() public placeholder: string = '';
  @Input() public hint?: string;
}
