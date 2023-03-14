export type ExpenseRecurrenceType = "monthly" | "yearly";

export type Expense = {
  expenseId: string;
  title: string;
  recurrence: ExpenseRecurrenceType;
  startDate: string;
  endDate?: Date | null;
};

export type ExpenseRequest = Omit<Expense, "expenseId">;
