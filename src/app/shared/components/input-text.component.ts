import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

import { MyDisabledDirective } from "@/shared";

@Component({
  selector: "input[myInput][type=text]",
  template: ``,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "className" },
  hostDirectives: [{ directive: MyDisabledDirective, inputs: ["disabled"] }],
})
export class MyInputTextComponent {
  protected readonly className = "inline-flex disabled:cursor-not-allowed text-base border border-solid m-0 p-0 bg-transparent";
}
