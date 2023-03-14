import { ChangeDetectionStrategy, Component, computed, contentChild, HostBinding, input } from "@angular/core";
import { NgControl } from "@angular/forms";

@Component({
  selector: "my-field",
  templateUrl: "./field.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldComponent {
  @HostBinding("class") protected readonly className = "inline-flex flex-col";

  inputId = input<string | null>(null);
  label = input<string | null>(null);
  hint = input<string | null>(null);

  protected control = contentChild.required(NgControl);
  protected errors = computed(() => Object.entries(this.control().errors || {}).map(([key, value]) => ({ key, value })));
}
