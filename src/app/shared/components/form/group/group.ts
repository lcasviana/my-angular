import { AbstractControlOptions, FormGroup } from "@angular/forms";
import { MyFormControl } from "../control";

export type MyFormGroup = {
  instance: "group";
  formGroup?: FormGroup | null;
  name: string;
  controls: (MyFormControl | MyFormGroup)[];
} & AbstractControlOptions;
