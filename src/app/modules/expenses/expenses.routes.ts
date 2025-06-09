import { Routes } from "@angular/router";

export const expensesRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./expenses-list.component").then((m) => m.ExpenseListComponent),
  },
  {
    path: "new",
    loadComponent: () => import("./expenses-create.component").then((m) => m.ExpenseCreateComponent),
  },
  {
    path: ":id",
    loadComponent: () => import("./expenses-detail.component").then((m) => m.ExpenseDetailComponent),
  },
  {
    path: ":id/edit",
    loadComponent: () => import("./expenses-update.component").then((m) => m.ExpenseUpdateComponent),
  },
  {
    path: ":expenseId/payments/new",
    loadComponent: () => import("./payments-create.component").then((m) => m.PaymentCreateComponent),
  },
  {
    path: ":expenseId/payments/:paymentId/edit",
    loadComponent: () => import("./payments-update.component").then((m) => m.PaymentUpdateComponent),
  },
];
