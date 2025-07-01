import { Injectable } from "@angular/core";

import { ExpensePayment, ExpensePaymentRequest } from "../models";

@Injectable({
  providedIn: "root",
})
export class ExpensesPaymentsService {
  private readonly expensesPaymentsStorageKey: string = "expenses-payments";

  public getExpensesPayments(): ExpensePayment[] {
    const expensesPayments = this.getExpensesPaymentsStorage();
    return expensesPayments;
  }

  public getExpensePayment(expenseId: string, paymentId: string): ExpensePayment | undefined {
    const expensesPayments = this.getExpensesPaymentsStorage();
    const expensePayment = expensesPayments.find(
      (expensePayment) => expensePayment.expenseId === expenseId && expensePayment.paymentId === paymentId,
    );
    return expensePayment;
  }

  public createExpensePayment(expenseId: string, expensePaymentRequest: ExpensePaymentRequest): ExpensePayment {
    const expensesPayments = this.getExpensesPaymentsStorage();
    const expensePayment: ExpensePayment = { ...expensePaymentRequest, expenseId, paymentId: crypto.randomUUID() };
    this.setExpensesPaymentsStorage([...expensesPayments, expensePayment]);
    return expensePayment;
  }

  public updateExpensePayment(expenseId: string, paymentId: string, expensePaymentRequest: ExpensePaymentRequest): ExpensePayment {
    const expensesPayments = this.getExpensesPaymentsStorage();
    const expensePaymentIndex = expensesPayments.findIndex(
      (expensePayment) => expensePayment.expenseId === expenseId && expensePayment.paymentId === paymentId,
    );
    if (expensePaymentIndex === -1) throw new Error("Expense Payment not found.");

    const expensePayment: ExpensePayment = { ...expensePaymentRequest, expenseId, paymentId };
    expensesPayments[expensePaymentIndex] = expensePayment;
    this.setExpensesPaymentsStorage(expensesPayments);
    return expensePayment;
  }

  public deleteExpensePayment(expenseId: string, paymentId: string): string {
    const expensesPayments = this.getExpensesPaymentsStorage();
    const expensePaymentIndex = expensesPayments.findIndex(
      (expensePayment) => expensePayment.expenseId === expenseId && expensePayment.paymentId === paymentId,
    );
    if (expensePaymentIndex === -1) throw new Error("Expense Payment not found.");

    expensesPayments.splice(expensePaymentIndex, 1);
    this.setExpensesPaymentsStorage(expensesPayments);
    return paymentId;
  }

  // Storage

  private getExpensesPaymentsStorage(): ExpensePayment[] {
    const expensesPaymentsStringified: string | null = localStorage.getItem(this.expensesPaymentsStorageKey);
    if (!expensesPaymentsStringified) return [];

    try {
      const expensesPayments: ExpensePayment[] = JSON.parse(expensesPaymentsStringified);
      return expensesPayments;
    } catch (error) {
      console.error(error);
      throw new Error("Internal server error.");
    }
  }

  private setExpensesPaymentsStorage(expensesPayments: ExpensePayment[]): void {
    const expensesPaymentsStringified: string = JSON.stringify(expensesPayments);

    try {
      localStorage.setItem(this.expensesPaymentsStorageKey, expensesPaymentsStringified);
    } catch (error) {
      console.error(error);
      throw new Error("Internal server error.");
    }
  }
}
