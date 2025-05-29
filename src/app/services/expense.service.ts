import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { delay } from "rxjs/operators";

import { Expense } from "../models";
import { Uuid } from "../utils";

@Injectable({
  providedIn: "root",
})
export class ExpenseService {
  // For now, we'll use a local storage mock
  private readonly STORAGE_KEY = "financial-tracker-expenses";

  /**
   * Get all expenses from storage
   */
  getExpenses(): Observable<Expense[]> {
    try {
      const expenses = localStorage.getItem(this.STORAGE_KEY);
      return of(expenses ? JSON.parse(expenses) : []).pipe(delay(300));
    } catch {
      return throwError(() => "Failed to load expenses");
    }
  }

  /**
   * Add a new expense
   */
  createExpense(expense: Expense): Observable<Expense> {
    try {
      // Ensure we always have a UUID
      const newExpense: Expense = {
        ...expense,
        uuid: expense.uuid || Uuid.generate().uuid,
      };

      const expenses = this.getExpensesFromStorage();
      expenses.push(newExpense);
      this.saveExpensesToStorage(expenses);

      return of(newExpense).pipe(delay(300));
    } catch {
      return throwError(() => "Failed to create expense");
    }
  }

  /**
   * Update an existing expense
   */
  updateExpense(expense: Expense): Observable<Expense> {
    try {
      const expenses = this.getExpensesFromStorage();
      const index = expenses.findIndex(e => e.uuid === expense.uuid);

      if (index === -1) {
        return throwError(() => "Expense not found");
      }

      expenses[index] = expense;
      this.saveExpensesToStorage(expenses);

      return of(expense).pipe(delay(300));
    } catch {
      return throwError(() => "Failed to update expense");
    }
  }

  /**
   * Delete an expense
   */
  deleteExpense(id: string): Observable<string> {
    try {
      const expenses = this.getExpensesFromStorage();
      const filteredExpenses = expenses.filter(e => e.uuid !== id);

      if (filteredExpenses.length === expenses.length) {
        return throwError(() => "Expense not found");
      }

      this.saveExpensesToStorage(filteredExpenses);

      return of(id).pipe(delay(300));
    } catch {
      return throwError(() => "Failed to delete expense");
    }
  }

  /**
   * Helper method to get expenses from local storage
   */
  private getExpensesFromStorage(): Expense[] {
    try {
      const expenses = localStorage.getItem(this.STORAGE_KEY);
      return expenses ? JSON.parse(expenses) : [];
    } catch {
      // If there's an error parsing, return an empty array
      console.warn("Error parsing expenses from storage, returning empty array");
      return [];
    }
  }

  /**
   * Helper method to save expenses to local storage
   */
  private saveExpensesToStorage(expenses: Expense[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(expenses));
  }
}
