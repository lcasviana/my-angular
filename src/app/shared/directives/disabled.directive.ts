import { Directive, input } from "@angular/core";

@Directive({
  selector: "[myDisabled]",
  standalone: true,
  host: {
    "[attr.disabled]": "disabled() ? '' : null",
    "(click)": "onClick($event)",
    "(dbclick)": "onClick($event)",
  },
})
export class MyDisabledDirective {
  readonly disabled = input<boolean>(false);

  onClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
