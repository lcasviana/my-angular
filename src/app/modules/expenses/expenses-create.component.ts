import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from "@angular/core";
import { Router } from "@angular/router";

import { Expense } from "../../models";
import { ExpenseStore } from "../../store/expense.store";
import { ExpenseFormComponent } from "./expenses-form.component";

@Component({
  selector: "my-expenses-create",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ExpenseFormComponent],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Create New Expense</h1>
          <button (click)="goBack()" class="text-gray-600 hover:text-gray-800">Cancel</button>
        </div>

        @if (expenseStore.error()) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ expenseStore.error() }}
            <button class="ml-2 text-red-700 hover:text-red-900" (click)="expenseStore.clearError()">✕</button>
          </div>
        }

        <my-expenses-form [isLoading]="expenseStore.isLoading()" submitButtonText="Create Expense" (formSubmit)="saveExpense($event)" />
      </div>
    </div>
  `,
  styles: ``,
})
export class ExpenseCreateComponent {
  private readonly router = inject(Router);
  protected readonly expenseStore = inject(ExpenseStore);

  private generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  protected saveExpense(expense: Expense): void {
    const newExpense: Expense = {
      ...expense,
      uuid: this.generateUUID(),
    };

    this.expenseStore.createExpense(newExpense);
    this.router.navigate(["/expenses"]);
  }

  protected goBack(): void {
    this.router.navigate(["/expenses"]);
  }
}
