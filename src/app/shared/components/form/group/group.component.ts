import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { MyFormControlComponent } from "../control";
import { MyFormGroup } from "./group";

@Component({
  selector: "my-form-group",
  templateUrl: "./group.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MyFormGroupComponent, MyFormControlComponent, JsonPipe],
})
export class MyFormGroupComponent {
  public group = input.required<MyFormGroup>();

  protected getFormGroup(name: string): FormGroup | null | undefined {
    return this.group().formGroup?.controls[name] as FormGroup;
  }

  protected getFormControl(name: string): FormControl | null | undefined {
    return this.group().formGroup?.controls[name] as FormControl;
  }
}
