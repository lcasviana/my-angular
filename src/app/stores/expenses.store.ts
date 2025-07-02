import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";

import { Expense, ExpenseRequest } from "../models";
import { ExpensesService } from "../services";

export const ExpenseStore = signalStore(
  { providedIn: "root" },

  withState<{
    expenses: Expense[];
    expenseId: string | null;
    loading: boolean;
    error: unknown | null;
  }>({
    expenses: [],
    expenseId: null,
    loading: true,
    error: null,
  }),

  withComputed((store) => ({
    expensesActive: computed<Expense[]>(() => {
      const expenses = store.expenses();
      const now = new Date();
      const expensesActive = expenses.filter(({ endDate }) => {
        if (!endDate) return true;
        if (endDate.getFullYear() < now.getFullYear()) return false;
        if (endDate.getMonth() < now.getMonth()) return false;
        if (endDate.getDate() < now.getDate()) return false;
        return true;
      });
      return expensesActive;
    }),

    expense: computed<Expense | null>(() => {
      const expenseId = store.expenseId();
      if (!expenseId) return null;
      const expense = store.expenses().find((e) => e.expenseId === expenseId);
      return expense || null;
    }),
  })),

  withMethods((store, expenseService = inject(ExpensesService)) => ({
    getExpenses(): void {
      patchState(store, { loading: true, error: null });
      try {
        const expenses = expenseService.getExpenses();
        patchState(store, { expenses, loading: false, error: null });
      } catch (error) {
        patchState(store, { loading: false, error });
      }
    },

    selectExpense(expenseId: string | null): void {
      patchState(store, { expenseId });
    },

    createExpense(expenseRequest: ExpenseRequest): void {
      patchState(store, { loading: true, error: null });
      try {
        const expense = expenseService.createExpense(expenseRequest);
        patchState(store, { expenses: [...store.expenses(), expense], loading: false, error: null });
      } catch (error) {
        patchState(store, { loading: false, error });
      }
    },

    updateExpense(expenseId: string, expenseRequest: ExpenseRequest): void {
      patchState(store, { loading: true, error: null });
      try {
        const expense = expenseService.updateExpense(expenseId, expenseRequest);
        patchState(store, { expenses: [...store.expenses(), expense], loading: false, error: null });
      } catch (error) {
        patchState(store, { loading: false, error });
      }
    },

    deleteExpense(expenseId: string): void {
      patchState(store, { loading: true, error: null });
      try {
        expenseService.deleteExpense(expenseId);
        patchState(store, {
          expenses: store.expenses().filter((e) => e.expenseId !== expenseId),
          expenseId: store.expenseId() === expenseId ? null : store.expenseId(),
          loading: false,
          error: null,
        });
      } catch (error) {
        patchState(store, { loading: false, error });
      }
    },

    clearError(): void {
      patchState(store, { error: null });
    },
  })),

  withHooks({
    onInit: (store) => store.getExpenses(),
  }),
);
