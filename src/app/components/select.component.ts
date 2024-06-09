import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

import { DisabledDirective } from "../directives/disabled.directive";

@Component({
  selector: "my-select",
  template: `
    <select popovertarget="test" type="menu">
      Open Popover
    </select>
    <div popover id="test">Greetings, one and all!</div>
  `,
  host: { class: "inline-flex flex-col" },
  hostDirectives: [{ directive: DisabledDirective, inputs: ["disabled"] }],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {}
