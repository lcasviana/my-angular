export type ExpensePayment = {
  paymentId: string;
  expenseId: string;
  date: Date;
  value: number;
};

export type ExpensePaymentRequest = Omit<ExpensePayment, "paymentId" | "expenseId">;
