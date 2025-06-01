import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, effect, inject, input } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Expense } from "../../models";
import { ExpenseStore } from "../../store/expense.store";

@Component({
  selector: "my-expense-update",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
          <form [formGroup]="expenseForm" (ngSubmit)="updateExpense()" class="bg-white rounded-lg shadow p-6">
            <div class="space-y-4">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="title"> Title * </label>
                <input
                  type="text"
                  id="title"
                  formControlName="title"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="expenseForm.get('title')?.invalid && expenseForm.get('title')?.touched"
                />
                @if (expenseForm.get("title")?.invalid && expenseForm.get("title")?.touched) {
                  <p class="mt-1 text-sm text-red-600">Title is required</p>
                }
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="category"> Category * </label>
                <input
                  type="text"
                  id="category"
                  formControlName="category"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="expenseForm.get('category')?.invalid && expenseForm.get('category')?.touched"
                />
                @if (expenseForm.get("category")?.invalid && expenseForm.get("category")?.touched) {
                  <p class="mt-1 text-sm text-red-600">Category is required</p>
                }
              </div>

              <!-- Start Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="startDate"> Start Date * </label>
                <input
                  type="date"
                  id="startDate"
                  formControlName="startDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="expenseForm.get('startDate')?.invalid && expenseForm.get('startDate')?.touched"
                />
                @if (expenseForm.get("startDate")?.invalid && expenseForm.get("startDate")?.touched) {
                  <p class="mt-1 text-sm text-red-600">Start date is required</p>
                }
              </div>

              <!-- Recurrence -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="recurrence"> Recurrence * </label>
                <select
                  id="recurrence"
                  formControlName="recurrence"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <!-- End Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="endDate"> End Date (Optional) </label>
                <input
                  type="date"
                  id="endDate"
                  formControlName="endDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="description"> Description (Optional) </label>
                <textarea
                  id="description"
                  formControlName="description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <!-- Payment Method -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="paymentMethod"> Payment Method (Optional) </label>
                <input
                  type="text"
                  id="paymentMethod"
                  formControlName="paymentMethod"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <button
                type="submit"
                [disabled]="expenseForm.invalid || expenseStore.isLoading()"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Expense
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class ExpenseUpdateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly expenseStore = inject(ExpenseStore);

  protected readonly expenseId = input.required<string>();

  protected readonly expenseForm: FormGroup = this.fb.group({
    title: ["", Validators.required],
    category: ["", Validators.required],
    startDate: ["", Validators.required],
    recurrence: ["monthly", Validators.required],
    endDate: [""],
    description: [""],
    paymentMethod: [""],
  });

  constructor() {
    this.expenseStore.selectExpense(this.expenseId());

    // Update form when selected expense changes
    effect(() => {
      const expense = this.selectedExpense();
      if (expense) {
        this.expenseForm.patchValue({
          title: expense.title,
          category: expense.category,
          startDate: this.formatDateForInput(expense.startDate),
          recurrence: expense.recurrence,
          endDate: expense.endDate ? this.formatDateForInput(expense.endDate) : null,
          description: expense.description || "",
          paymentMethod: expense.paymentMethod || "",
        });
      }
    });
  }

  protected get selectedExpense() {
    return this.expenseStore.selectedExpense;
  }

  protected updateExpense(): void {
    if (this.expenseForm.invalid || !this.selectedExpense()) return;

    const formValue = this.expenseForm.value;
    const currentExpense = this.selectedExpense()!;

    const updatedExpense: Expense = {
      ...currentExpense,
      title: formValue.title,
      category: formValue.category,
      startDate: this.createDateInUTC(formValue.startDate),
      recurrence: formValue.recurrence,
      endDate: formValue.endDate ? this.createDateInUTC(formValue.endDate) : null,
      description: formValue.description || null,
      paymentMethod: formValue.paymentMethod || null,
    };

    this.expenseStore.updateExpense(updatedExpense);
    this.router.navigate(["/expenses", currentExpense.uuid]);
  }

  protected goBack(): void {
    this.router.navigate(["/expenses", this.expenseId()]);
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  private createDateInUTC(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }
}
