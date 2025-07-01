import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from "@angular/core";
import { RouterLink } from "@angular/router";

import { ExpenseStore } from "../../store/expense.store";
import { ExpenseFilterComponent, ExpenseFilterCriteria } from "./expenses-filter.component";

@Component({
  selector: "my-expenses-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe, ExpenseFilterComponent, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Filter Component -->
      <my-expenses-filter [categories]="expenseStore.uniqueCategories()" (filterChange)="handleFilterChange($event)" />

      <div class="rounded-lg bg-white p-6 shadow">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold">Expenses</h2>
            <p class="text-sm text-gray-500">Showing {{ expenseStore.filteredExpenseCount() }} of {{ expenseStore.expenseCount() }} expenses</p>
          </div>
          <div class="flex gap-2">
            <a routerLink="/expenses/create" class="rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"> Add Expense </a>
            <button
              class="rounded bg-green-500 px-2 py-1 text-sm text-white hover:bg-green-600"
              (click)="loadExpenses()"
              [disabled]="expenseStore.loading()"
            >
              Refresh
            </button>
          </div>
        </div>

        @if (expenseStore.loading()) {
          <div class="flex items-center justify-center py-4">
            <p class="text-gray-500">Loading...</p>
          </div>
        } @else if (expenseStore.filteredExpenses().length === 0) {
          <div class="flex items-center justify-center py-4">
            <p class="text-gray-500">No expenses found</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead>
                <tr>
                  <th class="border-b px-4 py-2 text-left">Title</th>
                  <th class="border-b px-4 py-2 text-left">Category</th>
                  <th class="border-b px-4 py-2 text-left">Start Date</th>
                  <th class="border-b px-4 py-2 text-left">Recurrence</th>
                  <th class="border-b px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (expense of expenseStore.filteredExpenses(); track expense.uuid) {
                  <tr>
                    <td class="border-b px-4 py-2">
                      <div class="flex items-center">
                        <span>{{ expense.title }}</span>
                        @if (expense.payments && expense.payments.length > 0) {
                          <span class="ml-2 inline-block rounded-full bg-green-100 px-2 text-xs text-green-800">
                            {{ expense.payments.length }} payment{{ expense.payments.length > 1 ? "s" : "" }}
                          </span>
                        }
                      </div>
                    </td>
                    <td class="border-b px-4 py-2">{{ expense.category }}</td>
                    <td class="border-b px-4 py-2">{{ expense.startDate | date: "shortDate" : "GMT" }}</td>
                    <td class="border-b px-4 py-2">{{ expense.recurrence }}</td>
                    <td class="border-b px-4 py-2 text-center">
                      <a [routerLink]="['/expenses', expense.uuid]" class="mr-2 text-purple-500 hover:text-purple-700"> View </a>
                      <a [routerLink]="['/expenses', expense.uuid, 'edit']" class="mr-2 text-blue-500 hover:text-blue-700"> Edit </a>
                      <button (click)="deleteExpense(expense.uuid)" class="text-red-500 hover:text-red-700">Delete</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
})
export class ExpenseListComponent {
  protected readonly expenseStore = inject(ExpenseStore);

  protected handleFilterChange(criteria: ExpenseFilterCriteria): void {
    this.expenseStore.setFilterCriteria(criteria);
  }

  protected loadExpenses(): void {
    this.expenseStore.getExpenses();
  }

  protected deleteExpense(id: string): void {
    if (confirm("Are you sure you want to delete this expense?")) {
      this.expenseStore.deleteExpense(id);
    }
  }
}
