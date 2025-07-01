import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, inject, input, output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";

import { Expense, ExpenseRecurrenceType } from "../../models";

@Component({
  selector: "my-expenses-form",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ButtonModule, CalendarModule, FloatLabelModule, InputTextModule, ReactiveFormsModule, SelectModule],
  template: `
    <div class="card">
      <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()" class="@container/expenses-form grid grid-cols-12 items-start gap-3 p-3">
        <p-floatlabel class="col-span-6" variant="in">
          <input id="name" class="w-full" type="text" pInputText pSize="small" formControlName="name" />
          <label for="name">Name*</label>
        </p-floatlabel>

        <p-floatlabel class="col-span-6" variant="in">
          <input id="category" class="w-full" type="text" pInputText pSize="small" formControlName="category" />
          <label for="category">Category</label>
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
          <p-calendar inputId="startDate" class="grid" showIcon iconDisplay="input" formControlName="startDate" />
          <label for="startDate">Start Date*</label>
        </p-floatlabel>

        <p-floatlabel class="col-span-4" variant="in">
          <p-calendar inputId="endDate" class="grid" showIcon iconDisplay="input" formControlName="endDate" />
          <label for="endDate">End Date</label>
        </p-floatlabel>

        <p-floatlabel class="col-span-6" variant="in">
          <input id="description" class="w-full" type="text" pInputText formControlName="description" />
          <label for="description">Description</label>
        </p-floatlabel>

        <p-floatlabel class="col-span-6" variant="in">
          <input id="paymentMethod" class="w-full" type="text" pInputText formControlName="paymentMethod" />
          <label for="paymentMethod">Payment Method</label>
        </p-floatlabel>

        <div class="col-span-12 flex justify-end">
          <button pButton type="submit" [disabled]="expenseForm.invalid || isLoading()">Submit</button>
        </div>
      </form>
    </div>
  `,
})
export class ExpenseFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  // Input signals
  readonly isLoading = input<boolean>(false);
  readonly submitButtonText = input<string>("Submit");
  readonly initialValue = input<Expense | undefined>(undefined);

  // Output signal
  readonly formSubmit = output<Expense>();

  protected readonly recurrenceOptions = [
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ];

  protected readonly expenseForm = this.fb.group({
    name: ["", Validators.required],
    category: ["", Validators.required],
    startDate: ["", Validators.required],
    recurrence: [null as ExpenseRecurrenceType | null, Validators.required],
    endDate: [null as string | null],
    description: [""],
    paymentMethod: [""],
  });

  ngOnInit() {
    const initialValue = this.initialValue();
    if (initialValue) {
      this.expenseForm.patchValue({
        name: initialValue.title,
        category: initialValue.category,
        startDate: this.formatDateForInput(initialValue.startDate),
        recurrence: initialValue.recurrence,
        endDate: initialValue.endDate ? this.formatDateForInput(initialValue.endDate) : null,
        description: initialValue.description || "",
        paymentMethod: initialValue.paymentMethod || "",
      });
    }
  }

  protected onSubmit(): void {
    if (this.expenseForm.invalid) return;

    const formValue = this.expenseForm.value;
    const initialValue = this.initialValue();
    const expense: Expense = {
      ...(initialValue || {}),
      expenseId: initialValue?.expenseId || "",
      title: formValue.name ?? "",
      category: formValue.category ?? "",
      startDate: this.createDateInUTC(formValue.startDate ?? ""),
      recurrence: formValue.recurrence ?? "monthly",
      endDate: formValue.endDate ? this.createDateInUTC(formValue.endDate) : null,
      description: formValue.description || null,
      paymentMethod: formValue.paymentMethod || null,
      payments: initialValue?.payments || [],
    };

    this.formSubmit.emit(expense);
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  private createDateInUTC(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }
}
