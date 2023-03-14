import { coerceElement } from "@angular/cdk/coercion";
import { AfterViewInit, Directive, ElementRef, inject, OnDestroy, output } from "@angular/core";

@Directive({
  selector: "[myResize]",
  standalone: true,
})
export class MyResizeDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly resize = output<DOMRectReadOnly>();

  private myResize?: ResizeObserver;

  ngAfterViewInit(): void {
    const element = coerceElement<Element>(this.elementRef);
    this.myResize = new ResizeObserver(entries => entries.forEach(entry => this.resize.emit(entry.contentRect)));
    this.myResize.observe(element, { box: "border-box" });
  }

  ngOnDestroy(): void {
    this.myResize?.disconnect();
  }
}
