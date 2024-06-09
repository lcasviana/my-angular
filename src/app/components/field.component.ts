import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, contentChild, input } from "@angular/core";
import { NgControl } from "@angular/forms";

@Component({
  selector: "my-field",
  template: `
    <fieldset class="inline-flex flex-col m-0 px-3 py-2 border-px bg-transparent focus-within:border-white">
      @if (label()) {
        <label class="text-sm leading-none opacity-75" [for]="inputId()">
          {{ label() }}
          @if (true) {
            <span class="text-red-500">*</span>
          }
        </label>
      }
      <ng-content />
    </fieldset>
    @if (hint()) {
      <small class="text-sm opacity-75">{{ hint() }}</small>
    }
    @for (error of errors(); track error.key) {
      @if (error.key === "required") {
        <small class="text-red-500">Required</small>
      } @else if (error.key === "minlength") {
        <small class="text-red-500">Too short</small>
      } @else if (error.key === "maxlength") {
        <small class="text-red-500">Too long</small>
      } @else {
        <small class="text-sm text-red-500">{{ error.value }}</small>
      }
    }
  `,
  host: { class: "inline-flex flex-col" },
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldComponent {
  inputId = input<string | null>(null);
  label = input<string | null>(null);
  hint = input<string | null>(null);

  protected control = contentChild.required(NgControl);
  protected errors = computed(() =>
    Object.entries(this.control().errors || {}).map(([key, value]) => ({ key, value })),
  );
}
