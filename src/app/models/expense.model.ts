import { ExpensePayment } from "./expense-payment.model";

export type ExpenseRecurrenceType = "monthly" | "yearly";

export interface Expense {
  uuid: string;
  title: string;
  category: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
  recurrence: ExpenseRecurrenceType;
  paymentMethod?: string | null;
  payments?: ExpensePayment[];
}
