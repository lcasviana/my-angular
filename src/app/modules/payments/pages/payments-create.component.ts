import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from "@angular/core";
import { Router } from "@angular/router";

import { Payment, PaymentRequest } from "my-angular/models";
import { PaymentsStore } from "my-angular/stores";

import { PaymentsForm } from "../components/payments-form.component";

@Component({
  selector: "my-payments-create",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [PaymentsForm],
  template: `<my-payments-form header="Create Payment" (formSubmit)="createPayment($event)" />`,
})
export class PaymentsCreate {
  private readonly router = inject(Router);

  private readonly paymentsStore = inject(PaymentsStore);

  protected createPayment(paymentRequest: PaymentRequest): void {
    const payment: Payment | undefined = this.paymentsStore.createPayment(paymentRequest);
    if (payment) this.router.navigate(["/payments", payment.paymentId]);
  }
}
