import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";

import { Payment, PaymentRequest } from "../models";
import { PaymentsService } from "../services";

export const PaymentsStore = signalStore(
  { providedIn: "root" },

  withState<{
    payments: Payment[];
    expenseId: string | null;
    paymentId: string | null;
    loading: boolean;
    error: unknown | null;
  }>({
    payments: [],
    expenseId: null,
    paymentId: null,
    loading: true,
    error: null,
  }),

  withComputed((store) => ({
    expensePayments: computed<Payment[] | null>(() => {
      const expenseId = store.expenseId();
      if (!expenseId) return null;
      const expensePayments = store.payments().filter((p) => p.expenseId === expenseId);
      return expensePayments || null;
    }),

    expensePayment: computed<Payment | null>(() => {
      const expenseId = store.expenseId();
      const paymentId = store.paymentId();
      if (!expenseId || !paymentId) return null;
      const expensePayment = store.payments().find((p) => p.expenseId === expenseId && p.paymentId === paymentId);
      return expensePayment || null;
    }),
  })),

  withMethods((store, paymentsService = inject(PaymentsService)) => ({
    getPayments(): void {
      patchState(store, { loading: true, error: null });
      try {
        const payments = paymentsService.getPayments();
        patchState(store, { payments, loading: false, error: null });
      } catch (error) {
        patchState(store, { loading: false, error });
      }
    },

    selectExpense(expenseId: string | null): void {
      patchState(store, { expenseId });
    },

    selectExpensePayment(paymentId: string | null): void {
      patchState(store, { paymentId });
    },

    createPayment(paymentRequest: PaymentRequest): void {
      patchState(store, { loading: true, error: null });
      try {
        const payment = paymentsService.createPayment(paymentRequest);
        patchState(store, { payments: [...store.payments(), payment], loading: false, error: null });
      } catch (error) {
        patchState(store, { loading: false, error });
      }
    },

    updatePayment(paymentId: string, paymentRequest: PaymentRequest): void {
      patchState(store, { loading: true, error: null });
      try {
        const payment = paymentsService.updatePayment(paymentId, paymentRequest);
        patchState(store, { payments: [...store.payments(), payment], loading: false, error: null });
      } catch (error) {
        patchState(store, { loading: false, error });
      }
    },

    deletePayment(paymentId: string): void {
      patchState(store, { loading: true, error: null });
      try {
        paymentsService.deletePayment(paymentId);
        patchState(store, {
          payments: store.payments().filter((p) => p.paymentId !== paymentId),
          paymentId: store.paymentId() === paymentId ? null : store.paymentId(),
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
    onInit: (store) => store.getPayments(),
  }),
);
