import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, output } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

export interface ExpenseFilterCriteria {
  category: string | null;
  startDate: Date | null;
  endDate: Date | null;
  recurrenceType: string | null;
}

@Component({
  selector: "my-expense-filter",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="bg-white p-4 rounded-lg shadow mb-4">
      <h3 class="text-lg font-semibold mb-3">Filter Expenses</h3>

      <form [formGroup]="filterForm" (ngSubmit)="applyFilter()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Category filter -->
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="category"> Category </label>
            <select
              id="category"
              formControlName="category"
              class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">All Categories</option>
              @for (category of categories(); track category) {
                <option [value]="category">{{ category }}</option>
              }
            </select>
          </div>

          <!-- Recurrence Type filter -->
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="recurrenceType"> Recurrence </label>
            <select
              id="recurrenceType"
              formControlName="recurrenceType"
              class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">All Types</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="startDate"> From Date </label>
            <input
              type="date"
              id="startDate"
              formControlName="startDate"
              class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="endDate"> To Date </label>
            <input
              type="date"
              id="endDate"
              formControlName="endDate"
              class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div class="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            (click)="clearFilter()"
          >
            Clear
          </button>
          <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Apply Filter
          </button>
        </div>
      </form>
    </div>
  `,
  styles: ``,
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
      startDate: formValue.startDate ? new Date(formValue.startDate) : null,
      endDate: formValue.endDate ? new Date(formValue.endDate) : null,
      recurrenceType: formValue.recurrenceType || null,
    };

    this.filterChange.emit(criteria);
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
