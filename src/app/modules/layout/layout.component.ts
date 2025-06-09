import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { v4 as uuidv4 } from "uuid";
import { Expense } from "../../models";
import { ExpenseStore } from "../../store/expense.store";
import { ExpenseFilterCriteria } from "../expenses/expenses-filter.component";

type AppView = "dashboard" | "expenses";

@Component({
  selector: "my-layout",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="container mx-auto p-4">
      <header class="mb-8">
        <div class="flex justify-between items-center mb-2">
          <h1 class="text-3xl font-bold">Financial Tracker</h1>
          <div class="space-x-2">
            <a
              routerLink="/dashboard"
              routerLinkActive="bg-blue-500 text-white"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 rounded-lg bg-gray-200"
            >
              Dashboard
            </a>
            <a
              routerLink="/expenses"
              routerLinkActive="bg-blue-500 text-white"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 rounded-lg bg-gray-200"
            >
              Manage Expenses
            </a>
          </div>
        </div>
        <p class="text-gray-600">Using NgRx Signal Store</p>
      </header>

      <router-outlet />
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

    return this.expenseStore.filteredExpenses().find((e) => e.uuid === id) || null;
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
