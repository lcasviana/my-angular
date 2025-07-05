import { Routes } from "@angular/router";

export const expensesRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./expenses.component").then((m) => m.ExpenseListComponent),
  },
  {
    path: "create",
    loadComponent: () => import("./pages/expenses-create.component").then((m) => m.ExpenseCreateComponent),
  },
  {
    path: ":expenseId",
    loadComponent: () => import("./pages/expenses-detail.component").then((m) => m.ExpenseDetailComponent),
  },
  {
    path: ":expenseId/update",
    loadComponent: () => import("./pages/expenses-update.component").then((m) => m.ExpenseUpdateComponent),
  },
];
