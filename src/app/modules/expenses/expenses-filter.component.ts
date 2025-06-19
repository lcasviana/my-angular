import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, output } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

export interface ExpenseFilterCriteria {
  category: string | null;
  startDate: Date | null;
  endDate: Date | null;
  recurrenceType: string | null;
}

@Component({
  selector: "my-expenses-filter",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, ReactiveFormsModule],
  template: `
    <div class="mb-4 rounded-lg bg-white p-4 shadow">
      <h3 class="mb-3 text-lg font-semibold">Filter Expenses</h3>

      <form [formGroup]="filterForm" (ngSubmit)="applyFilter()">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Category filter -->
          <div>
            <label class="mb-2 block text-sm font-bold text-gray-700" for="category"> Category </label>
            <select
              id="category"
              formControlName="category"
              class="focus:shadow-outline w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            >
              <option value="">All Categories</option>
              @for (category of categories(); track category) {
                <option [value]="category">{{ category }}</option>
              }
            </select>
          </div>

          <!-- Recurrence Type filter -->
          <div>
            <label class="mb-2 block text-sm font-bold text-gray-700" for="recurrenceType"> Recurrence </label>
            <select
              id="recurrenceType"
              formControlName="recurrenceType"
              class="focus:shadow-outline w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="mb-2 block text-sm font-bold text-gray-700" for="startDate"> From Date </label>
            <input
              type="date"
              id="startDate"
              formControlName="startDate"
              class="focus:shadow-outline w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-bold text-gray-700" for="endDate"> To Date </label>
            <input
              type="date"
              id="endDate"
              formControlName="endDate"
              class="focus:shadow-outline w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            />
          </div>
        </div>

        <div class="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            class="focus:shadow-outline rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
            (click)="clearFilter()"
          >
            Clear
          </button>
          <button type="submit" class="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
            Apply Filter
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ExpenseFilterComponent {
  private readonly fb = inject(FormBuilder);

  // Signal inputs and outputs
  readonly categories = input<string[]>([]);
  readonly filterChange = output<ExpenseFilterCriteria>();

  // Readonly form
  readonly filterForm: FormGroup = this.fb.group({
    category: [""],
    startDate: [""],
    endDate: [""],
    recurrenceType: [""],
  });

  protected applyFilter(): void {
    const formValue = this.filterForm.value;

    const criteria: ExpenseFilterCriteria = {
      category: formValue.category || null,
      startDate: formValue.startDate ? this.createDateInUTC(formValue.startDate) : null,
      endDate: formValue.endDate ? this.createDateInUTC(formValue.endDate) : null,
      recurrenceType: formValue.recurrenceType || null,
    };

    this.filterChange.emit(criteria);
  }

  /**
   * Creates a Date object in UTC from a date string (YYYY-MM-DD)
   */
  private createDateInUTC(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  protected clearFilter(): void {
    this.filterForm.reset({
      category: "",
      startDate: "",
      endDate: "",
      recurrenceType: "",
    });

    this.applyFilter();
  }
}
