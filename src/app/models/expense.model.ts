export type ExpenseRecurrenceType = "monthly" | "yearly";

export type ExpensePayment = {
  uuid: string;
  date: Date;
  value: number;
};

export type Expense = {
  uuid: string;
  title: string;
  category: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
  recurrence: ExpenseRecurrenceType;
  paymentMethod?: string | null;
  payments?: ExpensePayment[];
};
