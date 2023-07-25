import { Component } from '@angular/core';
import { GraphComponent, GraphData } from './shared/components/graph/graph.component';

@Component({
  selector: 'my-root',
  template: `<my-graph [data]="graph" />`,
  styles: [],
  standalone: true,
  imports: [GraphComponent],
})
export class AppComponent {
  protected graph: Array<GraphData> = [
    {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      type: 'scatter',
    },
  ];
}
