import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "input[myInput][type=text]",
  template: ``,
  host: { class: "flex m-0 p-0 border-none outline-none bg-transparent text-inherit text-base" },
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent {}
