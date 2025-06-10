import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { v4 as uuidv4 } from "uuid";

import { Expense, ExpensePayment } from "../../models";
import { ExpenseStore } from "../../store/expense.store";

@Component({
  selector: "my-payments-create",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Add Payment</h1>
          <button (click)="goBack()" class="text-gray-600 hover:text-gray-800">Cancel</button>
        </div>

        @if (expenseStore.error()) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ expenseStore.error() }}
            <button class="ml-2 text-red-700 hover:text-red-900" (click)="expenseStore.clearError()">✕</button>
          </div>
        }

        @if (expenseStore.isLoading()) {
          <div class="flex justify-center items-center py-4">
            <p class="text-gray-500">Loading...</p>
          </div>
        } @else if (!expense()) {
          <div class="flex justify-center items-center py-4">
            <p class="text-gray-500">Expense not found</p>
          </div>
        } @else {
          <form [formGroup]="paymentForm" (ngSubmit)="savePayment()" class="bg-white rounded-lg shadow p-6">
            <div class="mb-6">
              <h2 class="text-lg font-semibold text-gray-700">Expense Details</h2>
              <p class="text-gray-600">{{ expense()?.title }}</p>
              <p class="text-sm text-gray-500">{{ expense()?.category }}</p>
            </div>

            <div class="space-y-4">
              <!-- Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="date"> Payment Date * </label>
                <input
                  type="date"
                  id="date"
                  formControlName="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="paymentForm.get('date')?.invalid && paymentForm.get('date')?.touched"
                />
                @if (paymentForm.get("date")?.invalid && paymentForm.get("date")?.touched) {
                  <p class="mt-1 text-sm text-red-600">Payment date is required</p>
                }
              </div>

              <!-- Value -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="value"> Amount * </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    id="value"
                    formControlName="value"
                    step="0.01"
                    min="0"
                    class="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    [class.border-red-500]="paymentForm.get('value')?.invalid && paymentForm.get('value')?.touched"
                  />
                </div>
                @if (paymentForm.get("value")?.invalid && paymentForm.get("value")?.touched) {
                  <p class="mt-1 text-sm text-red-600">Amount is required and must be greater than 0</p>
                }
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-2">
              <button type="button" (click)="goBack()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="paymentForm.invalid || expenseStore.isLoading()"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Payment
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  `,
})
export class PaymentCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly expenseStore = inject(ExpenseStore);

  protected readonly expenseId = input.required<string>();
  protected readonly expense = this.expenseStore.selectedExpense;

  protected readonly paymentForm: FormGroup = this.fb.group({
    date: ["", Validators.required],
    value: ["", [Validators.required, Validators.min(0.01)]],
  });

  constructor() {
    this.expenseStore.selectExpense(this.expenseId());
  }

  protected savePayment(): void {
    if (this.paymentForm.invalid || !this.expense()) return;

    const formValue = this.paymentForm.value;
    const currentExpense = this.expense()!;

    const newPayment: ExpensePayment = {
      uuid: uuidv4(),
      date: this.createDateInUTC(formValue.date),
      value: formValue.value,
    };

    const updatedExpense: Expense = {
      ...currentExpense,
      payments: [...(currentExpense.payments || []), newPayment],
    };

    this.expenseStore.updateExpense(updatedExpense);
    this.router.navigate(["/expenses", currentExpense.uuid]);
  }

  protected goBack(): void {
    this.router.navigate(["/expenses", this.expenseId()]);
  }

  private createDateInUTC(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }
}
