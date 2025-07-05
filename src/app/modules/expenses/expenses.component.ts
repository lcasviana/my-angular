import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Signal, ViewEncapsulation, computed, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";

import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";

import { Expense } from "my-angular/models";
import { ExpenseStore } from "my-angular/stores";

@Component({
  selector: "my-expenses-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ButtonModule, CardModule, DatePipe, RouterLink, TableModule],
  template: `
    <p-card header="Expenses">
      <button pButton type="button" (click)="createExpense()">Create Expense</button>
      <p-table [value]="expenses()">
        <ng-template pTemplate="header">
          <tr>
            <th>Name</th>
            <th>Recurrence</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-expense>
          <tr>
            <td>{{ expense.title }}</td>
            <td>{{ expense.recurrence }}</td>
            <td>{{ expense.startDate | date: "MM/dd/yyyy" }}</td>
            <td>{{ expense.endDate | date: "MM/dd/yyyy" }}</td>
            <td>
              <a pButton [routerLink]="['/expenses', expense.expenseId]">View</a>
              <a pButton [routerLink]="['/expenses', expense.expenseId, 'update']">Update</a>
              <button pButton type="button" (click)="deleteExpense(expense.expenseId)">Delete</button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
})
export class ExpenseListComponent {
  private readonly router = inject(Router);

  private readonly expenseStore = inject(ExpenseStore);

  protected readonly expenses: Signal<Expense[]> = computed((): Expense[] => this.expenseStore.expenses());

  protected createExpense(): void {
    this.router.navigate(["/expenses", "create"]);
  }

  protected deleteExpense(expenseId: string): void {
    if (confirm("Are you sure you want to delete this expense?")) {
      this.expenseStore.deleteExpense(expenseId);
    }
  }
}
