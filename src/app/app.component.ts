import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FieldComponent } from './components/field.component';
import { InputComponent } from './components/input.component';

@Component({
  selector: 'my-root',
  template: `
    <form class="inline-block" [formGroup]="formGroup">
      <fieldset my-field label="Text" for="text">
        <input my-input #text id="text" type="text" formControlName="text" />
      </fieldset>
    </form>
  `,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FieldComponent, InputComponent],
})
export class AppComponent {
  private readonly formBuilder = inject(FormBuilder);

  protected formGroup = this.formBuilder.nonNullable.group({
    text: ['1'],
  });
}
