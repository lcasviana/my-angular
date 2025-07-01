import { Routes } from "@angular/router";

export const appRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./components/layout.component").then((m) => m.Layout),
    children: [
      {
        path: "dashboard",
        loadChildren: () => import("./modules/dashboards/dashboards.routes").then((m) => m.dashboardsRoutes),
      },
      {
        path: "expenses",
        loadChildren: () => import("./modules/expenses/expenses.routes").then((m) => m.expensesRoutes),
      },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
    ],
  },
];
