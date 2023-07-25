import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { PlotlyModule } from 'angular-plotly.js';
import * as Plotly from 'plotly.js-basic-dist-min';
import { Config as GraphConfig, Data as GraphData, Layout as GraphLayout } from 'plotly.js-basic-dist-min';
import * as uuid from 'uuid';
export { GraphConfig, GraphData, GraphLayout };

export type Graph = {
  data: Array<GraphData>;
  layout?: Partial<GraphLayout>;
  config?: Partial<GraphConfig>;
};

PlotlyModule.plotlyjs = Plotly;

@Component({
  selector: 'my-graph',
  standalone: true,
  imports: [PlotlyModule],
  template: `<plotly-plot [id]="id" [data]="data" [layout]="layout" [config]="config" />`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphComponent implements Graph {
  @Input() id: string = uuid.v4();
  @Input() data: Array<GraphData> = [];
  @Input() layout: Partial<GraphLayout> | undefined;
  @Input() config: Partial<GraphConfig> | undefined;
}
