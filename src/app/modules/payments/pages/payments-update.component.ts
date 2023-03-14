import { ChangeDetectionStrategy, Component, EffectRef, InputSignal, ViewEncapsulation, effect, inject, input } from "@angular/core";
import { Router } from "@angular/router";

import { Payment, PaymentRequest } from "my-angular/models";
import { PaymentsStore } from "my-angular/stores";

import { PaymentsForm } from "../components/payments-form.component";

@Component({
  selector: "my-payments-update",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [PaymentsForm],
  template: `<my-payments-form header="Edit Payment" [payment]="paymentsStore.payment()" (formSubmit)="updatePayment($event)" />`,
})
export class PaymentsUpdate {
  private readonly router = inject(Router);

  protected readonly paymentsStore = inject(PaymentsStore);

  readonly paymentId: InputSignal<string> = input.required();

  protected readonly paymentEffect: EffectRef = effect(() => {
    this.paymentsStore.selectPayment(this.paymentId());
  });

  protected updatePayment(paymentRequest: PaymentRequest): void {
    const payment: Payment | undefined = this.paymentsStore.updatePayment(this.paymentId(), paymentRequest);
    if (payment) this.router.navigate(["/payments", payment.paymentId]);
  }
}
