import { Routes } from "@angular/router";

import { LayoutComponent } from "./modules/layout/layout.component";

export const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        loadChildren: () => import("./modules/dashboards/dashboards.routes").then(m => m.dashboardsRoutes),
      },
      {
        path: "expenses",
        loadChildren: () => import("./modules/expenses/expenses.routes").then(m => m.expensesRoutes),
      },
    ],
  },
];
