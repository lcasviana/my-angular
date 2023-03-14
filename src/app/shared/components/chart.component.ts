import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";

import {
  Axis,
  axisBottom,
  axisLeft,
  axisRight,
  curveLinear,
  extent,
  Line,
  line,
  NumberValue,
  pointer,
  ScaleLinear,
  scaleLinear,
  scaleTime,
  ScaleTime,
  select,
  Selection,
  timeFormat,
  timeSecond,
} from "d3";

export interface GraphXScatter<TData> {
  label?: string;
  key: keyof TData;
  timestamp: boolean;
}

export interface GraphYScatter<TData> {
  label?: string;
  domain: [number, number];
  properties: {
    name?: string;
    key: keyof TData;
    color?: string;
    type: "line" | "marker" | "line+marker";
  }[];
}

export interface Graph<TData> {
  title?: string;
  height: number;
  width: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  type: "scatter";
  x?: GraphXScatter<TData>;
  y1?: GraphYScatter<TData>;
  y2?: GraphYScatter<TData>;
}

@Component({
  selector: "my-chart",
  template: `<svg #svg></svg>`,
  standalone: true,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphScatterComponent<T extends Record<string, number>> implements OnInit {
  public ngOnInit(): void {
    this.setSvg();
    this.setOverlay();
    this.setLabels();
    this.setGraph();
  }

  // --------------------------------------------------

  private readonly colors: readonly string[] = ["#007ac9", "#9747ff", "#56bc66", "#f8e854", "#f3af3d", "#eb5757"] as const;

  private default: Graph<T> = {
    height: 600,
    width: 800,
    margin: { top: 80, right: 80, bottom: 80, left: 80 },
    type: "scatter",
  };

  private _config?: Graph<T>;

  @Input()
  public set config(value: Partial<Graph<T>>) {
    this._config = Object.assign(this.default, value);
  }
  public get config(): Graph<T> {
    const _config = this._config ?? this.default;
    const { top, right, bottom, left } = _config.margin;
    const height = _config.height - top - bottom;
    const width = _config.width - left - right;
    return { ..._config, height, width };
  }

  @Input({ required: true }) public data: T[] = [];

  // --------------------------------------------------

  @ViewChild("svg", { static: true })
  private elementRef?: ElementRef<SVGSVGElement>;

  private svg?: Selection<SVGGElement, unknown, null, undefined>;

  private setSvg(): void {
    const svg = this.elementRef?.nativeElement;
    if (!svg) return;

    const { height, width, margin } = this.config;
    const { top, right, bottom, left } = margin;

    this.svg = select(svg)
      .attr("height", height + top + bottom)
      .attr("width", width + left + right)
      .style("background", "#fff")
      .append("g")
      .attr("class", "container")
      .attr("transform", `translate(${left}, ${top})`);
  }

  // --------------------------------------------------

  private setLabels(): void {
    if (!this.svg) return;

    const { height, width, title, x, y1, y2, margin } = this.config;
    const { top, right, bottom, left } = margin;

    // Title
    if (title)
      this.svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", -top / 2)
        .style("font-size", "24px")
        .style("font-weight", "500")
        .attr("text-anchor", "middle")
        .text(title);

    // X Label
    if (x?.label)
      this.svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + (bottom * 2) / 3)
        .style("font-size", "16px")
        .style("font-weight", "500")
        .attr("text-anchor", "middle")
        .text(x.label);

    // Y1 Label
    if (y1?.label)
      this.svg
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("transform", `rotate(-90) translate(-${height / 2}, ${(-left * 2) / 3})`)
        .style("font-size", "16px")
        .style("font-weight", "500")
        .attr("text-anchor", "middle")
        .text(y1.label);

    // Y2 Label
    if (y2?.label)
      this.svg
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("transform", `rotate(90) translate(${height / 2}, -${width + (right * 2) / 3})`)
        .style("font-size", "16px")
        .style("font-weight", "500")
        .attr("text-anchor", "middle")
        .text(y2.label);
  }

  // --------------------------------------------------

  private overlay?: Selection<SVGGElement, unknown, null, undefined>;
  private tooltipBox?: Selection<SVGRectElement, unknown, null, undefined>;
  private tooltipText?: Selection<SVGGElement, unknown, null, undefined>;
  private tooltipBars?: Selection<SVGRectElement, T, SVGGElement, unknown>;
  private tooltipArea = 40;

  // --------------------------------------------------

  private setOverlay(): void {
    const svg = this.elementRef?.nativeElement;
    if (!svg || !this.svg) return;

    const { height, width } = this.config;

    this.svg.select("overlay").remove();

    this.overlay = select(svg)
      .append("g")
      .attr("height", height)
      .attr("width", width)
      .attr("class", "overlay")
      .style("opacity", 0)
      .style("pointer-events", "none");

    this.tooltipBox = this.overlay
      .append("rect")
      .style("fill", "#fff")
      .attr("class", "tooltip")
      .style("stroke-width", 1)
      .style("stroke", "#105D9B")
      .style("pointer-events", "none");

    this.tooltipText = this.overlay.append("g").style("pointer-events", "none");
  }

  private tooltipMouseMove(event: Event, d: T): void {
    if (!this.overlay || !this.tooltipBox || !this.tooltipText) return;

    const [posX, posY] = pointer(event);
    const { height, width, margin, x, y1, y2 } = this.config;
    const { left, top } = margin;
    const padding = 4;

    this.tooltipText.selectAll("*").remove();
    this.tooltipText.attr("transform", `translate(${padding}, ${padding})`);
    let boxHeight = 0;
    let boxWidth = 0;
    let colorIx = 0;

    if (x)
      this.tooltipText.append("text").call(text => {
        text
          .attr("dy", "1em")
          .attr("y", boxHeight)
          .style("font-size", "12px")
          .style("font-weight", "500")
          .style("color", "#000")
          .text(x.timestamp ? timeFormat("%m/%d/%Y %H:%M:%S")(new Date(d[x.key])) : d[x.key]);

        const { height, width } = text.node()?.getBoundingClientRect() ?? { height: 0, width: 0 };
        boxHeight += height;
        boxWidth = Math.max(boxWidth, width);
      });

    if (y1?.properties?.length)
      y1.properties.forEach(({ key, color }) => {
        this.tooltipText?.append("text").call(text => {
          text
            .attr("dy", "1em")
            .attr("y", boxHeight)
            .style("font-size", "12px")
            .style("fill", color || this.colors[colorIx++ % this.colors.length])
            .style("filter", "brightness(0.75)")
            .text(`${key as string}: ${d[key]}`);

          const { height, width } = text.node()?.getBoundingClientRect() ?? { height: 0, width: 0 };
          boxHeight += height;
          boxWidth = Math.max(boxWidth, width);
        });
      });

    if (y2?.properties.length)
      y2.properties.forEach(({ key, color }) => {
        this.tooltipText?.append("text").call(text => {
          text
            .attr("dy", "1em")
            .attr("y", boxHeight)
            .style("font-size", "12px")
            .style("fill", color || this.colors[colorIx++ % this.colors.length])
            .style("filter", "brightness(0.75)")
            .text(`${key as string}: ${d[key]}`);

          const { height, width } = text.node()?.getBoundingClientRect() ?? { height: 0, width: 0 };
          boxHeight += height;
          boxWidth = Math.max(boxWidth, width);
        });
      });

    this.tooltipBox.attr("height", boxHeight + 2 * padding).attr("width", boxWidth + 2 * padding);

    const _x: number = (posX > width / 2 ? posX - boxWidth - 4 * padding : posX + 2 * padding) + left;
    const _y: number = (posY > height / 2 ? posY - boxHeight - 4 * padding : posY + 2 * padding) + top;

    this.overlay.style("opacity", 1).attr("transform", `translate(${_x}, ${_y})`);
  }

  private tooltipMouseOver(): void {
    if (!this.overlay) return;
    this.overlay.transition().duration(250).style("opacity", 1);
  }

  private tooltipMouseOut(): void {
    if (!this.overlay) return;
    this.overlay.transition().duration(250).style("opacity", 0);
  }

  // --------------------------------------------------

  private xScale?: ScaleTime<number, number, never> | ScaleLinear<number, number, never>;
  private xAxis?: Axis<NumberValue>;
  private xSvg?: Selection<SVGGElement, unknown, null, undefined>;

  private y1Scale?: ScaleLinear<number, number, never>;
  private y1Axis?: Axis<NumberValue>;
  private y1Svg?: Selection<SVGGElement, unknown, null, undefined>;
  private y1Lines?: [Line<T>, Selection<SVGPathElement, T[], null, undefined>][];
  private y1Dots?: [keyof T, Selection<SVGCircleElement, T, SVGGElement, unknown>][];

  private y2Scale?: ScaleLinear<number, number, never>;
  private y2Axis?: Axis<NumberValue>;
  private y2Svg?: Selection<SVGGElement, unknown, null, undefined>;
  private y2Lines?: [Line<T>, Selection<SVGPathElement, T[], null, undefined>][];
  private y2Dots?: [keyof T, Selection<SVGCircleElement, T, SVGGElement, unknown>][];

  // --------------------------------------------------

  public setGraph(): void {
    if (!this.svg) return;
    if (!this.data.length) return;

    const { height, width, x, y1, y2 } = this.config;

    this.svg.selectAll(".axis").remove();
    this.svg.selectAll(".lines").remove();
    this.svg.selectAll(".dots").remove();

    if (!x?.key) return;

    // X Scale
    this.xScale = x.timestamp
      ? scaleTime().domain(extent(this.data, d => new Date(d[x.key])) as [Date, Date])
      : scaleLinear().domain(extent(this.data, d => d[x.key]) as [number, number]);
    this.xScale.nice().range([0, width]);

    // X Axis
    this.xAxis = axisBottom(this.xScale);
    if (x.timestamp)
      this.xAxis.ticks(timeSecond.every(1)).tickFormat((d, i) => {
        if (i === 0) return timeFormat("%H:%M:%S\n%m/%d/%Y")(new Date(d as number));
        return timeFormat("%M:%S")(new Date(d as number));
      });
    this.xSvg = this.svg.append("g").attr("class", "x axis").attr("transform", `translate(0, ${height})`);
    this.xSvg.call(this.xAxis);
    if (x.timestamp) this.splitXAxisDateTime();

    // Tooltip Trigger
    this.tooltipBars = this.svg
      .append("g")
      .attr("class", "bars")
      .selectAll("bar")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => this.xScale!(d[x.key]) - this.tooltipArea / 2)
      .attr("y", () => 0)
      .attr("width", this.tooltipArea)
      .attr("height", () => height)
      .attr("fill", "transparent");

    // Variables
    let colorIx = 0;
    this.y1Lines = [];
    this.y1Dots = [];
    this.y2Lines = [];
    this.y2Dots = [];

    if (y1) {
      // Y1 Scale
      this.y1Scale = scaleLinear().domain(y1.domain).nice().range([height, 0]);

      // Y1 Axis
      this.y1Axis = axisLeft(this.y1Scale);
      this.y1Svg = this.svg.append("g").attr("class", "y1 axis").attr("transform", `translate(0, 0)`).call(this.y1Axis);
    }

    // Lines Y1
    if (y1?.properties.length) {
      for (let i = 0; i < y1.properties.length; i++) {
        const { key, color, type } = y1.properties[i];
        const _color = color ?? this.colors[colorIx++ % this.colors.length];

        // Line Y1
        if (["line", "line+marker"].includes(type)) {
          const y1line = line<T>()
            .x(d => this.xScale!(d[x.key]))
            .y(d => this.y1Scale!(d[key]))
            .curve(curveLinear);

          const y1LineSvg = this.svg
            .append("path")
            .datum(this.data)
            .attr("class", "line")
            .attr("d", y1line)
            .style("fill", "none")
            .style("stroke", _color)
            .style("stroke-width", 1)
            .style("pointer-events", "none");

          this.y1Lines.push([y1line, y1LineSvg]);
        }

        // Dots Y1
        if (["marker", "line+marker"].includes(type)) {
          const y1Dots = this.svg
            .append("g")
            .attr("class", "dots")
            .selectAll(".dot")
            .data(this.data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .style("fill", _color)
            .attr("r", 2)
            .attr("cx", d => this.xScale!(d[x.key]))
            .attr("cy", d => this.y1Scale!(d[key]))
            .style("pointer-events", "none");

          this.y1Dots.push([key, y1Dots]);
        }
      }
    }

    if (y2) {
      // Y2 Scale
      this.y2Scale = scaleLinear().domain(y2.domain).nice().range([height, 0]);

      // Y2 Axis
      this.y2Axis = axisRight(this.y2Scale);
      this.y2Svg = this.svg.append("g").attr("class", "y2 axis").attr("transform", `translate(${width}, 0)`).call(this.y2Axis);
    }

    // Lines Y2
    if (y2 && y2.properties.length && this.xScale && this.y2Scale) {
      for (let i = 0; i < y2.properties.length; i++) {
        const { key, color, type } = y2.properties[i];
        const _color = color ?? this.colors[colorIx++ % this.colors.length];

        // Line Y2
        if (["line", "line+marker"].includes(type)) {
          const y2Line = line<T>()
            .x(d => this.xScale!(d[x.key]))
            .y(d => this.y2Scale!(d[key]))
            .curve(curveLinear);

          const y2LineSvg = this.svg
            .append("path")
            .datum(this.data)
            .attr("class", "line")
            .attr("d", y2Line)
            .style("fill", "none")
            .style("stroke", _color)
            .style("stroke-width", 1)
            .style("pointer-events", "none");

          this.y2Lines.push([y2Line, y2LineSvg]);
        }

        // Dots Y2
        if (["marker", "line+marker"].includes(type)) {
          const y2Dots = this.svg
            .append("g")
            .attr("class", "dots")
            .selectAll(".dot")
            .data(this.data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .style("fill", _color)
            .attr("r", 2)
            .attr("cx", d => this.xScale!(d[x.key]))
            .attr("cy", d => this.y2Scale!(d[key]))
            .style("pointer-events", "none");

          this.y2Dots.push([key, y2Dots]);
        }
      }
    }
  }

  // --------------------------------------------------

  public render(): void {
    if (!this.svg || !this.data.length) return;
    const { x, y1, y2 } = this.config;

    if (x && this.xAxis && this.xScale) {
      this.xScale.domain(
        x.timestamp ? (extent(this.data, d => new Date(d[x.key])) as [Date, Date]) : (extent(this.data, d => d[x.key]) as [number, number]),
      );
      this.xSvg?.call(this.xAxis);
      if (x.timestamp) this.splitXAxisDateTime();

      this.tooltipBars
        ?.data(this.data)
        .attr("x", d => this.xScale!(d[x.key]) - this.tooltipArea / 2)
        .on("mousemove", (e, d) => this.tooltipMouseMove(e, d))
        .on("mouseover", () => this.tooltipMouseOver())
        .on("mouseout", () => this.tooltipMouseOut());
    }

    if (x && y1?.properties.length) {
      this.y1Svg?.call(this.y1Axis!);
      this.y1Lines?.forEach(([line, svg]) => svg.datum(this.data).transition().duration(250).attr("d", line));
      this.y1Dots?.forEach(([key, svg]) =>
        svg
          .data(this.data)
          .transition()
          .duration(250)
          .attr("cx", d => this.xScale!(d[x.key]))
          .attr("cy", d => this.y1Scale!(d[key])),
      );
    }

    if (x && y2?.properties.length) {
      this.y2Svg?.call(this.y2Axis!);
      this.y2Lines?.forEach(([line, svg]) => svg.datum(this.data).transition().duration(250).attr("d", line));
      this.y2Dots?.forEach(([key, svg]) =>
        svg
          .data(this.data)
          .transition()
          .duration(250)
          .attr("cx", d => this.xScale!(d[x.key]))
          .attr("cy", d => this.y2Scale!(d[key])),
      );
    }
  }

  // --------------------------------------------------

  private splitXAxisDateTime(): void {
    this.xSvg?.selectAll("text").call(function (t) {
      t.each(function () {
        const self = select(this);
        const s = self.text().split("\n");
        self.text("");
        s.forEach((v, i) =>
          self
            .append("tspan")
            .attr("x", 0)
            .attr("dy", "1em")
            .style("font-weight", i ? "600" : "400")
            .text(v),
        );
      });
    });
  }
}
