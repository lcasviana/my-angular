import { CommonModule, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, model, output } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { v4 as uuidv4 } from "uuid";
import { Expense, ExpensePayment } from "../models";

@Component({
  selector: "my-payment-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe],
  template: `
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Payments</h3>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
          (click)="showPaymentForm.set(true)"
          *ngIf="!showPaymentForm()"
        >
          Add Payment
        </button>
      </div>

      @if (showPaymentForm()) {
        <form [formGroup]="paymentForm" (ngSubmit)="savePayment()" class="mb-4 p-4 border rounded">
          <div class="mb-3">
            <label class="block text-gray-700 text-sm font-bold mb-1" for="paymentDate">Date</label>
            <input
              type="date"
              id="paymentDate"
              formControlName="date"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            @if (paymentForm.get("date")?.invalid && paymentForm.get("date")?.touched) {
              <p class="text-red-500 text-xs italic">Date is required</p>
            }
          </div>

          <div class="mb-3">
            <label class="block text-gray-700 text-sm font-bold mb-1" for="paymentValue">Amount</label>
            <input
              type="number"
              id="paymentValue"
              formControlName="value"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              step="0.01"
            />
            @if (paymentForm.get("value")?.invalid && paymentForm.get("value")?.touched) {
              <p class="text-red-500 text-xs italic">Valid amount is required</p>
            }
          </div>

          <div class="flex justify-end space-x-2">
            <button
              type="button"
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
              (click)="cancelPaymentEdit()"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
              [disabled]="paymentForm.invalid"
            >
              Save Payment
            </button>
          </div>
        </form>
      }

      @if (!expense()?.payments?.length) {
        <p class="text-gray-500 italic text-center py-4">No payments recorded for this expense</p>
      } @else {
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr>
                <th class="py-2 px-4 border-b text-left">Date</th>
                <th class="py-2 px-4 border-b text-right">Amount</th>
                <th class="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (payment of expense()?.payments || []; track payment.uuid) {
                <tr>
                  <td class="py-2 px-4 border-b">{{ payment.date | date: "mediumDate" : "GMT" }}</td>
                  <td class="py-2 px-4 border-b text-right">{{ payment.value | currency }}</td>
                  <td class="py-2 px-4 border-b text-center">
                    <button class="text-blue-500 hover:text-blue-700 mr-2" (click)="editPayment(payment)">Edit</button>
                    <button class="text-red-500 hover:text-red-700" (click)="deletePayment(payment.uuid)">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr>
                <td class="py-2 px-4 border-t font-bold">Total</td>
                <td class="py-2 px-4 border-t text-right font-bold">{{ calculateTotal() | currency }}</td>
                <td class="py-2 px-4 border-t"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      }
    </div>
  `,
  styles: ``,
})
export class PaymentListComponent {
  private readonly fb = inject(FormBuilder);

  // Input expense for which we're managing payments
  readonly expense = input<Expense | null>(null);

  // Output when payments are updated
  readonly paymentsUpdated = output<Expense>();

  // Model to track whether payment form is visible
  readonly showPaymentForm = model<boolean>(false);

  // Current payment being edited (null for new payment)
  private currentPaymentId: string | null = null;

  // Form for creating/editing payments
  readonly paymentForm: FormGroup = this.fb.group({
    uuid: [""],
    date: ["", Validators.required],
    value: [null, [Validators.required, Validators.min(0.01)]],
  });

  /**
   * Save a payment (add new or update existing)
   */
  protected savePayment(): void {
    if (this.paymentForm.invalid || !this.expense()) return;

    const formValue = this.paymentForm.value;
    const payment: ExpensePayment = {
      uuid: formValue.uuid || uuidv4(),
      date: this.createDateInUTC(formValue.date),
      value: Number(formValue.value),
    };

    const currentExpense = this.expense()!; // We already checked this is not null
    const payments = [...(currentExpense.payments || [])];

    const existingIndex = payments.findIndex(p => p.uuid === payment.uuid);
    if (existingIndex >= 0) {
      // Update existing payment
      payments[existingIndex] = payment;
    } else {
      // Add new payment
      payments.push(payment);
    }

    // Sort payments by date (newest first)
    payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Create updated expense with new payments
    const updatedExpense: Expense = {
      ...currentExpense,
      payments,
    };

    // Emit update event
    this.paymentsUpdated.emit(updatedExpense);
    this.resetForm();
  }

  /**
   * Creates a Date object in UTC from a date string (YYYY-MM-DD)
   */
  private createDateInUTC(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  /**
   * Edit an existing payment
   */
  protected editPayment(payment: ExpensePayment): void {
    this.currentPaymentId = payment.uuid;
    this.showPaymentForm.set(true);
    this.paymentForm.patchValue({
      uuid: payment.uuid,
      date: this.formatDateForInput(payment.date),
      value: payment.value,
    });
  }

  /**
   * Delete a payment
   */
  protected deletePayment(paymentId: string): void {
    if (!this.expense() || !this.expense()?.payments) return;
    if (!confirm("Are you sure you want to delete this payment?")) return;

    const currentExpense = this.expense()!;
    const updatedPayments = currentExpense.payments!.filter(p => p.uuid !== paymentId);

    const updatedExpense: Expense = {
      ...currentExpense,
      payments: updatedPayments,
    };

    this.paymentsUpdated.emit(updatedExpense);
  }

  /**
   * Cancel editing and reset the form
   */
  protected cancelPaymentEdit(): void {
    this.resetForm();
  }

  /**
   * Calculate total payments
   */
  protected calculateTotal(): number {
    const payments = this.expense()?.payments || [];
    return payments.reduce((sum, payment) => sum + payment.value, 0);
  }

  /**
   * Reset the form and exit edit mode
   */
  private resetForm(): void {
    this.currentPaymentId = null;
    this.showPaymentForm.set(false);
    this.paymentForm.reset({
      uuid: "",
      date: this.formatDateForInput(new Date()),
      value: null,
    });
  }

  /**
   * Format a Date object for date input (YYYY-MM-DD) in GMT+0
   */
  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    // Format the date as YYYY-MM-DD in GMT+0
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
