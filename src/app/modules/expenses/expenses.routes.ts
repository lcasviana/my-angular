import { Routes } from "@angular/router";

export const expensesRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./expenses.component").then((m) => m.Expenses),
  },
  {
    path: "create",
    loadComponent: () => import("./pages/expenses-create.component").then((m) => m.ExpensesCreate),
  },
  {
    path: ":expenseId",
    loadComponent: () => import("./pages/expenses-detail.component").then((m) => m.ExpensesDetail),
  },
  {
    path: ":expenseId/update",
    loadComponent: () => import("./pages/expenses-update.component").then((m) => m.ExpensesUpdate),
  },
];
