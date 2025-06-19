import { CurrencyPipe, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject } from "@angular/core";

import { Expense } from "../../models";
import { ExpenseStore } from "../../store/expense.store";

interface PaymentSummary {
  id: string;
  date: Date;
  amount: number;
  expenseTitle: string;
  category: string;
}

interface UpcomingExpense {
  id: string;
  title: string;
  category: string;
  nextDueDate: Date;
  recurrence: string;
}

@Component({
  selector: "my-dashboards",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DatePipe, CurrencyPipe],
  template: `
    <div class="mb-6 rounded-lg bg-white p-6 shadow">
      <h2 class="mb-4 text-xl font-semibold">Financial Dashboard</h2>

      <!-- Summary Cards -->
      <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <!-- Total Expenses Card -->
        <div class="rounded-lg bg-blue-50 p-4 shadow-sm">
          <h3 class="mb-1 text-sm font-medium text-blue-800">Total Active Expenses</h3>
          <p class="text-2xl font-bold text-blue-900">{{ activeExpenseCount() }}</p>
          <p class="mt-1 text-sm text-blue-700">
            From {{ expenseStore.expenseCount() }} total expenses
            @if (activeExpenseCount() < expenseStore.expenseCount()) {
              <span class="ml-1 rounded-full bg-blue-200 px-2 py-0.5 text-xs">
                {{ expenseStore.expenseCount() - activeExpenseCount() }} inactive
              </span>
            }
          </p>
        </div>

        <!-- Total Paid This Month Card -->
        <div class="rounded-lg bg-green-50 p-4 shadow-sm">
          <h3 class="mb-1 text-sm font-medium text-green-800">Paid in May 2025</h3>
          <p class="text-2xl font-bold text-green-900">{{ totalPaidThisMonth() | currency }}</p>
          <p class="mt-1 text-sm text-green-700">Across {{ paymentsThisMonth().length }} payments</p>
        </div>

        <!-- Upcoming Payments Card -->
        <div class="rounded-lg bg-amber-50 p-4 shadow-sm">
          <h3 class="mb-1 text-sm font-medium text-amber-800">Active Categories</h3>
          <p class="text-2xl font-bold text-amber-900">{{ uniqueCategories().length }}</p>
          <p class="mt-1 text-sm text-amber-700">
            Expense categories being tracked
            @if (topCategory()) {
              <span class="mt-1 block">
                Top: <span class="font-medium">{{ topCategory() }}</span>
              </span>
            }
          </p>
        </div>
      </div>

      <!-- Two-column layout for the rest of the dashboard -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Left column -->
        <div>
          <!-- Category Breakdown -->
          <div class="mb-6">
            <h3 class="text-md mb-3 font-semibold text-gray-700">Expenses by Category</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">Category</th>
                    <th class="px-4 py-2 text-right text-sm font-medium text-gray-500">Count</th>
                    <th class="px-4 py-2 text-right text-sm font-medium text-gray-500">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  @for (category of categoryBreakdown(); track category.name) {
                    <tr class="border-b">
                      <td class="px-4 py-2">{{ category.name }}</td>
                      <td class="px-4 py-2 text-right">{{ category.count }}</td>
                      <td class="px-4 py-2 text-right">
                        <div class="flex items-center justify-end">
                          <div class="mr-2 h-2 w-16 rounded-full bg-gray-200">
                            <div class="h-2 rounded-full bg-blue-600" [style.width]="category.percentage + '%'"></div>
                          </div>
                          {{ category.percentage.toFixed(1) }}%
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Upcoming Expenses -->
          <div>
            <h3 class="text-md mb-3 font-semibold text-gray-700">Upcoming Expenses</h3>
            @if (upcomingExpenses().length === 0) {
              <p class="py-3 text-gray-500 italic">No upcoming expenses found</p>
            } @else {
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="bg-gray-50">
                      <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">Next Due</th>
                      <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">Title</th>
                      <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">Category</th>
                      <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">Recurrence</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (expense of upcomingExpenses(); track expense.id) {
                      <tr class="border-b">
                        <td class="px-4 py-2">
                          <span [class.font-medium]="isUpcomingSoon(expense.nextDueDate)" [class.text-red-600]="isUpcomingSoon(expense.nextDueDate)">
                            {{ expense.nextDueDate | date: "MMM d" : "GMT" }}
                          </span>
                        </td>
                        <td class="px-4 py-2">{{ expense.title }}</td>
                        <td class="px-4 py-2">{{ expense.category }}</td>
                        <td class="px-4 py-2">{{ expense.recurrence }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>

        <!-- Right column -->
        <div>
          <!-- Recent Payments -->
          <div>
            <h3 class="text-md mb-3 font-semibold text-gray-700">Recent Payments</h3>
            @if (recentPayments().length === 0) {
              <p class="py-3 text-gray-500 italic">No payment records found</p>
            } @else {
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="bg-gray-50">
                      <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                      <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">Expense</th>
                      <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">Category</th>
                      <th class="px-4 py-2 text-right text-sm font-medium text-gray-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (payment of recentPayments(); track payment.id) {
                      <tr class="border-b">
                        <td class="px-4 py-2">{{ payment.date | date: "mediumDate" : "GMT" }}</td>
                        <td class="px-4 py-2">{{ payment.expenseTitle }}</td>
                        <td class="px-4 py-2">{{ payment.category }}</td>
                        <td class="px-4 py-2 text-right">{{ payment.amount | currency }}</td>
                      </tr>
                    }
                  </tbody>
                  <tfoot>
                    @if (recentPayments().length > 0) {
                      <tr>
                        <td colspan="3" class="px-4 py-2 text-right font-medium">Total:</td>
                        <td class="px-4 py-2 text-right font-medium">
                          {{ recentPaymentsTotal() | currency }}
                        </td>
                      </tr>
                    }
                  </tfoot>
                </table>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  protected readonly expenseStore = inject(ExpenseStore);

  // Current date - using May 4, 2025 as per context
  private readonly currentDate = new Date(2025, 4, 4); // May is 4 (0-based index)

  // Computed signals for dashboard metrics
  protected readonly activeExpenseCount = computed(() => {
    return this.expenseStore.expenses().filter((expense) => {
      // Expense is active if it has no end date or end date is in the future
      return !expense.endDate || new Date(expense.endDate) > this.currentDate;
    }).length;
  });

  protected readonly uniqueCategories = computed(() => {
    return this.expenseStore.uniqueCategories();
  });

  protected readonly topCategory = computed(() => {
    const breakdown = this.categoryBreakdown();
    return breakdown.length > 0 ? breakdown[0].name : null;
  });

  protected readonly categoryBreakdown = computed(() => {
    const expenses = this.expenseStore.expenses();
    const categoryMap = new Map<string, number>();
    const totalExpenses = expenses.length;

    if (totalExpenses === 0) return [];

    // Count expenses by category
    expenses.forEach((expense) => {
      const category = expense.category;
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    // Convert to array of objects with percentages
    const result = Array.from(categoryMap.entries()).map(([name, count]) => {
      return {
        name,
        count,
        percentage: (count / totalExpenses) * 100,
      };
    });

    // Sort by count descending
    return result.sort((a, b) => b.count - a.count);
  });

  protected readonly recentPayments = computed(() => {
    const allPayments: PaymentSummary[] = [];

    this.expenseStore.expenses().forEach((expense) => {
      if (!expense.payments?.length) return;

      expense.payments.forEach((payment) => {
        allPayments.push({
          id: payment.uuid,
          date: new Date(payment.date),
          amount: payment.value,
          expenseTitle: expense.title,
          category: expense.category,
        });
      });
    });

    // Sort by date descending and take the latest 10
    return allPayments.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
  });

  protected readonly recentPaymentsTotal = computed(() => {
    return this.recentPayments().reduce((sum, payment) => sum + payment.amount, 0);
  });

  protected readonly paymentsThisMonth = computed(() => {
    // For May 2025
    const startOfMonth = new Date(Date.UTC(2025, 4, 1)); // May 1, 2025
    const endOfMonth = new Date(Date.UTC(2025, 4, 31, 23, 59, 59)); // May 31, 2025

    const allPayments: PaymentSummary[] = [];

    this.expenseStore.expenses().forEach((expense) => {
      if (!expense.payments?.length) return;

      expense.payments.forEach((payment) => {
        const paymentDate = new Date(payment.date);
        if (paymentDate >= startOfMonth && paymentDate <= endOfMonth) {
          allPayments.push({
            id: payment.uuid,
            date: paymentDate,
            amount: payment.value,
            expenseTitle: expense.title,
            category: expense.category,
          });
        }
      });
    });

    return allPayments;
  });

  protected readonly totalPaidThisMonth = computed(() => {
    return this.paymentsThisMonth().reduce((sum, payment) => sum + payment.amount, 0);
  });

  /**
   * Calculate upcoming expenses for the next 30 days
   */
  protected readonly upcomingExpenses = computed(() => {
    const result: UpcomingExpense[] = [];
    const today = this.currentDate;
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);

    this.expenseStore.expenses().forEach((expense) => {
      // Skip if expense has ended
      if (expense.endDate && new Date(expense.endDate) < today) {
        return;
      }

      // Calculate the next due date based on recurrence
      const nextDueDate = this.calculateNextDueDate(expense);

      // Include if due date is within the next 30 days
      if (nextDueDate && nextDueDate <= thirtyDaysLater) {
        result.push({
          id: expense.uuid,
          title: expense.title,
          category: expense.category,
          nextDueDate,
          recurrence: expense.recurrence,
        });
      }
    });

    // Sort by next due date (ascending)
    return result.sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime());
  });

  /**
   * Calculate the next due date for an expense based on its recurrence
   */
  private calculateNextDueDate(expense: Expense): Date {
    const startDate = new Date(expense.startDate);
    const today = this.currentDate;

    if (startDate > today) {
      // If start date is in the future, that's the next due date
      return startDate;
    }

    // Calculate months or years since start
    const monthDiff = (today.getFullYear() - startDate.getFullYear()) * 12 + today.getMonth() - startDate.getMonth();

    let nextDueDate: Date;

    if (expense.recurrence === "monthly") {
      // Add months to start date until we get a date in the future
      const monthsToAdd = monthDiff + (today.getDate() >= startDate.getDate() ? 1 : 0);
      nextDueDate = new Date(startDate);
      nextDueDate.setUTCMonth(startDate.getUTCMonth() + monthsToAdd);
    } else {
      // Yearly recurrence - add years to start date
      const yearDiff = today.getFullYear() - startDate.getFullYear();
      const yearsToAdd =
        yearDiff +
        (today.getMonth() > startDate.getMonth() || (today.getMonth() === startDate.getMonth() && today.getDate() >= startDate.getDate()) ? 1 : 0);

      nextDueDate = new Date(startDate);
      nextDueDate.setUTCFullYear(startDate.getUTCFullYear() + yearsToAdd);
    }

    return nextDueDate;
  }

  /**
   * Check if a date is within 7 days from now
   */
  protected isUpcomingSoon(date: Date): boolean {
    const today = this.currentDate;
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    return date <= sevenDaysLater;
  }
}
