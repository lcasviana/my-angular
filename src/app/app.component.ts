import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'my-root',
  template: `
    <form class="inline-block" [formGroup]="formGroup">
      <input type="number" class="w-32" formControlName="number" />
      <input type="text" class="w-32" formControlName="text" />
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected formGroup = new FormGroup({
    number: new FormControl<number>(1, { nonNullable: true }),
    text: new FormControl<string>('1', { nonNullable: true }),
  });
}
