import { CommonModule, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ExpenseStore } from "../../store/expense.store";
import { ExpenseFilterComponent, ExpenseFilterCriteria } from "./expense-filter.component";

@Component({
  selector: "my-expense-list",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, DatePipe, RouterLink, ExpenseFilterComponent],
  template: `
    <div class="space-y-6">
      <!-- Filter Component -->
      <my-expense-filter [categories]="expenseStore.uniqueCategories()" (filterChange)="handleFilterChange($event)" />

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-xl font-semibold">Expenses</h2>
            <p class="text-sm text-gray-500">Showing {{ expenseStore.filteredExpenseCount() }} of {{ expenseStore.expenseCount() }} expenses</p>
          </div>
          <div class="flex gap-2">
            <a routerLink="/expenses/new" class="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-2 rounded"> Add Expense </a>
            <button
              class="bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-2 rounded"
              (click)="loadExpenses()"
              [disabled]="expenseStore.isLoading()"
            >
              Refresh
            </button>
          </div>
        </div>

        @if (expenseStore.isLoading()) {
          <div class="flex justify-center items-center py-4">
            <p class="text-gray-500">Loading...</p>
          </div>
        } @else if (expenseStore.filteredExpenses().length === 0) {
          <div class="flex justify-center items-center py-4">
            <p class="text-gray-500">No expenses found</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead>
                <tr>
                  <th class="py-2 px-4 border-b text-left">Title</th>
                  <th class="py-2 px-4 border-b text-left">Category</th>
                  <th class="py-2 px-4 border-b text-left">Start Date</th>
                  <th class="py-2 px-4 border-b text-left">Recurrence</th>
                  <th class="py-2 px-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (expense of expenseStore.filteredExpenses(); track expense.uuid) {
                  <tr>
                    <td class="py-2 px-4 border-b">
                      <div class="flex items-center">
                        <span>{{ expense.title }}</span>
                        @if (expense.payments && expense.payments.length > 0) {
                          <span class="ml-2 inline-block bg-green-100 text-green-800 text-xs px-2 rounded-full">
                            {{ expense.payments.length }} payment{{ expense.payments.length > 1 ? "s" : "" }}
                          </span>
                        }
                      </div>
                    </td>
                    <td class="py-2 px-4 border-b">{{ expense.category }}</td>
                    <td class="py-2 px-4 border-b">{{ expense.startDate | date: "shortDate" : "GMT" }}</td>
                    <td class="py-2 px-4 border-b">{{ expense.recurrence }}</td>
                    <td class="py-2 px-4 border-b text-center">
                      <a [routerLink]="['/expenses', expense.uuid]" class="text-purple-500 hover:text-purple-700 mr-2"> View </a>
                      <a [routerLink]="['/expenses', expense.uuid, 'edit']" class="text-blue-500 hover:text-blue-700 mr-2"> Edit </a>
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
  styles: ``,
})
export class ExpenseListComponent {
  protected readonly expenseStore = inject(ExpenseStore);

  protected handleFilterChange(criteria: ExpenseFilterCriteria): void {
    this.expenseStore.setFilterCriteria(criteria);
  }

  protected loadExpenses(): void {
    this.expenseStore.loadExpenses();
  }

  protected deleteExpense(id: string): void {
    if (confirm("Are you sure you want to delete this expense?")) {
      this.expenseStore.deleteExpense(id);
    }
  }
}
