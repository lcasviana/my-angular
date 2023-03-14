import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, input } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { MyFormControl } from "./control";
import { MyFormGroup, MyFormGroupComponent } from "./group";

@Component({
  selector: "my-form",
  template: `
    <form>
      <my-form-group [group]="form()" />
    </form>
  `,
  styles: ``,
  standalone: true,

  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MyFormGroupComponent, JsonPipe],
})
export class MyFormComponent {
  public config = input.required<MyFormGroup>();
  protected form = computed<MyFormGroup>(() => this.build(this.config()));

  constructor() {
    effect(() => {
      console.log(this.form());
    });
  }

  private build(config: MyFormGroup): MyFormGroup {
    return { ...config, formGroup: this.buildGroup(config) };
  }

  private buildGroup(group: MyFormGroup): FormGroup {
    const { controls, validators, asyncValidators } = group;
    group.formGroup = new FormGroup(
      controls.map(control => (control.instance === "group" ? this.buildGroup(control) : this.buildControl(control))),
      { validators, asyncValidators },
    );
    return group.formGroup;
  }

  private buildControl(control: MyFormControl): FormControl {
    return (control.formControl = new FormControl(control.value, {
      validators: control.validators,
      asyncValidators: control.asyncValidators,
    }));
  }
}
