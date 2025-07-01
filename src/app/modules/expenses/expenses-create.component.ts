import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from "@angular/core";
import { Router } from "@angular/router";

import { Expense } from "../../models";
import { generateUUID } from "../../services/expenses.service";
import { ExpenseStore } from "../../store/expense.store";
import { ExpenseFormComponent } from "./expenses-form.component";

@Component({
  selector: "my-expenses-create",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ExpenseFormComponent],
  template: `
    <h1 class="px-3 text-2xl font-bold">Create New Expense</h1>
    <my-expenses-form [isLoading]="expenseStore.loading()" submitButtonText="Create Expense" (formSubmit)="saveExpense($event)" />
  `,
})
export class ExpenseCreateComponent {
  private readonly router = inject(Router);
  protected readonly expenseStore = inject(ExpenseStore);

  protected saveExpense(expense: Expense): void {
    const newExpense: Expense = {
      ...expense,
      expenseId: generateUUID(),
    };

    this.expenseStore.createExpense(newExpense);
    this.router.navigate(["/expenses"]);
  }

  protected goBack(): void {
    this.router.navigate(["/expenses"]);
  }
}
