import { computed, inject } from "@angular/core";
import { tapResponse } from "@ngrx/operators";
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { Expense, ExpensePayment } from "../models";
import { ExpenseFilterCriteria } from "../modules/expenses/expenses-filter.component";
import { ExpenseService } from "../services/expense.service";

/**
 * Interface representing the expense state
 */
export interface ExpenseState {
  expenses: Expense[];
  selectedExpenseId: string | null;
  selectedPaymentId: string | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
  filterCriteria: ExpenseFilterCriteria;
}

/**
 * Initial state for expenses
 */
export const initialExpenseState: ExpenseState = {
  expenses: [],
  selectedExpenseId: null,
  selectedPaymentId: null,
  loading: false,
  loaded: false,
  error: null,
  filterCriteria: {
    category: null,
    startDate: null,
    endDate: null,
    recurrenceType: null,
  },
};

/**
 * Helper function to handle unknown error types
 */
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// Feature: state slice definition
const withExpenseState = withState<ExpenseState>(initialExpenseState);

// Feature: computed properties
const withExpenseComputed = withComputed((store: object) => {
  // Cast the store to the appropriate type for typings
  const state = store as {
    expenses: () => Expense[];
    filterCriteria: () => ExpenseFilterCriteria;
    selectedExpenseId: () => string | null;
    selectedPaymentId: () => string | null;
    loading: () => boolean;
    loaded: () => boolean;
    error: () => string | null;
  };

  // Create a filteredExpenses computed property
  const filteredExpenses = computed(() => {
    let result = state.expenses();
    const criteria = state.filterCriteria();

    // Filter by category if specified
    if (criteria.category) {
      result = result.filter((expense: Expense) => expense.category === criteria.category);
    }

    // Filter by recurrence type if specified
    if (criteria.recurrenceType) {
      result = result.filter((expense: Expense) => expense.recurrence === criteria.recurrenceType);
    }

    // Filter by start date if specified
    if (criteria.startDate) {
      const startDate = new Date(criteria.startDate);
      startDate.setHours(0, 0, 0, 0);
      result = result.filter((expense: Expense) => {
        const expenseDate = new Date(expense.startDate);
        return expenseDate >= startDate;
      });
    }

    // Filter by end date if specified
    if (criteria.endDate) {
      const endDate = new Date(criteria.endDate);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter((expense: Expense) => {
        const expenseDate = new Date(expense.startDate);
        return expenseDate <= endDate;
      });
    }

    return result;
  });

  return {
    // Get all expenses
    allExpenses: computed(() => state.expenses()),

    // Get filtered expenses based on criteria
    filteredExpenses,

    // Get unique categories from all expenses
    uniqueCategories: computed(() => {
      const categories = new Set<string>();
      state.expenses().forEach((expense: Expense) => {
        if (expense.category) {
          categories.add(expense.category);
        }
      });
      return Array.from(categories).sort();
    }),

    // Get current filter criteria
    filterCriteria: computed(() => state.filterCriteria()),

    // Get selected expense
    selectedExpense: computed(() => {
      const selectedId = state.selectedExpenseId();
      return selectedId ? state.expenses().find((e: Expense) => e.uuid === selectedId) : null;
    }),

    // Get selected payment
    selectedPayment: computed(() => {
      const expense = state.selectedExpenseId() ? state.expenses().find((e: Expense) => e.uuid === state.selectedExpenseId()) : null;
      const paymentId = state.selectedPaymentId();
      return expense && paymentId ? expense.payments?.find((p: ExpensePayment) => p.uuid === paymentId) : null;
    }),

    // Get loading state
    isLoading: computed(() => state.loading()),

    // Get loaded state
    isLoaded: computed(() => state.loaded()),

    // Get error state
    error: computed(() => state.error()),

    // Get active expenses (not ended or end date is in the future)
    activeExpenses: computed(() => {
      const now = new Date();
      return state.expenses().filter((e: Expense) => !e.endDate || new Date(e.endDate) >= now);
    }),

    // Get monthly expenses
    monthlyExpenses: computed(() => state.expenses().filter((e: Expense) => e.recurrence === "monthly")),

    // Get yearly expenses
    yearlyExpenses: computed(() => state.expenses().filter((e: Expense) => e.recurrence === "yearly")),

    // Get total expenses count
    expenseCount: computed(() => state.expenses().length),

    // Get filtered expenses count
    filteredExpenseCount: computed(() => filteredExpenses().length),
  };
});

