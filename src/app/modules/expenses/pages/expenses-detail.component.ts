import { ChangeDetectionStrategy, Component, InputSignal, ViewEncapsulation, computed, effect, inject, input } from "@angular/core";

import { ExpenseStore, PaymentsStore } from "my-angular/stores";

import { ExpenseFormComponent } from "../components/expenses-form.component";

@Component({
  selector: "my-expenses-detail",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ExpenseFormComponent],
  template: `<my-expenses-form header="Expense" [expense]="expense()" [readOnly]="true" />`,
})
export class ExpenseDetailComponent {
  private readonly expenseStore = inject(ExpenseStore);
  private readonly paymentsStore = inject(PaymentsStore);

  readonly expenseId: InputSignal<string> = input.required();

  protected readonly expenseIdEffect = effect(() => {
    this.expenseStore.selectExpense(this.expenseId());
    this.paymentsStore.selectExpense(this.expenseId());
  });

  protected readonly expense = computed(() => this.expenseStore.expense());
}
