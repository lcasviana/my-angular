import { Injectable } from "@angular/core";

import { paymentsMock } from "my-angular/mocks";
import { Payment, PaymentRequest } from "my-angular/models";

@Injectable({
  providedIn: "root",
})
export class PaymentsService {
  private readonly paymentsStorageKey: string = "payments";

  public getPayments(): Payment[] {
    const payments = this.getPaymentsStorage();
    return payments;
  }

  public getPayment(paymentId: string): Payment | undefined {
    const payments = this.getPaymentsStorage();
    const payment = payments.find((payment) => payment.paymentId === paymentId);
    return payment;
  }

  public createPayment(paymentRequest: PaymentRequest): Payment {
    const payments = this.getPaymentsStorage();
    const payment: Payment = { ...paymentRequest, paymentId: crypto.randomUUID() };
    this.setPaymentsStorage([...payments, payment]);
    return payment;
  }

  public updatePayment(paymentId: string, paymentRequest: PaymentRequest): Payment {
    const payments = this.getPaymentsStorage();
    const paymentIndex = payments.findIndex((payment) => payment.paymentId === paymentId);
    if (paymentIndex === -1) throw new Error("Payment not found.");

    const payment: Payment = { ...paymentRequest, paymentId };
    payments[paymentIndex] = payment;
    this.setPaymentsStorage(payments);
    return payment;
  }

  public deletePayment(paymentId: string): string {
    const payments = this.getPaymentsStorage();
    const paymentIndex = payments.findIndex((payment) => payment.paymentId === paymentId);
    if (paymentIndex === -1) throw new Error("Payment not found.");

    payments.splice(paymentIndex, 1);
    this.setPaymentsStorage(payments);
    return paymentId;
  }

  // Storage

  private getPaymentsStorage(): Payment[] {
    const paymentsStringified: string | null = localStorage.getItem(this.paymentsStorageKey);
    if (!paymentsStringified) return paymentsMock;

    try {
      const payments: Payment[] = JSON.parse(paymentsStringified);
      return payments;
    } catch (error) {
      console.error(error);
      throw new Error("Internal server error.");
    }
  }

  private setPaymentsStorage(payments: Payment[]): void {
    const paymentsStringified: string = JSON.stringify(payments);

    try {
      localStorage.setItem(this.paymentsStorageKey, paymentsStringified);
    } catch (error) {
      console.error(error);
      throw new Error("Internal server error.");
    }
  }
}
