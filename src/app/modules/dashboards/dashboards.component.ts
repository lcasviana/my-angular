import { CurrencyPipe, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject } from "@angular/core";

import { CardModule } from "primeng/card";
import { ProgressBarModule } from "primeng/progressbar";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";

import { Expense } from "my-angular/models";
import { ExpenseStore, PaymentsStore } from "my-angular/stores";

interface PaymentSummary {
  id: string;
  date: Date;
  amount: number;
  expenseTitle: string;
}

interface UpcomingExpense {
  id: string;
  title: string;
  nextDueDate: Date;
  recurrence: string;
}

@Component({
  selector: "my-dashboards",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CardModule, CurrencyPipe, DatePipe, ProgressBarModule, TableModule, TagModule],
  template: `
    <p-card styleClass="mb-6">
      <h2 class="mb-4 text-xl font-semibold">Financial Dashboard</h2>

      <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <p-card styleClass="bg-blue-50">
          <h3 class="mb-1 text-sm font-medium text-blue-800">Total Active Expenses</h3>
          <p class="text-2xl font-bold text-blue-900">{{ activeExpenseCount() }}</p>
          <p class="mt-1 text-sm text-blue-700">
            From {{ totalExpenseCount() }} total expenses
            @if (activeExpenseCount() < totalExpenseCount()) {
              <p-tag styleClass="ml-1" severity="info" [value]="totalExpenseCount() - activeExpenseCount() + ' inactive'" />
            }
          </p>
        </p-card>

        <p-card styleClass="bg-green-50">
          <h3 class="mb-1 text-sm font-medium text-green-800">Paid in May 2025</h3>
          <p class="text-2xl font-bold text-green-900">{{ totalPaidThisMonth() | currency }}</p>
          <p class="mt-1 text-sm text-green-700">Across {{ paymentsThisMonth().length }} payments</p>
        </p-card>

        <p-card styleClass="bg-amber-50">
          <h3 class="mb-1 text-sm font-medium text-amber-800">Total Payments</h3>
          <p class="text-2xl font-bold text-amber-900">{{ totalPaymentCount() }}</p>
          <p class="mt-1 text-sm text-amber-700">
            Payment records tracked
            @if (totalPaymentCount() > 0) {
              <span class="mt-1 block">
                Latest: <span class="font-medium">{{ latestPaymentDate() | date: "MMM d" }}</span>
              </span>
            }
          </p>
        </p-card>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <div class="mb-6">
            <h3 class="text-md mb-3 font-semibold text-gray-700">Expenses by Recurrence</h3>
            <p-table [value]="recurrenceBreakdown()" [tableStyle]="{ 'min-width': '30rem' }">
              <ng-template pTemplate="header">
                <tr>
                  <th>Recurrence</th>
                  <th class="text-right">Count</th>
                  <th class="text-right">% of Total</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-recurrence>
                <tr>
                  <td>{{ recurrence.name }}</td>
                  <td class="text-right">{{ recurrence.count }}</td>
                  <td class="text-right">
                    <div class="flex items-center justify-end gap-2">
                      <p-progressBar [value]="recurrence.percentage" [showValue]="false" styleClass="h-2 w-16" />
                      <span>{{ recurrence.percentage.toFixed(1) }}%</span>
                    </div>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>

          <div>
            <h3 class="text-md mb-3 font-semibold text-gray-700">Upcoming Expenses</h3>
            <p-table [value]="upcomingExpenses()" [tableStyle]="{ 'min-width': '30rem' }">
              <ng-template pTemplate="header">
                <tr>
                  <th>Next Due</th>
                  <th>Title</th>
                  <th>Recurrence</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-expense>
                <tr>
                  <td>
                    <span [class.font-medium]="isUpcomingSoon(expense.nextDueDate)" [class.text-red-600]="isUpcomingSoon(expense.nextDueDate)">
                      {{ expense.nextDueDate | date: "MMM d" : "GMT" }}
                    </span>
                  </td>
                  <td>{{ expense.title }}</td>
                  <td>{{ expense.recurrence }}</td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="3">
                    <p class="py-3 text-center text-gray-500 italic">No upcoming expenses found</p>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>

        <div>
          <div>
            <h3 class="text-md mb-3 font-semibold text-gray-700">Recent Payments</h3>
            <p-table [value]="recentPayments()" [tableStyle]="{ 'min-width': '30rem' }">
              <ng-template pTemplate="header">
                <tr>
                  <th>Date</th>
                  <th>Expense</th>
                  <th class="text-right">Amount</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-payment>
                <tr>
                  <td>{{ payment.date | date: "mediumDate" : "GMT" }}</td>
                  <td>{{ payment.expenseTitle }}</td>
                  <td class="text-right">{{ payment.amount | currency }}</td>
                </tr>
              </ng-template>
              <ng-template pTemplate="footer">
                @if (recentPayments().length > 0) {
                  <tr>
                    <td colspan="2" class="text-right font-medium">Total:</td>
                    <td class="text-right font-medium">
                      {{ recentPaymentsTotal() | currency }}
                    </td>
                  </tr>
                }
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="3">
                    <p class="py-3 text-center text-gray-500 italic">No payment records found</p>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>
      </div>
    </p-card>
  `,
})
export class DashboardComponent {
  protected readonly expenseStore = inject(ExpenseStore);
  protected readonly paymentsStore = inject(PaymentsStore);

