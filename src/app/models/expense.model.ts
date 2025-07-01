export type ExpenseRecurrenceType = "monthly" | "yearly";

export type Expense = {
  expenseId: string;
  title: string;
  recurrence: ExpenseRecurrenceType;
  startDate: Date;
  endDate?: Date | null;
};

export type ExpenseRequest = Omit<Expense, "expenseId">;
