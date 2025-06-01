import { CommonModule, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Expense, ExpensePayment } from "../../models";
import { ExpenseStore } from "../../store/expense.store";

@Component({
  selector: "my-payment-list",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: "./payment-list.component.html",
  styles: ``,
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
        payments: this.expense.payments?.filter(p => p.uuid !== payment.uuid) || [],
      };
      this.paymentsUpdated.emit(updatedExpense);
    }
  }

  protected trackByPayment(index: number, payment: ExpensePayment): string {
    return payment.uuid;
  }
}
