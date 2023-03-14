import { AbstractControlOptions, FormControl } from "@angular/forms";

export const myFormControlTypes = [
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
} & AbstractControlOptions;

export interface MyFormControlWithOptions<V = unknown> {
  options?: V[] | null;
  path?: string | string[] | null;
}

export interface MyFormControlWithRange<V = unknown> {
  min?: V | null;
  max?: V | null;
}

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
