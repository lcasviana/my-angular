import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input } from "@angular/core";
import { Router, RouterLink } from "@angular/router";

import { Expense } from "../../models";
import { ExpenseStore } from "../../store/expense.store";
import { ExpenseFormComponent } from "./expenses-form.component";

@Component({
  selector: "my-expenses-update",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterLink, ExpenseFormComponent],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Edit Expense</h1>
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
        } @else if (!selectedExpense()) {
          <div class="flex justify-center items-center py-4">
            <p class="text-gray-500">Expense not found</p>
          </div>
        } @else {
          <my-expenses-form
            [isLoading]="expenseStore.isLoading()"
            [initialValue]="selectedExpense()"
            submitButtonText="Update Expense"
            (formSubmit)="updateExpense($event)"
          />
        }
      </div>
    </div>
  `,
})
export class ExpenseUpdateComponent {
  private readonly router = inject(Router);
  protected readonly expenseStore = inject(ExpenseStore);

  protected readonly expenseId = input.required<string>();

  constructor() {
    this.expenseStore.selectExpense(this.expenseId());
  }

  protected get selectedExpense() {
    return this.expenseStore.selectedExpense;
  }

  protected updateExpense(expense: Expense): void {
    if (!this.selectedExpense()) return;

    this.expenseStore.updateExpense(expense);
    this.router.navigate(["/expenses", this.expenseId()]);
  }

  protected goBack(): void {
    this.router.navigate(["/expenses", this.expenseId()]);
  }
}