  private readonly currentDate = new Date(2025, 4, 4);

  protected readonly activeExpenseCount = computed(() => {
    return this.expenseStore.expensesActive().length;
  });

  protected readonly totalExpenseCount = computed(() => {
    return this.expenseStore.expenses().length;
  });

  protected readonly totalPaymentCount = computed(() => {
    return this.paymentsStore.payments().length;
  });

  protected readonly latestPaymentDate = computed(() => {
    const payments = this.paymentsStore.payments();
    if (payments.length === 0) return null;
    const sortedPayments = payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return new Date(sortedPayments[0].date);
  });

  protected readonly recurrenceBreakdown = computed(() => {
    const expenses = this.expenseStore.expenses();
    const recurrenceMap = new Map<string, number>();
    const totalExpenses = expenses.length;

    if (totalExpenses === 0) return [];

    expenses.forEach((expense) => {
      const recurrence = expense.recurrence;
      recurrenceMap.set(recurrence, (recurrenceMap.get(recurrence) || 0) + 1);
    });

    const result = Array.from(recurrenceMap.entries()).map(([name, count]) => {
      return {
        name,
        count,
        percentage: (count / totalExpenses) * 100,
      };
    });

    return result.sort((a, b) => b.count - a.count);
  });

  protected readonly recentPayments = computed(() => {
    const allPayments: PaymentSummary[] = [];
    const expenses = this.expenseStore.expenses();
    const payments = this.paymentsStore.payments();

    payments.forEach((payment) => {
      const expense = expenses.find((e) => e.expenseId === payment.expenseId);
      if (expense) {
        allPayments.push({
          id: payment.paymentId,
          date: new Date(payment.date),
          amount: payment.value,
          expenseTitle: expense.title,
        });
      }
    });

    return allPayments.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
  });

  protected readonly recentPaymentsTotal = computed(() => {
    return this.recentPayments().reduce((sum, payment) => sum + payment.amount, 0);
  });

  protected readonly paymentsThisMonth = computed(() => {
    const startOfMonth = new Date(Date.UTC(2025, 4, 1));
    const endOfMonth = new Date(Date.UTC(2025, 4, 31, 23, 59, 59));

    const allPayments: PaymentSummary[] = [];
    const expenses = this.expenseStore.expenses();
    const payments = this.paymentsStore.payments();

    payments.forEach((payment) => {
      const paymentDate = new Date(payment.date);
      if (paymentDate >= startOfMonth && paymentDate <= endOfMonth) {
        const expense = expenses.find((e) => e.expenseId === payment.expenseId);
        if (expense) {
          allPayments.push({
            id: payment.paymentId,
            date: paymentDate,
            amount: payment.value,
            expenseTitle: expense.title,
          });
        }
      }
    });

    return allPayments;
  });

  protected readonly totalPaidThisMonth = computed(() => {
    return this.paymentsThisMonth().reduce((sum, payment) => sum + payment.amount, 0);
  });

  protected readonly upcomingExpenses = computed(() => {
    const result: UpcomingExpense[] = [];
    const today = this.currentDate;
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);

    this.expenseStore.expensesActive().forEach((expense) => {
      const nextDueDate = this.calculateNextDueDate(expense);

      if (nextDueDate && nextDueDate <= thirtyDaysLater) {
        result.push({
          id: expense.expenseId,
          title: expense.title,
          nextDueDate,
          recurrence: expense.recurrence,
        });
      }
    });

    return result.sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime());
  });

  private calculateNextDueDate(expense: Expense): Date {
    const startDate = new Date(expense.startDate);
    const today = this.currentDate;

    if (startDate > today) {
      return startDate;
    }

    const monthDiff = (today.getFullYear() - startDate.getFullYear()) * 12 + today.getMonth() - startDate.getMonth();

    let nextDueDate: Date;

    if (expense.recurrence === "monthly") {
      const monthsToAdd = monthDiff + (today.getDate() >= startDate.getDate() ? 1 : 0);
      nextDueDate = new Date(startDate);
      nextDueDate.setUTCMonth(startDate.getUTCMonth() + monthsToAdd);
    } else {
      const yearDiff = today.getFullYear() - startDate.getFullYear();
      const yearsToAdd =
        yearDiff +
        (today.getMonth() > startDate.getMonth() || (today.getMonth() === startDate.getMonth() && today.getDate() >= startDate.getDate()) ? 1 : 0);

      nextDueDate = new Date(startDate);
      nextDueDate.setUTCFullYear(startDate.getUTCFullYear() + yearsToAdd);
    }

    return nextDueDate;
  }

  protected isUpcomingSoon(date: Date): boolean {
    const today = this.currentDate;
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    return date <= sevenDaysLater;
  }
}
