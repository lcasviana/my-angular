export type Payment = {
  paymentId: string;
  expenseId: string;
  date: Date;
  value: number;
};

export type PaymentRequest = Omit<Payment, "paymentId">;
