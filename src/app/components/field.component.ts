import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

@Component({
  selector: 'fieldset[my-field]',
  template: `
    @if (label()) {
      <label class="text-sm leading-none opacity-75" [for]="for()">{{ label() }}</label>
    }
    <ng-content />
  `,
  host: { class: 'inline-flex flex-col m-0 px-3 py-2 border-[1px] bg-transparent focus-within:border-white' },
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldComponent {
  for = input<string>();
  label = input<string>();
}