// Feature: methods for expense operations
const withExpenseMethods = withMethods((store, expenseService = inject(ExpenseService)) => ({
  /**
   * Set filter criteria
   */
  setFilterCriteria(criteria: ExpenseFilterCriteria): void {
    patchState(store, { filterCriteria: criteria });
  },

  /**
   * Clear filter criteria
   */
  clearFilterCriteria(): void {
    patchState(store, {
      filterCriteria: {
        category: null,
        startDate: null,
        endDate: null,
        recurrenceType: null,
      },
    });
  },

  /**
   * Load all expenses
   */
  loadExpenses: rxMethod<void>(
    pipe(
      tap(() => patchState(store, { loading: true, error: null })),
      switchMap(() =>
        expenseService.getExpenses().pipe(
          tapResponse({
            next: expenses =>
              patchState(store, {
                expenses,
                loading: false,
                loaded: true,
                error: null,
              }),
            error: error =>
              patchState(store, {
                loading: false,
                error: getErrorMessage(error),
              }),
          }),
        ),
      ),
    ),
  ),

  /**
   * Create a new expense
   */
  createExpense: rxMethod<Expense>(
    pipe(
      tap(() => patchState(store, { loading: true, error: null })),
      switchMap(expense =>
        expenseService.createExpense(expense).pipe(
          tapResponse({
            next: newExpense => {
              patchState(store, (state: ExpenseState) => ({
                expenses: [...state.expenses, newExpense],
                loading: false,
                error: null,
              }));
            },
            error: error =>
              patchState(store, {
                loading: false,
                error: getErrorMessage(error),
              }),
          }),
        ),
      ),
    ),
  ),

  /**
   * Update an existing expense
   */
  updateExpense: rxMethod<Expense>(
    pipe(
      tap(() => patchState(store, { loading: true, error: null })),
      switchMap(expense =>
        expenseService.updateExpense(expense).pipe(
          tapResponse({
            next: updatedExpense => {
              patchState(store, (state: ExpenseState) => ({
                expenses: state.expenses.map((e: Expense) => (e.uuid === updatedExpense.uuid ? updatedExpense : e)),
                loading: false,
                error: null,
              }));
            },
            error: error =>
              patchState(store, {
                loading: false,
                error: getErrorMessage(error),
              }),
          }),
        ),
      ),
    ),
  ),

  /**
   * Delete an expense
   */
  deleteExpense: rxMethod<string>(
    pipe(
      tap(() => patchState(store, { loading: true, error: null })),
      switchMap(id =>
        expenseService.deleteExpense(id).pipe(
          tapResponse({
            next: () => {
              patchState(store, (state: ExpenseState) => {
                const selectedId = state.selectedExpenseId === id ? null : state.selectedExpenseId;
                return {
                  expenses: state.expenses.filter((e: Expense) => e.uuid !== id),
                  loading: false,
                  error: null,
                  selectedExpenseId: selectedId,
                };
              });
            },
            error: error =>
              patchState(store, {
                loading: false,
                error: getErrorMessage(error),
              }),
          }),
        ),
      ),
    ),
  ),

  /**
   * Select an expense
   */
  selectExpense(id: string | null): void {
    patchState(store, { selectedExpenseId: id, selectedPaymentId: null });
  },

  /**
   * Select a payment
   */
  selectPayment(id: string | null): void {
    patchState(store, { selectedPaymentId: id });
  },

  /**
   * Get expenses by category
   */
  getExpensesByCategory(category: string): Expense[] {
    // Access with proper type casting to fix the index signature issue
    const expenses = (store as unknown as ExpenseState).expenses;
    return expenses.filter((e: Expense) => e.category === category);
  },

  /**
   * Clear any error state
   */
  clearError(): void {
    patchState(store, { error: null });
  },
}));

// Feature: lifecycle hooks
const withExpenseHooks = withHooks({
  onInit: store => {
    // Need to use explicit type cast to access the method
    const typedStore = store as unknown as { loadExpenses: () => void };
    typedStore.loadExpenses();
  },
});

/**
 * Signal store for managing expenses
 */
export const ExpenseStore = signalStore({ providedIn: "root" }, withExpenseState, withExpenseComputed, withExpenseMethods, withExpenseHooks);
