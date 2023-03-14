import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from "@angular/core";
import { Router } from "@angular/router";

import { Expense, ExpenseRequest } from "my-angular/models";
import { ExpenseStore } from "my-angular/stores";

import { ExpenseFormComponent } from "../components/expenses-form.component";

@Component({
  selector: "my-expenses-create",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ExpenseFormComponent],
  template: `<my-expenses-form header="Create Expense" (formSubmit)="createExpense($event)" />`,
})
export class ExpenseCreateComponent {
  private readonly router = inject(Router);

  private readonly expenseStore = inject(ExpenseStore);

  protected createExpense(expenseRequest: ExpenseRequest): void {
    const expense: Expense | undefined = this.expenseStore.createExpense(expenseRequest);
    if (expense) this.router.navigate(["/expenses", expense.expenseId]);
  }
}
