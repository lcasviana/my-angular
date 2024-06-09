import { Directive, input } from "@angular/core";

@Directive({
  selector: "ng-template[myTemplateTyped]",
  exportAs: "myTemplateTyped",
  standalone: true,
})
export class TemplateTypedDirective<T = unknown> {
  myTemplateTyped = input.required<T>();

  static ngTemplateContextGuard<T>(directive: TemplateTypedDirective<T>, context: unknown): context is T {
    return true;
  }
}
