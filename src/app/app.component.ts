import { CommonModule, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { v4 as uuidv4 } from "uuid";
import { Expense } from "./models";
import { ExpenseStore } from "./store/signal-store/expense.store";

@Component({
  selector: "my-root",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe],
  template: `
    <div class="container mx-auto p-4">
      <header class="mb-8">
        <h1 class="text-3xl font-bold">Financial Tracker</h1>
        <p class="text-gray-600">Using NgRx Signal Store</p>
      </header>

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
        <section class="bg-white p-6 rounded-lg shadow">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Expenses</h2>
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
          } @else if (expenseStore.allExpenses().length === 0) {
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
                  @for (expense of expenseStore.allExpenses(); track expense.uuid) {
                    <tr>
                      <td class="py-2 px-4 border-b">{{ expense.title }}</td>
                      <td class="py-2 px-4 border-b">{{ expense.category }}</td>
                      <td class="py-2 px-4 border-b">{{ expense.startDate | date: "shortDate" }}</td>
                      <td class="py-2 px-4 border-b">{{ expense.recurrence }}</td>
                      <td class="py-2 px-4 border-b text-center">
                        <button class="text-blue-500 hover:text-blue-700 mr-2" (click)="editExpense(expense)">Edit</button>
                        <button class="text-red-500 hover:text-red-700" (click)="deleteExpense(expense.uuid)">Delete</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      background-color: #f9fafb;
      min-height: 100vh;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  private fb = inject(FormBuilder);
  protected expenseStore = inject(ExpenseStore);

  // Signal to track if we're in edit mode
  protected editMode = signal(false);

  // Form for creating/editing expenses
  protected expenseForm: FormGroup = this.fb.group({
    uuid: [""],
    title: ["", Validators.required],
    category: ["", Validators.required],
    startDate: ["", Validators.required],
    recurrence: ["monthly", Validators.required],
    endDate: [null],
    description: [""],
    paymentMethod: [""],
  });

  constructor() {
    // Load expenses when component initializes
    this.loadExpenses();
  }

  /**
   * Load all expenses from the store
   */
  protected loadExpenses(): void {
    this.expenseStore.loadExpenses();
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
      startDate: new Date(formValue.startDate),
      recurrence: formValue.recurrence,
      endDate: formValue.endDate ? new Date(formValue.endDate) : null,
      description: formValue.description || null,
      paymentMethod: formValue.paymentMethod || null,
    };

    if (this.editMode()) {
      this.expenseStore.updateExpense(expense);
    } else {
      this.expenseStore.createExpense(expense);
    }

    this.resetForm();
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
  }

  /**
   * Delete an expense
   */
  protected deleteExpense(id: string): void {
    if (confirm("Are you sure you want to delete this expense?")) {
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
   * Format a Date object for date input (YYYY-MM-DD)
   */
  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    // Format the date as YYYY-MM-DD
    return d.toISOString().split("T")[0];
  }
}
