import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, output, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { Expense } from "../../models";

@Component({
  selector: "my-expenses-form",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()" class="bg-white rounded-lg shadow p-6">
      <div class="space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="title"> Title * </label>
          <input
            type="text"
            id="title"
            formControlName="title"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            [class.border-red-500]="expenseForm.get('title')?.invalid && expenseForm.get('title')?.touched"
          />
          @if (expenseForm.get("title")?.invalid && expenseForm.get("title")?.touched) {
            <p class="mt-1 text-sm text-red-600">Title is required</p>
          }
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="category"> Category * </label>
          <input
            type="text"
            id="category"
            formControlName="category"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            [class.border-red-500]="expenseForm.get('category')?.invalid && expenseForm.get('category')?.touched"
          />
          @if (expenseForm.get("category")?.invalid && expenseForm.get("category")?.touched) {
            <p class="mt-1 text-sm text-red-600">Category is required</p>
          }
        </div>

        <!-- Start Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="startDate"> Start Date * </label>
          <input
            type="date"
            id="startDate"
            formControlName="startDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            [class.border-red-500]="expenseForm.get('startDate')?.invalid && expenseForm.get('startDate')?.touched"
          />
          @if (expenseForm.get("startDate")?.invalid && expenseForm.get("startDate")?.touched) {
            <p class="mt-1 text-sm text-red-600">Start date is required</p>
          }
        </div>

        <!-- Recurrence -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="recurrence"> Recurrence * </label>
          <select
            id="recurrence"
            formControlName="recurrence"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <!-- End Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="endDate"> End Date (Optional) </label>
          <input
            type="date"
            id="endDate"
            formControlName="endDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="description"> Description (Optional) </label>
          <textarea
            id="description"
            formControlName="description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Payment Method -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="paymentMethod"> Payment Method (Optional) </label>
          <input
            type="text"
            id="paymentMethod"
            formControlName="paymentMethod"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          type="submit"
          [disabled]="expenseForm.invalid || isLoading()"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitButtonText() }}
        </button>
      </div>
    </form>
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

  protected readonly expenseForm: FormGroup = this.fb.group({
    title: ["", Validators.required],
    category: ["", Validators.required],
    startDate: ["", Validators.required],
    recurrence: ["monthly", Validators.required],
    endDate: [null],
    description: [""],
    paymentMethod: [""],
  });

  ngOnInit() {
    const initialValue = this.initialValue();
    if (initialValue) {
      this.expenseForm.patchValue({
        title: initialValue.title,
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
      uuid: initialValue?.uuid || "",
      title: formValue.title,
      category: formValue.category,
      startDate: this.createDateInUTC(formValue.startDate),
      recurrence: formValue.recurrence,
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
