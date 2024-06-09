import { Directive, input } from "@angular/core";

@Directive({
  selector: "[myDisabled]",
  standalone: true,
  host: {
    "[class.cursor-not-allowed]": "disabled()",
    "[attr.disabled]": 'disabled() ? "" : null',
    "(click)": "onClick($event)",
    "(dbclick)": "onClick($event)",
  },
})
export class DisabledDirective {
  disabled = input<boolean>(false);

  protected onClick(event: Event) {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
