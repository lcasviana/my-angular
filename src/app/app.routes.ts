import { Routes } from "@angular/router";

import { DashboardComponent } from "./modules/dashboard.component";
import { ExpenseCreateComponent } from "./modules/expense-create.component";
import { ExpenseDetailComponent } from "./modules/expense-detail.component";
import { ExpenseListComponent } from "./modules/expense-list.component";
import { ExpenseUpdateComponent } from "./modules/expense-update.component";
import { LayoutComponent } from "./modules/layout/layout.component";
import { PaymentCreateComponent } from "./modules/payment-create.component";
import { PaymentUpdateComponent } from "./modules/payment-update.component";

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
        component: DashboardComponent,
      },
      {
        path: "expenses",
        children: [
          {
            path: "",
            component: ExpenseListComponent,
          },
          {
            path: "new",
            component: ExpenseCreateComponent,
          },
          {
            path: ":id",
            component: ExpenseDetailComponent,
          },
          {
            path: ":id/edit",
            component: ExpenseUpdateComponent,
          },
          {
            path: ":expenseId/payments/new",
            component: PaymentCreateComponent,
          },
          {
            path: ":expenseId/payments/:paymentId/edit",
            component: PaymentUpdateComponent,
          },
        ],
      },
    ],
  },
];
