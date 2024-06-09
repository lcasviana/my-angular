import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

import { DisabledDirective } from "../directives/disabled.directive";

@Component({
  selector: "button[myButton]",
  template: `
    <div class="flex overflow-hidden text-ellipsis whitespace-nowrap">
      <ng-content />
    </div>
  `,
  host: { class: "inline-flex border-none rounded-none text-base px-3 py-2" },
  hostDirectives: [{ directive: DisabledDirective, inputs: ["disabled"] }],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {}
