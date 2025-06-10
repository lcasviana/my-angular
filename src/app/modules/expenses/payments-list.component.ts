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
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Payment History</h2>
        <a [routerLink]="['/expenses', expense.uuid, 'payments', 'new']" class="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-2 rounded">
          Add Payment
        </a>
      </div>

      @if (!expense.payments || expense.payments.length === 0) {
        <div class="text-center py-4">
          <p class="text-gray-500">No payments recorded yet</p>
        </div>
      }

      @if (expense.payments && expense.payments.length > 0) {
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr>
                <th class="py-2 px-4 border-b text-left">Date</th>
                <th class="py-2 px-4 border-b text-left">Amount</th>
                <th class="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (payment of expense.payments; track payment.uuid) {
                <tr>
                  <td class="py-2 px-4 border-b">{{ payment.date | date: "shortDate" : "GMT" }}</td>
                  <td class="py-2 px-4 border-b">{{ payment.value.toFixed(2) }}</td>
                  <td class="py-2 px-4 border-b text-center">
                    <a [routerLink]="['/expenses', expense.uuid, 'payments', payment.uuid, 'edit']" class="text-blue-500 hover:text-blue-700 mr-2">
                      Edit
                    </a>
                    <button (click)="deletePayment(payment)" class="text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr>
                <td class="py-2 px-4 border-t font-semibold">Total</td>
                <td class="py-2 px-4 border-t font-semibold">{{ getTotalPayments().toFixed(2) }}</td>
                <td class="py-2 px-4 border-t"></td>
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
