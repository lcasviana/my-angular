import { Routes } from "@angular/router";

import { Layout } from "./modules/layout/layout.component";

export const appRoutes: Routes = [
  {
    path: "",
    component: Layout,
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
