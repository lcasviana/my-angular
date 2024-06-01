import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormInputNumberComponent } from './shared/components/form-input-number.component';
import { FormInputTextComponent } from './shared/components/form-input-text.component';

@Component({
  selector: 'my-root',
  template: `
    <form class="inline-block" [formGroup]="formGroup">
      <my-form-input-number [control]="formGroup.controls.number" label="Label" placeholder="Placeholder" />
      <my-form-input-text [control]="formGroup.controls.text" label="Label" placeholder="Placeholder" />
    </form>
  `,
  standalone: true,
  imports: [FormInputNumberComponent, FormInputTextComponent, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected formGroup = new FormGroup({
    number: new FormControl<number>(1, { nonNullable: true }),
    text: new FormControl<string>('1', { nonNullable: true }),
  });
}
