import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { Expense, Payment } from "../../models";
import { generateUUID } from "../../services/expenses.service";
import { ExpenseStore } from "../../stores/expenses.store";

@Component({
  selector: "my-payments-create",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mx-auto max-w-2xl">
        <div class="mb-6 flex items-center justify-between">
          <h1 class="text-2xl font-bold">Add Payment</h1>
          <button (click)="goBack()" class="text-gray-600 hover:text-gray-800">Cancel</button>
        </div>

        @if (expenseStore.error()) {
          <div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {{ expenseStore.error() }}
            <button class="ml-2 text-red-700 hover:text-red-900" (click)="expenseStore.clearError()">✕</button>
          </div>
        }

        @if (expenseStore.loading()) {
          <div class="flex items-center justify-center py-4">
            <p class="text-gray-500">Loading...</p>
          </div>
        } @else if (!expense()) {
          <div class="flex items-center justify-center py-4">
            <p class="text-gray-500">Expense not found</p>
          </div>
        } @else {
          <form [formGroup]="paymentForm" (ngSubmit)="savePayment()" class="rounded-lg bg-white p-6 shadow">
            <div class="mb-6">
              <h2 class="text-lg font-semibold text-gray-700">Expense Details</h2>
              <p class="text-gray-600">{{ expense()?.title }}</p>
              <p class="text-sm text-gray-500">{{ expense()?.category }}</p>
            </div>

            <div class="space-y-4">
              <!-- Date -->
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700" for="date"> Payment Date * </label>
                <input
                  type="date"
                  id="date"
                  formControlName="date"
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  [class.border-red-500]="paymentForm.get('date')?.invalid && paymentForm.get('date')?.touched"
                />
                @if (paymentForm.get("date")?.invalid && paymentForm.get("date")?.touched) {
                  <p class="mt-1 text-sm text-red-600">Payment date is required</p>
                }
              </div>

              <!-- Value -->
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700" for="value"> Amount * </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                  <input
                    type="number"
                    id="value"
                    formControlName="value"
                    step="0.01"
                    min="0"
                    class="w-full rounded-md border border-gray-300 py-2 pr-3 pl-7 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    [class.border-red-500]="paymentForm.get('value')?.invalid && paymentForm.get('value')?.touched"
                  />
                </div>
                @if (paymentForm.get("value")?.invalid && paymentForm.get("value")?.touched) {
                  <p class="mt-1 text-sm text-red-600">Amount is required and must be greater than 0</p>
                }
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-2">
              <button type="button" (click)="goBack()" class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="paymentForm.invalid || expenseStore.loading()"
                class="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
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

    const newPayment: Payment = {
      paymentId: generateUUID(),
      date: this.createDateInUTC(formValue.date),
      value: formValue.value,
    };

    const updatedExpense: Expense = {
      ...currentExpense,
      payments: [...(currentExpense.payments || []), newPayment],
    };

    this.expenseStore.updateExpense(updatedExpense);
    this.router.navigate(["/expenses", currentExpense.expenseId]);
  }

  protected goBack(): void {
    this.router.navigate(["/expenses", this.expenseId()]);
  }

  private createDateInUTC(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }
}
