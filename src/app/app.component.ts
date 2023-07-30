import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormInputNumberComponent } from './shared/components/form-input-number.component';
import { FormInputTextComponent } from './shared/components/form-input-text.component';
import { GraphComponent, GraphData } from './shared/components/graph.component';

@Component({
  selector: 'my-root',
  template: `
    <my-graph [data]="graphData" />
    <form class="inline-block" [formGroup]="formGroup">
      <my-form-input-number [control]="formGroup.controls.number" label="Label" placeholder="Placeholder" />
      <my-form-input-text [control]="formGroup.controls.text" label="Label" placeholder="Placeholder" />
    </form>
  `,
  standalone: true,
  imports: [FormInputNumberComponent, FormInputTextComponent, ReactiveFormsModule, GraphComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected graphData: Array<GraphData> = [{ x: [1, 2, 3, 4], y: [10, 15, 13, 17], type: 'scatter' }];
  protected formGroup = new FormGroup({
    number: new FormControl<number>(1, { nonNullable: true }),
    text: new FormControl<string>('1', { nonNullable: true }),
  });
}
