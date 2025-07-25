import { ChangeDetectionStrategy, Component, InputSignal, ViewEncapsulation, computed, effect, inject, input } from "@angular/core";

import { PaymentsStore } from "my-angular/stores";

import { PaymentFormComponent } from "../components/payments-form.component";

@Component({
  selector: "my-payments-detail",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [PaymentFormComponent],
  template: `<my-payments-form header="Payment" [payment]="payment()" [readOnly]="true" />`,
})
export class PaymentDetailComponent {
  private readonly paymentsStore = inject(PaymentsStore);

  readonly paymentId: InputSignal<string> = input.required();

  protected readonly paymentIdEffect = effect(() => {
    this.paymentsStore.selectPayment(this.paymentId());
  });

  protected readonly payment = computed(() => this.paymentsStore.payment());
}
