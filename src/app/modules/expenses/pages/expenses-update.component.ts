import { ChangeDetectionStrategy, Component, EffectRef, InputSignal, ViewEncapsulation, effect, inject, input } from "@angular/core";
import { Router } from "@angular/router";

import { Expense, ExpenseRequest } from "my-angular/models";
import { ExpenseStore } from "my-angular/stores";

import { ExpenseFormComponent } from "../components/expenses-form.component";

@Component({
  selector: "my-expenses-update",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ExpenseFormComponent],
  template: `<my-expenses-form header="Edit Expense" [expense]="expenseStore.expense()" (formSubmit)="updateExpense($event)" />`,
})
export class ExpenseUpdateComponent {
  private readonly router = inject(Router);

  protected readonly expenseStore = inject(ExpenseStore);

  readonly expenseId: InputSignal<string> = input.required();

  protected readonly expenseEffect: EffectRef = effect(() => {
    this.expenseStore.selectExpense(this.expenseId());
  });

  protected updateExpense(expenseRequest: ExpenseRequest): void {
    const expense: Expense | undefined = this.expenseStore.updateExpense(this.expenseId(), expenseRequest);
    if (expense) this.router.navigate(["/expenses", expense.expenseId]);
  }
}
