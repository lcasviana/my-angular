import { CurrencyPipe, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";

import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";

import { PaymentsStore } from "my-angular/stores";

@Component({
  selector: "my-payments",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ButtonModule, CardModule, CurrencyPipe, DatePipe, RouterLink, TableModule],
  template: `
    <p-card header="Payments">
      <p-table [value]="paymentsStore.payments()">
        <ng-template pTemplate="header">
          <tr>
            <th>Expense</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-payment>
          <tr>
            <td>{{ payment.expenseId }}</td>
            <td>{{ payment.date | date: "MM/dd/yyyy" }}</td>
            <td>{{ payment.value | currency }}</td>
            <td>
              <a [routerLink]="['/payments', payment.paymentId]">View</a>
              <a [routerLink]="['/payments', payment.paymentId, 'update']">Update</a>
              <button pButton type="button" (click)="deletePayment(payment.paymentId)">Delete</button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
})
export class Payments {
  private readonly router = inject(Router);

  protected readonly paymentsStore = inject(PaymentsStore);

  protected createPayment(): void {
    this.router.navigate(["/payments", "create"]);
  }

  protected deletePayment(paymentId: string): void {
    if (confirm("Are you sure you want to delete this payment?")) {
      this.paymentsStore.deletePayment(paymentId);
    }
  }
}
