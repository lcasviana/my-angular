import { Routes } from "@angular/router";

export const paymentsRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./payments.component").then((m) => m.Payments),
  },
  {
    path: "create",
    loadComponent: () => import("./pages/payments-create.component").then((m) => m.PaymentsCreate),
  },
  {
    path: ":paymentId",
    loadComponent: () => import("./pages/payments-detail.component").then((m) => m.PaymentsDetail),
  },
  {
    path: ":paymentId/update",
    loadComponent: () => import("./pages/payments-update.component").then((m) => m.PaymentsUpdate),
  },
];
