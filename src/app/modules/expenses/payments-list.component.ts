import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation, inject } from "@angular/core";
import { RouterLink } from "@angular/router";

import { Expense, ExpensePayment } from "../../models";
import { ExpenseStore } from "../../store/expense.store";

@Component({
  selector: "my-payments-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe, RouterLink],
  template: `
    <div class="rounded-lg bg-white p-6 shadow">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold">Payment History</h2>
        <a
          [routerLink]="['/expenses', expense.uuid, 'payments', 'create']"
          class="rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
        >
          Add Payment
        </a>
      </div>

      @if (!expense.payments || expense.payments.length === 0) {
        <div class="py-4 text-center">
          <p class="text-gray-500">No payments recorded yet</p>
        </div>
      }

      @if (expense.payments && expense.payments.length > 0) {
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr>
                <th class="border-b px-4 py-2 text-left">Date</th>
                <th class="border-b px-4 py-2 text-left">Amount</th>
                <th class="border-b px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (payment of expense.payments; track payment.uuid) {
                <tr>
                  <td class="border-b px-4 py-2">{{ payment.date | date: "shortDate" : "GMT" }}</td>
                  <td class="border-b px-4 py-2">{{ payment.value.toFixed(2) }}</td>
                  <td class="border-b px-4 py-2 text-center">
                    <a [routerLink]="['/expenses', expense.uuid, 'payments', payment.uuid, 'edit']" class="mr-2 text-blue-500 hover:text-blue-700">
                      Edit
                    </a>
                    <button (click)="deletePayment(payment)" class="text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr>
                <td class="border-t px-4 py-2 font-semibold">Total</td>
                <td class="border-t px-4 py-2 font-semibold">{{ getTotalPayments().toFixed(2) }}</td>
                <td class="border-t px-4 py-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      }
    </div>
  `,
})
export class PaymentListComponent {
  @Input({ required: true }) expense!: Expense;
  @Output() paymentsUpdated = new EventEmitter<Expense>();

  protected readonly expenseStore = inject(ExpenseStore);

  protected getTotalPayments(): number {
    return this.expense.payments?.reduce((sum, payment) => sum + payment.value, 0) || 0;
  }

  protected deletePayment(payment: ExpensePayment): void {
    if (confirm("Are you sure you want to delete this payment?")) {
      const updatedExpense: Expense = {
        ...this.expense,
        payments: this.expense.payments?.filter((p) => p.uuid !== payment.uuid) || [],
      };
      this.paymentsUpdated.emit(updatedExpense);
    }
  }
}
