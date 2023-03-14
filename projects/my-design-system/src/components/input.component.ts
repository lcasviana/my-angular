import { ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation } from '@angular/core';

const classes: string = [
  'my-input',
  'bg-stone-50',
  'text-neutral-900',
  'border border-double border-neutral-900 rounded',
  'px-2 py-1',
].join(' ');

@Component({
  selector: 'input[my-input]',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class MyInputComponent {
  @HostBinding('class') protected class: string = classes;
}
