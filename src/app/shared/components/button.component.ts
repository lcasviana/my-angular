import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from "@angular/core";

import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

import { MyDisabledDirective } from "@/shared";

@Component({
  selector: "button[myButton]",
  template: `<ng-content />`,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class]": "className()" },
  hostDirectives: [{ directive: MyDisabledDirective, inputs: ["disabled"] }],
})
export class MyButtonComponent {
  readonly appearance = input.required<MyButtonAppearance>();
  readonly class = input<string>("");

  protected readonly className = computed<string>(() => twMerge(button({ appearance: this.appearance() }), this.class()));
}

export type MyButtonAppearance = "contained" | "outlined" | "text";

const button = tv({
  base: "inline-flex cursor-pointer disabled:cursor-not-allowed text-base border border-solid m-0 p-0",
  variants: {
    appearance: {
      contained: "bg-current border-current text-transparent fill-transparent stroke-transparent",
      outlined: "bg-transparent border-current text-current fill-current stroke-current",
      text: "bg-transparent border-transparent text-current fill-current stroke-current",
    },
  },
});
