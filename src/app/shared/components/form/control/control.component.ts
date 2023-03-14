import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { MyFormControl } from "./control";

@Component({
  selector: "my-form-control",
  templateUrl: "./control.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class MyFormControlComponent {
  public control = input.required<MyFormControl>();
}
