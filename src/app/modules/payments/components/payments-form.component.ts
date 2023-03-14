import {
  ChangeDetectionStrategy,
  Component,
  EffectRef,
  InputSignal,
  OutputEmitterRef,
  ViewEncapsulation,
  effect,
  inject,
  input,
  output,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DatePickerModule } from "primeng/datepicker";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputNumberModule } from "primeng/inputnumber";

import { Payment, PaymentRequest } from "my-angular/models";

@Component({
  selector: "my-payments-form",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ButtonModule, CardModule, DatePickerModule, FloatLabelModule, InputNumberModule, ReactiveFormsModule],
  template: `
    <p-card [header]="header()">
      <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()" class="@container/payments-form grid grid-cols-12 items-start gap-3">
        <p-floatlabel class="col-span-6" variant="in">
          <p-datepicker inputId="date" class="grid" showIcon iconDisplay="input" formControlName="date" />
          <label for="date">Date*</label>
        </p-floatlabel>

        <p-floatlabel class="col-span-6" variant="in">
          <p-input-number inputId="value" class="grid" mode="currency" currency="USD" formControlName="value" />
          <label for="value">Value*</label>
        </p-floatlabel>

        <div class="col-span-12 flex justify-end gap-3">
          <button pButton type="button" severity="secondary" (click)="navigateBack()">Cancel</button>
          @if (!readOnly()) {
            <button pButton type="submit" [disabled]="paymentForm.invalid">Submit</button>
          }
        </div>
      </form>
    </p-card>
  `,
})
export class PaymentsForm {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly header: InputSignal<string> = input.required();
  readonly payment: InputSignal<Payment | undefined | null> = input();
  readonly readOnly: InputSignal<boolean> = input(false);

  readonly formSubmit: OutputEmitterRef<PaymentRequest> = output();

  protected readonly paymentForm: PaymentForm = this.fb.group({
    date: this.fb.control<Date | null | undefined>(null, Validators.required),
    value: this.fb.control<number | null | undefined>(null, Validators.required),
  });

  protected readonly paymentFormEffect: EffectRef = effect((): void => {
    const payment: Payment | undefined | null = this.payment();
    this.paymentForm.patchValue({
      date: payment?.date,
      value: payment?.value,
    });
  });

  protected onSubmit(): void {
    const paymentFormValue: PaymentFormValue = this.paymentForm.value;
    if (this.paymentForm.invalid || !paymentFormValue.date || !paymentFormValue.value) return;

    const payment: PaymentRequest = {
      date: paymentFormValue.date,
      value: paymentFormValue.value,
      expenseId: this.payment()?.expenseId ?? "", // TODO: Fix this
    };

    this.formSubmit.emit(payment);
  }

  protected navigateBack() {
    this.router.navigate(["/payments"]);
  }
}

export type PaymentForm = FormGroup<{
  date: FormControl<Date | null | undefined>;
  value: FormControl<number | null | undefined>;
}>;

export type PaymentFormValue = Partial<{
  date: Date | null | undefined;
  value: number | null | undefined;
}>;
