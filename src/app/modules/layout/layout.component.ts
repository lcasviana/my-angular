import { CommonModule, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { v4 as uuidv4 } from "uuid";
import { Expense } from "../../models";
import { ExpenseStore } from "../../store/expense.store";
import { DashboardComponent } from "../dashboard.component";
import { ExpenseFilterComponent, ExpenseFilterCriteria } from "../expense-filter.component";
import { PaymentListComponent } from "../payment-list.component";

type AppView = "dashboard" | "expenses";

@Component({
  selector: "my-layout",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe, ExpenseFilterComponent, PaymentListComponent, DashboardComponent],
  template: `
    <div class="container mx-auto p-4">
      <header class="mb-8">
        <div class="flex justify-between items-center mb-2">
          <h1 class="text-3xl font-bold">Financial Tracker</h1>
          <div class="space-x-2">
            <button
              class="px-4 py-2 rounded-lg"
              [class.bg-blue-500]="currentView() === 'dashboard'"
              [class.text-white]="currentView() === 'dashboard'"
              [class.bg-gray-200]="currentView() !== 'dashboard'"
              (click)="setView('dashboard')"
            >
              Dashboard
            </button>
            <button
              class="px-4 py-2 rounded-lg"
              [class.bg-blue-500]="currentView() === 'expenses'"
              [class.text-white]="currentView() === 'expenses'"
              [class.bg-gray-200]="currentView() !== 'expenses'"
              (click)="setView('expenses')"
            >
              Manage Expenses
            </button>
          </div>
        </div>
        <p class="text-gray-600">Using NgRx Signal Store</p>
      </header>

      @if (currentView() === "dashboard") {
        <!-- Dashboard View -->
        <my-dashboard />
      } @else {
        <!-- Expenses Management View -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Expense Form -->
          <section class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-4">{{ editMode() ? "Edit Expense" : "Add New Expense" }}</h2>

            @if (expenseStore.error()) {
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {{ expenseStore.error() }}
                <button class="ml-2 text-red-700 hover:text-red-900" (click)="expenseStore.clearError()">✕</button>
              </div>
            }

            <form [formGroup]="expenseForm" (ngSubmit)="saveExpense()">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="title">Title</label>
                <input
                  type="text"
                  id="title"
                  formControlName="title"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                @if (expenseForm.get("title")?.invalid && expenseForm.get("title")?.touched) {
                  <p class="text-red-500 text-xs italic">Title is required</p>
                }
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="category">Category</label>
                <input
                  type="text"
                  id="category"
                  formControlName="category"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                @if (expenseForm.get("category")?.invalid && expenseForm.get("category")?.touched) {
                  <p class="text-red-500 text-xs italic">Category is required</p>
                }
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  formControlName="startDate"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                @if (expenseForm.get("startDate")?.invalid && expenseForm.get("startDate")?.touched) {
                  <p class="text-red-500 text-xs italic">Start date is required</p>
                }
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="recurrence">Recurrence</label>
                <select
                  id="recurrence"
                  formControlName="recurrence"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="endDate">End Date (Optional)</label>
                <input
                  type="date"
                  id="endDate"
                  formControlName="endDate"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="description">Description (Optional)</label>
                <textarea
                  id="description"
                  formControlName="description"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                ></textarea>
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="paymentMethod">Payment Method (Optional)</label>
                <input
                  type="text"
                  id="paymentMethod"
                  formControlName="paymentMethod"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div class="flex items-center justify-between">
                <button
                  type="submit"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  [disabled]="expenseForm.invalid || expenseStore.isLoading()"
                >
                  {{ editMode() ? "Update" : "Save" }} Expense
                </button>
                @if (editMode()) {
                  <button
                    type="button"
                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    (click)="cancelEdit()"
                  >
                    Cancel
                  </button>
                }
              </div>
            </form>
          </section>

          <!-- Expenses List -->
          <section>
            <!-- Filter Component -->
            <my-expense-filter [categories]="expenseStore.uniqueCategories()" (filterChange)="handleFilterChange($event)" />

            <div class="bg-white p-6 rounded-lg shadow mb-6">
              <div class="flex justify-between items-center mb-4">
                <div>
                  <h2 class="text-xl font-semibold">Expenses</h2>
                  <p class="text-sm text-gray-500">Showing {{ expenseStore.filteredExpenseCount() }} of {{ expenseStore.expenseCount() }} expenses</p>
                </div>
                <div class="flex gap-2">
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
                        <tr [class.bg-blue-50]="selectedExpenseId() === expense.uuid">
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
                            <button class="text-purple-500 hover:text-purple-700 mr-2" (click)="toggleExpenseSelection(expense.uuid)">
                              {{ selectedExpenseId() === expense.uuid ? "Hide Payments" : "Show Payments" }}
                            </button>
                            <button class="text-blue-500 hover:text-blue-700 mr-2" (click)="editExpense(expense)">Edit</button>
                            <button class="text-red-500 hover:text-red-700" (click)="deleteExpense(expense.uuid)">Delete</button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>

            <!-- Payment Management Section -->
            @if (selectedExpense()) {
              <my-payment-list [expense]="selectedExpense()" (paymentsUpdated)="handlePaymentUpdate($event)" />
            }
          </section>
        </div>
      }
    </div>
  `,
  styles: `
    .my-layout {
      display: block;
      background-color: #f9fafb;
      min-height: 100vh;
    }
  `,
  host: { class: "my-layout" },
})
export class LayoutComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly expenseStore = inject(ExpenseStore);

  // Signal to track the current view
  protected readonly currentView = signal<AppView>("dashboard");

  // Signal to track if we're in edit mode
  protected readonly editMode = signal(false);

  // Signal to track selected expense for payment management
  protected readonly selectedExpenseId = signal<string | null>(null);

  // Form for creating/editing expenses
  protected readonly expenseForm: FormGroup = this.fb.group({
    uuid: [""],
    title: ["", Validators.required],
    category: ["", Validators.required],
    startDate: ["", Validators.required],
    recurrence: ["monthly", Validators.required],
    endDate: [null],
    description: [""],
    paymentMethod: [""],
  });

  /**
   * Set the current view
   */
  protected setView(view: AppView): void {
    this.currentView.set(view);
  }

  /**
   * Get the currently selected expense
   */
  protected selectedExpense(): Expense | null {
    const id = this.selectedExpenseId();
    if (!id) return null;

    return this.expenseStore.filteredExpenses().find(e => e.uuid === id) || null;
  }

  /**
   * Toggle expense selection for payment management
   */
  protected toggleExpenseSelection(id: string): void {
    if (this.selectedExpenseId() === id) {
      // Deselect if already selected
      this.selectedExpenseId.set(null);
    } else {
      // Select the expense
      this.selectedExpenseId.set(id);
    }
  }

  /**
   * Handle payment updates from the payment list component
   */
  protected handlePaymentUpdate(updatedExpense: Expense): void {
    this.expenseStore.updateExpense(updatedExpense);
  }

  /**
   * Load all expenses from the store - used for manual refresh only
   */
  protected loadExpenses(): void {
    this.expenseStore.loadExpenses();
  }

  /**
   * Handle filter changes from the filter component
   */
  protected handleFilterChange(criteria: ExpenseFilterCriteria): void {
    this.expenseStore.setFilterCriteria(criteria);
  }

  /**
   * Save a new expense or update an existing one
   */
  protected saveExpense(): void {
    if (this.expenseForm.invalid) return;

    const formValue = this.expenseForm.value;
    const expense: Expense = {
      uuid: formValue.uuid || uuidv4(),
      title: formValue.title,
      category: formValue.category,
      startDate: this.createDateInUTC(formValue.startDate),
      recurrence: formValue.recurrence,
      endDate: formValue.endDate ? this.createDateInUTC(formValue.endDate) : null,
      description: formValue.description || null,
      paymentMethod: formValue.paymentMethod || null,
      // Preserve existing payments if we're editing, safely handle possibly undefined payments
      payments: this.editMode() && this.selectedExpense() && this.selectedExpense()?.payments ? [...this.selectedExpense()!.payments!] : [],
    };

    if (this.editMode()) {
      this.expenseStore.updateExpense(expense);
    } else {
      this.expenseStore.createExpense(expense);
    }

    this.resetForm();
  }

  /**
   * Creates a Date object in UTC from a date string (YYYY-MM-DD)
   */
  private createDateInUTC(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  /**
   * Edit an existing expense
   */
  protected editExpense(expense: Expense): void {
    this.editMode.set(true);

    this.expenseForm.patchValue({
      uuid: expense.uuid,
      title: expense.title,
      category: expense.category,
      startDate: this.formatDateForInput(expense.startDate),
      recurrence: expense.recurrence,
      endDate: expense.endDate ? this.formatDateForInput(expense.endDate) : null,
      description: expense.description || "",
      paymentMethod: expense.paymentMethod || "",
    });

    // Also select this expense to show its payments
    this.selectedExpenseId.set(expense.uuid);
  }

  /**
   * Delete an expense
   */
  protected deleteExpense(id: string): void {
    if (confirm("Are you sure you want to delete this expense?")) {
      // If deleting the currently selected expense, clear the selection
      if (this.selectedExpenseId() === id) {
        this.selectedExpenseId.set(null);
      }
      this.expenseStore.deleteExpense(id);
    }
  }

  /**
   * Cancel editing and reset the form
   */
  protected cancelEdit(): void {
    this.resetForm();
  }

  /**
   * Reset the form and exit edit mode
   */
  private resetForm(): void {
    this.editMode.set(false);
    this.expenseForm.reset({
      uuid: "",
      title: "",
      category: "",
      startDate: "",
      recurrence: "monthly",
      endDate: null,
      description: "",
      paymentMethod: "",
    });
  }

  /**
   * Format a Date object for date input (YYYY-MM-DD) in GMT+0
   */
  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    // Format the date as YYYY-MM-DD in GMT+0
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
