import { Directive, input } from "@angular/core";

@Directive({
  selector: "ng-template[myTemplate]",
  standalone: true,
})
export class MyTemplateDirective<T = unknown> {
  readonly myTemplate = input.required<T>();

  static ngTemplateContextGuard<T>(_: MyTemplateDirective<T>, context: unknown): context is T {
    return true;
  }
}
