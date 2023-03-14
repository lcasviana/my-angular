import { Injectable } from "@angular/core";

import { expensesMock } from "my-angular/mocks";
import { Expense, ExpenseRequest } from "my-angular/models";

@Injectable({
  providedIn: "root",
})
export class ExpensesService {
  private readonly expensesStorageKey: string = "expenses";

  public getExpenses(): Expense[] {
    const expenses = this.getExpensesStorage();
    return expenses;
  }

  public getExpense(expenseId: string): Expense | undefined {
    const expenses = this.getExpensesStorage();
    const expense = expenses.find((expense) => expense.expenseId === expenseId);
    return expense;
  }

  public createExpense(expenseRequest: ExpenseRequest): Expense {
    const expenses = this.getExpensesStorage();
    const expense: Expense = { ...expenseRequest, expenseId: crypto.randomUUID() };
    this.setExpensesStorage([...expenses, expense]);
    return expense;
  }

  public updateExpense(expenseId: string, expenseRequest: ExpenseRequest): Expense {
    const expenses = this.getExpensesStorage();
    const expenseIndex = expenses.findIndex((expense) => expense.expenseId === expenseId);
    if (expenseIndex === -1) throw new Error("Expense not found.");

    const expense: Expense = { ...expenseRequest, expenseId };
    expenses[expenseIndex] = expense;
    this.setExpensesStorage(expenses);
    return expense;
  }

  public deleteExpense(expenseId: string): string {
    const expenses = this.getExpensesStorage();
    const expenseIndex = expenses.findIndex((expense) => expense.expenseId === expenseId);
    if (expenseIndex === -1) throw new Error("Expense not found.");

    expenses.splice(expenseIndex, 1);
    this.setExpensesStorage(expenses);
    return expenseId;
  }

  // Storage

  private getExpensesStorage(): Expense[] {
    const expensesStringified: string | null = localStorage.getItem(this.expensesStorageKey);
    if (!expensesStringified) return expensesMock;

    try {
      const expenses: Expense[] = JSON.parse(expensesStringified);
      return expenses;
    } catch (error) {
      console.error(error);
      throw new Error("Internal server error.");
    }
  }

  private setExpensesStorage(expenses: Expense[]): void {
    const expensesStringified: string = JSON.stringify(expenses);

    try {
      localStorage.setItem(this.expensesStorageKey, expensesStringified);
    } catch (error) {
      console.error(error);
      throw new Error("Internal server error.");
    }
  }
}
