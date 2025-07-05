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
        const _endDate = new Date(endDate);
        if (_endDate.getFullYear() < now.getFullYear()) return false;
        if (_endDate.getMonth() < now.getMonth()) return false;
        if (_endDate.getDate() < now.getDate()) return false;
        return true;
      });
      return expensesActive;
    }),

    expense: computed<Expense | undefined>(() => {
      const expenseId = store.expenseId();
      if (!expenseId) return undefined;
      const expense = store.expenses().find((e) => e.expenseId === expenseId);
      return expense;
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

    createExpense(expenseRequest: ExpenseRequest): Expense | undefined {
      patchState(store, { loading: true, error: null });
      try {
        const expense = expenseService.createExpense(expenseRequest);
        patchState(store, { expenses: [...store.expenses(), expense], loading: false, error: null });
        return expense;
      } catch (error) {
        patchState(store, { loading: false, error });
        return undefined;
      }
    },

    updateExpense(expenseId: string, expenseRequest: ExpenseRequest): Expense | undefined {
      patchState(store, { loading: true, error: null });
      try {
        const expense = expenseService.updateExpense(expenseId, expenseRequest);
        patchState(store, { expenses: [...store.expenses(), expense], loading: false, error: null });
        return expense;
      } catch (error) {
        patchState(store, { loading: false, error });
        return undefined;
      }
    },

    deleteExpense(expenseId: string): string | undefined {
      patchState(store, { loading: true, error: null });
      try {
        expenseService.deleteExpense(expenseId);
        patchState(store, {
          expenses: store.expenses().filter((e) => e.expenseId !== expenseId),
          expenseId: store.expenseId() === expenseId ? null : store.expenseId(),
          loading: false,
          error: null,
        });
        return expenseId;
      } catch (error) {
        patchState(store, { loading: false, error });
        return undefined;
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
