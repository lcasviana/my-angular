import {
  ChangeDetectionStrategy,
  Component,
  EffectRef,
  InputSignal,
  OutputEmitterRef,
  ViewEncapsulation,
  effect,
  inject,
  input,
  output,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DatePickerModule } from "primeng/datepicker";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";

import { Expense, ExpenseRecurrenceType, ExpenseRequest } from "my-angular/models";

@Component({
  selector: "my-expenses-form",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ButtonModule, CardModule, DatePickerModule, FloatLabelModule, InputTextModule, ReactiveFormsModule, SelectModule],
  template: `
    <p-card [header]="header()">
      <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()" class="@container/expenses-form grid grid-cols-12 items-start gap-3">
        <p-floatlabel class="col-span-12" variant="in">
          <input id="name" class="w-full" type="text" autocomplete="off" pInputText pSize="small" formControlName="name" />
          <label for="name">Name*</label>
        </p-floatlabel>

        <p-floatlabel class="col-span-4" variant="in">
          <p-select
            inputId="recurrence"
            class="w-full"
            [options]="recurrenceOptions"
            optionLabel="label"
            optionValue="value"
            formControlName="recurrence"
          />
          <label for="recurrence">Recurrence*</label>
        </p-floatlabel>

        <p-floatlabel class="col-span-4" variant="in">
          <p-datepicker inputId="startDate" class="grid" showIcon iconDisplay="input" formControlName="startDate" />
          <label for="startDate">Start Date*</label>
        </p-floatlabel>

        <p-floatlabel class="col-span-4" variant="in">
          <p-datepicker inputId="endDate" class="grid" showIcon iconDisplay="input" formControlName="endDate" />
          <label for="endDate">End Date</label>
        </p-floatlabel>

        <div class="col-span-12 flex justify-end gap-3">
          <button pButton type="button" severity="secondary" (click)="navigateBack()">Cancel</button>
          @if (!readOnly()) {
            <button pButton type="submit" [disabled]="expenseForm.invalid">Submit</button>
          }
        </div>
      </form>
    </p-card>
  `,
})
export class ExpensesForm {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly header: InputSignal<string> = input.required();
  readonly expense: InputSignal<Expense | undefined> = input();
  readonly readOnly: InputSignal<boolean> = input(false);

  readonly formSubmit: OutputEmitterRef<ExpenseRequest> = output();

  protected readonly recurrenceOptions: { label: string; value: ExpenseRecurrenceType }[] = [
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ];

  protected readonly expenseForm: ExpenseForm = this.fb.group({
    name: this.fb.control<string | null | undefined>(null, Validators.required),
    recurrence: this.fb.control<ExpenseRecurrenceType | null | undefined>(null, Validators.required),
    startDate: this.fb.control<Date | null | undefined>(null, Validators.required),
    endDate: this.fb.control<Date | null | undefined>(null),
  });

  protected readonly expenseFormEffect: EffectRef = effect((): void => {
    const expense: Expense | undefined = this.expense();
    this.expenseForm.patchValue({
      name: expense?.title,
      recurrence: expense?.recurrence,
      startDate: expense?.startDate,
      endDate: expense?.endDate,
    });
  });

  protected onSubmit(): void {
    const expenseFormValue: ExpenseFormValue = this.expenseForm.value;
    if (this.expenseForm.invalid || !expenseFormValue.name || !expenseFormValue.recurrence || !expenseFormValue.startDate) return;

    const expense: ExpenseRequest = {
      title: expenseFormValue.name,
      recurrence: expenseFormValue.recurrence,
      startDate: expenseFormValue.startDate,
      endDate: expenseFormValue.endDate,
    };

    this.formSubmit.emit(expense);
  }

  protected navigateBack() {
    this.router.navigate(["/expenses"]);
  }
}

export type ExpenseForm = FormGroup<{
  name: FormControl<string | null | undefined>;
  recurrence: FormControl<ExpenseRecurrenceType | null | undefined>;
  startDate: FormControl<Date | null | undefined>;
  endDate: FormControl<Date | null | undefined>;
}>;

export type ExpenseFormValue = Partial<{
  name: string | null | undefined;
  recurrence: ExpenseRecurrenceType | null | undefined;
  startDate: Date | null | undefined;
  endDate: Date | null | undefined;
}>;
