import { Routes } from "@angular/router";

export const paymentsRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./payments.component").then((m) => m.PaymentsComponent),
  },
  {
    path: "create",
    loadComponent: () => import("./pages/payments-create.component").then((m) => m.PaymentCreateComponent),
  },
  {
    path: ":paymentId",
    loadComponent: () => import("./pages/payments-detail.component").then((m) => m.PaymentDetailComponent),
  },
  {
    path: ":paymentId/update",
    loadComponent: () => import("./pages/payments-update.component").then((m) => m.PaymentUpdateComponent),
  },
];
