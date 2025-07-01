import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";

import { Expense, ExpensePayment, ExpenseRequest } from "../models";
import { ExpensesService } from "../services";

export const ExpenseStore = signalStore(
  { providedIn: "root" },

  withState<{
    expenses: Expense[];
    payments: ExpensePayment[];
    expenseId: string | null;
    paymentId: string | null;
    loading: boolean;
    error: unknown | null;
  }>({
    expenses: [],
    payments: [],
    expenseId: null,
    paymentId: null,
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

    payment: computed<ExpensePayment | null>(() => {
      const expenseId = store.expenseId();
      const paymentId = store.paymentId();
      if (!expenseId || !paymentId) return null;
      const payment = store.payments().find((p) => p.paymentId === paymentId && p.expenseId === expenseId);
      return payment || null;
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

    selectExpense(expenseId: string): void {
      patchState(store, { expenseId });
    },

    createExpense(expenseRequest: ExpenseRequest): void {
      patchState(store, { loading: true, error: null });
      try {
        const expense = expenseService.createExpense(expenseRequest);
        patchState(store, (state) => ({ ...state, expenses: [...state.expenses, expense], loading: false, error: null }));
      } catch (error) {
        patchState(store, { loading: false, error });
      }
    },

    updateExpense(expenseId: string, expenseRequest: ExpenseRequest): void {
      patchState(store, { loading: true, error: null });
      try {
        const expense = expenseService.updateExpense(expenseId, expenseRequest);
        patchState(store, (state) => ({
          ...state,
          expenses: state.expenses.map((e) => (e.expenseId === expenseId ? expense : e)),
          loading: false,
          error: null,
        }));
      } catch (error) {
        patchState(store, { loading: false, error });
      }
    },

    deleteExpense(expenseId: string): void {
      patchState(store, { loading: true, error: null });
      try {
        expenseService.deleteExpense(expenseId);
        patchState(store, (state) => ({
          ...state,
          expenses: state.expenses.filter((e) => e.expenseId !== expenseId),
          expenseId: state.expenseId === expenseId ? null : state.expenseId,
          loading: false,
          error: null,
        }));
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
