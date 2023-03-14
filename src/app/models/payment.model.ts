export type Payment = {
  paymentId: string;
  expenseId: string;
  date: string;
  value: number;
};

export type PaymentRequest = Omit<Payment, "paymentId">;
