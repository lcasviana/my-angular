import { Routes } from "@angular/router";

export const expensesRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./expense-list.component").then(m => m.ExpenseListComponent),
  },
  {
    path: "new",
    loadComponent: () => import("./expense-create.component").then(m => m.ExpenseCreateComponent),
  },
  {
    path: ":id",
    loadComponent: () => import("./expense-detail.component").then(m => m.ExpenseDetailComponent),
  },
  {
    path: ":id/edit",
    loadComponent: () => import("./expense-update.component").then(m => m.ExpenseUpdateComponent),
  },
  {
    path: ":expenseId/payments/new",
    loadComponent: () => import("./payment-create.component").then(m => m.PaymentCreateComponent),
  },
  {
    path: ":expenseId/payments/:paymentId/edit",
    loadComponent: () => import("./payment-update.component").then(m => m.PaymentUpdateComponent),
  },
];
