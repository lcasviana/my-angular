import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "my-form-builder-page",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="p-6">
      <h1 class="mat-headline-large">Form Builder</h1>
    </div>
  `,
})
export class FormBuilderPage {}
