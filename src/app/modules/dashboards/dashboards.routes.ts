import { Routes } from "@angular/router";

export const dashboardsRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./dashboards.component").then((m) => m.DashboardComponent),
  },
];
