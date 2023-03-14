import { Routes } from "@angular/router";

export const appRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./components/layout.component").then((m) => m.Layout),
    children: [
      {
        path: "expenses",
        loadChildren: () => import("./modules/expenses/expenses.routes").then((m) => m.expensesRoutes),
      },
      {
        path: "payments",
        loadChildren: () => import("./modules/payments/payments.routes").then((m) => m.paymentsRoutes),
      },
    ],
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "expenses",
  },
  {
    path: "**",
    redirectTo: "",
  },
];
