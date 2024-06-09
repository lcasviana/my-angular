import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, effect, input } from "@angular/core";
import { AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn } from "@angular/forms";

@Component({
  selector: "my-form-control",
  template: `
    @if (control(); as control) {
      @if (control.formControl; as formControl) {
        @switch (control.type) {
          @case ("checkbox") {
            <input type="checkbox" [formControl]="formControl" />
          }
          @case ("color") {
            <input type="color" [formControl]="formControl" />
          }
          @case ("date") {
            <input type="date" [formControl]="formControl" />
          }
          @case ("number") {
            <input type="number" [formControl]="formControl" />
          }
          @case ("password") {
            <input type="password" [formControl]="formControl" />
          }
          @case ("radio") {
            <input type="radio" [formControl]="formControl" />
          }
          @case ("range") {
            <input type="range" [formControl]="formControl" />
          }
          @case ("select") {
            <select [formControl]="formControl"></select>
          }
          @case ("text") {
            <input type="text" [formControl]="formControl" />
          }
          @case ("textarea") {
            <textarea [formControl]="formControl"></textarea>
          }
          @case ("time") {
            <input type="time" [formControl]="formControl" />
          }
          @case ("toggle") {
            <input type="checkbox" [formControl]="formControl" />
          }
        }
      }
    }
  `,
  styles: ``,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class MyFormControlComponent {
  public control = input.required<MyFormControl>();
}

@Component({
  selector: "my-form-group",
  template: `
    @if (group(); as group) {
      <span>{{ group | json }}</span>
      @for (control of group.controls; track $index) {
        @if (control.instance === "group") {
          @if (getFormGroup(control.name); as formGroup) {
            <my-form-group [group]="control" />
          }
        } @else {
          @if (getFormControl(control.name); as formControl) {
            <my-form-control [control]="control" />
          }
        }
      }
    }
  `,
  styles: ``,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
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

@Component({
  selector: "my-form",
  template: `
    <form>
      {{ form() | json }}
      <my-form-group [group]="form()" />
    </form>
  `,
  styles: ``,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
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

export type MyFormValidators = {
  validators?: ValidatorFn | ValidatorFn[] | null;
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null;
};

const myFormControlTypes = [
  "checkbox",
  "color",
  "date",
  "number",
  "password",
  "radio",
  "range",
  "select",
  "text",
  "textarea",
  "time",
  "toggle",
] as const;
export type MyFormControlType = (typeof myFormControlTypes)[number];

export type MyFormControlBase<T extends MyFormControlType = never, V = unknown> = {
  instance: "control";
  formControl?: FormControl<V | null | undefined> | null;
  name: string;
  type: T;
  value?: V | null;
  label?: string | null;
  placeholder?: string | null;
  hint?: string | null;
  disabled?: boolean | null;
} & MyFormValidators;

export type MyFormControlWithOptions<V = unknown> = {
  options?: Array<V> | null;
  path?: string | string[] | null;
};

export type MyFormControlWithRange<V = unknown> = {
  min?: V | null;
  max?: V | null;
};

export type MyFormControlCheckbox<V = unknown> = MyFormControlBase<"checkbox", V>;
export type MyFormControlColor = MyFormControlBase<"color", string>;
export type MyFormControlDate = MyFormControlBase<"date", string> & MyFormControlWithRange<string>;
export type MyFormControlNumber = MyFormControlBase<"number", number> & MyFormControlWithRange<number>;
export type MyFormControlPassword = MyFormControlBase<"password", string>;
export type MyFormControlRadio<V = unknown> = MyFormControlBase<"radio", V>;
export type MyFormControlRange = MyFormControlBase<"range", number> & MyFormControlWithRange<number>;
export type MyFormControlSelect<V = unknown> = MyFormControlBase<"select", V> & MyFormControlWithOptions<V>;
export type MyFormControlText = MyFormControlBase<"text", string>;
export type MyFormControlTextarea = MyFormControlBase<"textarea", string>;
export type MyFormControlTime = MyFormControlBase<"time", string> & MyFormControlWithRange<string>;
export type MyFormControlToggle = MyFormControlBase<"toggle", boolean>;

export type MyFormControl =
  | MyFormControlCheckbox
  | MyFormControlColor
  | MyFormControlDate
  | MyFormControlNumber
  | MyFormControlPassword
  | MyFormControlRadio
  | MyFormControlRange
  | MyFormControlSelect
  | MyFormControlText
  | MyFormControlTextarea
  | MyFormControlTime
  | MyFormControlToggle;

export type MyFormGroup = {
  instance: "group";
  formGroup?: FormGroup | null;
  name: string;
  controls: Array<MyFormControl | MyFormGroup>;
} & MyFormValidators;
