import { ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation } from '@angular/core';

const classes: string = [
  'my-button',
  'bg-stone-100',
  'text-neutral-900',
  'border border-double border-neutral-900 rounded',
  'px-2 py-1',
].join(' ');

@Component({
  selector: 'button[my-button]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class MyButtonComponent {
  @HostBinding('class') protected classes: string = classes;
}
