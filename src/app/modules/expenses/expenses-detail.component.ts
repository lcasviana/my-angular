import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input } from "@angular/core";
import { Router, RouterLink } from "@angular/router";

import { Expense } from "../../models";
import { ExpenseStore } from "../../store/expense.store";
import { PaymentListComponent } from "./payments-list.component";

@Component({
  selector: "my-expenses-detail",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe, RouterLink, PaymentListComponent],
  template: `
    <div class="container mx-auto p-4">
      <div class="mx-auto max-w-4xl">
        <div class="mb-6 flex items-center justify-between">
          <h1 class="text-2xl font-bold">Expense Details</h1>
          <div class="space-x-2">
            <a [routerLink]="['/expenses', expenseId(), 'edit']" class="text-blue-500 hover:text-blue-700">Edit</a>
            <button (click)="goBack()" class="text-gray-600 hover:text-gray-800">Back to List</button>
          </div>
        </div>

        @if (expenseStore.loading()) {
          <div class="flex items-center justify-center py-4">
            <p class="text-gray-500">Loading...</p>
          </div>
        } @else if (!selectedExpense()) {
          <div class="flex items-center justify-center py-4">
            <p class="text-gray-500">Expense not found</p>
          </div>
        } @else {
          <div class="mb-6 rounded-lg bg-white p-6 shadow">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h2 class="mb-4 text-xl font-semibold">{{ selectedExpense()?.title }}</h2>
                <dl class="space-y-2">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Category</dt>
                    <dd class="mt-1">{{ selectedExpense()?.category }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Start Date</dt>
                    <dd class="mt-1">{{ selectedExpense()?.startDate | date: "mediumDate" : "GMT" }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Recurrence</dt>
                    <dd class="mt-1">{{ selectedExpense()?.recurrence }}</dd>
                  </div>
                  @if (selectedExpense()?.endDate) {
                    <div>
                      <dt class="text-sm font-medium text-gray-500">End Date</dt>
                      <dd class="mt-1">{{ selectedExpense()?.endDate | date: "mediumDate" : "GMT" }}</dd>
                    </div>
                  }
                </dl>
              </div>
              <div>
                <dl class="space-y-2">
                  @if (selectedExpense()?.description) {
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Description</dt>
                      <dd class="mt-1">{{ selectedExpense()?.description }}</dd>
                    </div>
                  }
                  @if (selectedExpense()?.paymentMethod) {
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Payment Method</dt>
                      <dd class="mt-1">{{ selectedExpense()?.paymentMethod }}</dd>
                    </div>
                  }
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Total Payments</dt>
                    <dd class="mt-1">
                      {{ selectedExpense()?.payments?.length || 0 }} payment{{ (selectedExpense()?.payments?.length || 0) > 1 ? "s" : "" }}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <!-- Payment List -->
          @if (selectedExpense()) {
            <my-payments-list [expense]="selectedExpense()!" (paymentsUpdated)="handlePaymentUpdate($event)" />
          }
        }
      </div>
    </div>
  `,
})
export class ExpenseDetailComponent {
  private readonly router = inject(Router);
  protected readonly expenseStore = inject(ExpenseStore);

  protected readonly expenseId = input.required<string>();

  constructor() {
    this.expenseStore.selectExpense(this.expenseId());
  }

  protected get selectedExpense() {
    return this.expenseStore.selectedExpense;
  }

  protected handlePaymentUpdate(expense: Expense): void {
    this.expenseStore.updateExpense(expense);
  }

  protected goBack(): void {
    this.router.navigate(["/expenses"]);
  }
}
