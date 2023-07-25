import { Component } from '@angular/core';

import { FormInputComponent } from './shared/components/form-input.component';
import { GraphComponent, GraphData } from './shared/components/graph.component';

@Component({
  selector: 'my-root',
  template: `
    <my-graph [data]="data" />
    <my-form-input />
  `,
  standalone: true,
  imports: [FormInputComponent, GraphComponent],
})
export class AppComponent {
  protected data: Array<GraphData> = [
    {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      type: 'scatter',
    },
  ];
}
