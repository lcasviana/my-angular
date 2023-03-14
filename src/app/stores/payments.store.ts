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
    paymentsByExpense: computed<Payment[] | null>(() => {
      const expenseId = store.expenseId();
      if (!expenseId) return null;
      const expensePayments = store.payments().filter((p) => p.expenseId === expenseId);
      return expensePayments || null;
    }),

    payment: computed<Payment | null>(() => {
      const paymentId = store.paymentId();
      if (!paymentId) return null;
      const payment = store.payments().find((p) => p.paymentId === paymentId);
      return payment || null;
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

    selectPayment(paymentId: string | null): void {
      patchState(store, { paymentId });
    },

    createPayment(paymentRequest: PaymentRequest): Payment | undefined {
      patchState(store, { loading: true, error: null });
      try {
        const payment = paymentsService.createPayment(paymentRequest);
        patchState(store, { payments: [...store.payments(), payment], loading: false, error: null });
        return payment;
      } catch (error) {
        patchState(store, { loading: false, error });
        return undefined;
      }
    },

    updatePayment(paymentId: string, paymentRequest: PaymentRequest): Payment | undefined {
      patchState(store, { loading: true, error: null });
      try {
        const payment = paymentsService.updatePayment(paymentId, paymentRequest);
        patchState(store, {
          payments: store.payments().map((p) => (p.paymentId === paymentId ? payment : p)),
          loading: false,
          error: null,
        });
        return payment;
      } catch (error) {
        patchState(store, { loading: false, error });
        return undefined;
      }
    },

    deletePayment(paymentId: string): string | undefined {
      patchState(store, { loading: true, error: null });
      try {
        paymentsService.deletePayment(paymentId);
        patchState(store, {
          payments: store.payments().filter((p) => p.paymentId !== paymentId),
          paymentId: store.paymentId() === paymentId ? null : store.paymentId(),
          loading: false,
          error: null,
        });
        return paymentId;
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
    onInit: (store) => store.getPayments(),
  }),
);
