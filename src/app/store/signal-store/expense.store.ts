import { computed, inject } from "@angular/core";
import { tapResponse } from "@ngrx/operators";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { Expense } from "../../models";
import { ExpenseService } from "../../services/expense.service";

/**
 * Interface representing the expense state
 */
export interface ExpenseState {
  expenses: Expense[];
  selectedExpenseId: string | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

/**
 * Initial state for expenses
 */
export const initialExpenseState: ExpenseState = {
  expenses: [],
  selectedExpenseId: null,
  loading: false,
  loaded: false,
  error: null,
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

/**
 * Signal store for managing expenses
 */
export const ExpenseStore = signalStore(
  { providedIn: "root" },
  withState(initialExpenseState),
  withComputed(state => ({
    // Get all expenses
    allExpenses: computed(() => state.expenses()),

    // Get selected expense
    selectedExpense: computed(() => {
      const selectedId = state.selectedExpenseId();
      return selectedId ? state.expenses().find(e => e.uuid === selectedId) : null;
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
      return state.expenses().filter(e => !e.endDate || new Date(e.endDate) >= now);
    }),

    // Get monthly expenses
    monthlyExpenses: computed(() => state.expenses().filter(e => e.recurrence === "monthly")),

    // Get yearly expenses
    yearlyExpenses: computed(() => state.expenses().filter(e => e.recurrence === "yearly")),

    // Get total expenses count
    expenseCount: computed(() => state.expenses().length),
  })),
  withMethods((store, expenseService = inject(ExpenseService)) => ({
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
                const currentExpenses = store.expenses();
                patchState(store, {
                  expenses: [...currentExpenses, newExpense],
                  loading: false,
                  error: null,
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
     * Update an existing expense
     */
    updateExpense: rxMethod<Expense>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(expense =>
          expenseService.updateExpense(expense).pipe(
            tapResponse({
              next: updatedExpense => {
                const currentExpenses = store.expenses();
                const updatedExpenses = currentExpenses.map(e => (e.uuid === updatedExpense.uuid ? updatedExpense : e));
                patchState(store, {
                  expenses: updatedExpenses,
                  loading: false,
                  error: null,
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
     * Delete an expense
     */
    deleteExpense: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(id =>
          expenseService.deleteExpense(id).pipe(
            tapResponse({
              next: () => {
                const currentExpenses = store.expenses();
                const filteredExpenses = currentExpenses.filter(e => e.uuid !== id);
                patchState(store, {
                  expenses: filteredExpenses,
                  loading: false,
                  error: null,
                  // If we're deleting the currently selected expense, clear the selection
                  selectedExpenseId: store.selectedExpenseId() === id ? null : store.selectedExpenseId(),
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
      patchState(store, { selectedExpenseId: id });
    },

    /**
     * Get expenses by category
     */
    getExpensesByCategory(category: string): Expense[] {
      return store.expenses().filter(e => e.category === category);
    },

    /**
     * Clear any error state
     */
    clearError(): void {
      patchState(store, { error: null });
    },
  })),
);
