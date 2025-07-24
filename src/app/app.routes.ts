import { Routes } from "@angular/router";

export const appRoutes: Routes = [
  {
    path: "",
    redirectTo: "dashboards",
    pathMatch: "full",
  },
  {
    path: "dashboards",
    loadChildren: () => import("./modules/dashboards/dashboards.routes").then((m) => m.dashboardsRoutes),
  },
  {
    path: "expenses",
    loadChildren: () => import("./modules/expenses/expenses.routes").then((m) => m.expensesRoutes),
  },
  {
    path: "payments",
    loadChildren: () => import("./modules/payments/payments.routes").then((m) => m.paymentsRoutes),
  },
];
