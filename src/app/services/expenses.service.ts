import { inject, Injectable } from "@angular/core";
import { from, Observable, of, throwError } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { Expense } from "../models";
import { Uuid } from "../utils";
import { DatabaseService } from "./database.service";

@Injectable({
  providedIn: "root",
})
export class ExpenseService {
  private readonly STORE_NAME = "expenses";

  private readonly dbService = inject(DatabaseService);

  /**
   * Get all expenses from storage
   */
  getExpenses(): Observable<Expense[]> {
    return of(null).pipe(
      switchMap(() => from(this.dbService.getChangesByType(this.STORE_NAME))),
      map(changes => changes.map(change => change.data as Expense)),
    );
  }

  /**
   * Add a new expense
   */
  createExpense(expense: Expense): Observable<Expense> {
    // Ensure we always have a UUID
    const newExpense: Expense = {
      ...expense,
      uuid: expense.uuid || Uuid.generate().uuid,
    };

    return of(null).pipe(
      switchMap(() =>
        from(
          this.dbService.addChange({
            type: this.STORE_NAME,
            data: newExpense,
          }),
        ),
      ),
      map(() => newExpense),
    );
  }

  /**
   * Update an existing expense
   */
  updateExpense(expense: Expense): Observable<Expense> {
    return this.getExpenses().pipe(
      switchMap(expenses => {
        const index = expenses.findIndex(e => e.uuid === expense.uuid);
        if (index === -1) {
          return throwError(() => "Expense not found");
        }

        return from(
          this.dbService.addChange({
            type: this.STORE_NAME,
            data: expense,
          }),
        ).pipe(map(() => expense));
      }),
    );
  }

  /**
   * Delete an expense
   */
  deleteExpense(id: string): Observable<string> {
    return this.getExpenses().pipe(
      switchMap(expenses => {
        const expense = expenses.find(e => e.uuid === id);
        if (!expense) {
          return throwError(() => "Expense not found");
        }

        return from(
          this.dbService.addChange({
            type: this.STORE_NAME,
            data: { ...expense, deleted: true },
          }),
        ).pipe(map(() => id));
      }),
    );
  }
}
