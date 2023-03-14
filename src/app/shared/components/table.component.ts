import { CdkDragDrop, DragDropModule } from "@angular/cdk/drag-drop";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgStyle, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EffectRef,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  TemplateRef,
  ViewEncapsulation,
  WritableSignal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, map, startWith } from "rxjs";

import { MyButtonComponent, MyTemplateDirective } from "@/shared";

@Component({
  selector: "my-table",
  template: `
    @let config = setup();

    @if (config.header; as header) {
      <header class="bsk-table__header">
        @if (refs().header; as template) {
          <ng-container [ngTemplateOutlet]="template" />
        } @else if (header.title) {
          <h1>{{ header.title }}</h1>
        }

        <i class="flex-grow-1"></i>

        @if (header.search !== false) {
          <!-- <input [id]="'bsk-table__search__' + id()" [formControl]="searchControl" type="text" /> -->
          <!-- TODO: Delete -->
          <div class="d-inline-flex u-mr-4">
            <app-input
              ngModel
              [formControl]="searchControl"
              class="u-w-100"
              classes="c-table-search"
              icon="search-line"
              iconEnd="close-line"
              placeholder="Search"
              type="text"
              (iconEndClick)="searchControl.reset()"
            />
          </div>
          <!--  -->
        }

        @if (header.pagination; as pagination) {
          <!-- <select [id]="'bsk-table__page-size__' + id()" [formControl]="pageSizeControl" class="u-mr-3">
            @for (pageSize of pagination.pageOptions || [10, 20, 50, 100]; track $index) {
              <option [value]="pageSize">{{ pageSize }}</option>
            }
          </select> -->
          <!-- TODO: Delete -->
          <!-- <app-select
            class="u-mr-3 u-w-6f"
            classes="c-table-header-select u-w-min-auto"
            [ngModel]="pageSizeControl.value"
            [options]="pagination.pageOptions || [10, 20, 50, 100]"
            [position]="'right'"
            prefix="Show "
            (ngModelChange)="pageSizeControl.setValue($event)"
          /> -->
          <!--  -->

          <button bskButton appearance="text" (click)="pageInit()">
            <i style="font-size: 2.4rem" class="icon icon--arrow-left-s-line"></i>
          </button>
          <button bskButton appearance="text" (click)="pagePrev()">
            <i style="font-size: 2.4rem" class="icon icon--arrow-left-s-line"></i>
          </button>
          <span class="u-text-xs-md u-w-4f u-text-center">{{ pageCurrent() }} / {{ pageTotal() }}</span>
          <button bskButton appearance="text" (click)="pageNext()">
            <i style="font-size: 2.4rem" class="icon icon--arrow-right-s-line"></i>
          </button>
          <button bskButton appearance="text" (click)="pageLast()">
            <i style="font-size: 2.4rem" class="icon icon--arrow-right-s-line"></i>
          </button>
        }

        @if (header.filter !== false) {
          <!-- <button bskButton appearance="text" class="u-ml-3">
            <i style="font-size: 2.4rem" class="icon icon--filter-3-fill"></i>
          </button> -->
          <!-- TODO: Delete -->
          <!-- <app-button
            class="u-ml-3 c-table-header-icon"
            customClasses="c-table-header-icon"
            type="text"
            leftIcon="filter-3-fill"
            [dropdownFor]="tableColumnFilter"
            (opened)="filterControl.reset()"
          />
          <app-dropdown #tableColumnFilter classes="u-pa-0">
            <div class="d-flex flex-column" style="overflow: hidden">
              <div class="d-flex u-pa-1">
                <app-input
                  ngModel
                  [formControl]="filterControl"
                  class="u-w-100"
                  classes="c-table-search"
                  icon="search-line"
                  iconEnd="close-line"
                  placeholder="Search"
                  type="text"
                  (iconEndClick)="filterControl.reset()"
                />
              </div>
              <app-list
                class="d-inline-flex flex-column flex-grow-1"
                style="overflow: auto"
                #dropdownColumnsFilterList
                [(ngModel)]="filterSelected"
                [items]="filterOptions()"
                [multiple]="true"
                [search]="filterControl.value"
                [template]="listTemplate"
              />
              <ng-template #listTemplate let-id="id">
                {{ config.head?.data?.[id]?.text }}
              </ng-template>
              <div class="d-flex flex-column u-pa-2">
                <app-button
                  color="primary"
                  size="sm"
                  type="contained"
                  (click)="filterSelected.set(filterInit()); sortColsState.set({}); sortColsOrder.set([]); tableColumnFilter.closed.emit()"
                >
                  Reset
                </app-button>
              </div>
            </div>
          </app-dropdown> -->
          <!--  -->
        }
      </header>
    }

    <section style="max-height: calc(100vh - 235px); overflow: auto" cdkScrollable>
      <table [id]="id()" [style.table_layout]="'fixed'" class="bsk-table" cellpadding="0" cellspacing="0">
        @let head = config.head;
        <thead>
          <tr
            style="{{ head?.tr?.styles }}"
            class="u-bg-tk-gray-75 {{ head?.tr?.className }}"
            cdkDropList
            cdkDropListOrientation="horizontal"
            (cdkDropListDropped)="reorderCols($event)"
          >
            @for (col of colsLeft(); track col) {
              <ng-container [ngTemplateOutlet]="thTemplate" [ngTemplateOutletContext]="{ col }" />
            }

            @for (col of cols(); track col) {
              <ng-container [ngTemplateOutlet]="thTemplate" [ngTemplateOutletContext]="{ col }" />
            }

            @for (col of colsRight(); track col) {
              <ng-container [ngTemplateOutlet]="thTemplate" [ngTemplateOutletContext]="{ col }" />
            }

            <ng-template #thTemplate [bskTemplate]="cellTemplateType" let-col="col">
              @let thStyles = ((config.head?.th?.styles || "") + " " + (head?.data?.[col]?.styles || "")).trim();
              <th
                [ngStyle]="{
                  maxWidth: config.cols.size?.[col],
                  minWidth: config.cols.size?.[col],
                  width: config.cols.size?.[col],
                  left: head?.data?.[col]?.sticky === 'left' ? head?.data?.[col]?.offset || 0 : undefined,
                  right: head?.data?.[col]?.sticky === 'right' ? head?.data?.[col]?.offset || 0 : undefined,
                  zIndex: head?.data?.[col]?.sticky !== undefined ? 4 : 3,
                  cursor:
                    head?.data?.[col]?.draggable !== false && !head?.data?.[col]?.sticky
                      ? 'move'
                      : head?.data?.[col]?.sortable !== false
                        ? 'pointer'
                        : 'auto',
                }"
                [style]="thStyles"
                class="bsk-table__th {{ head?.th?.className }} {{ head?.data?.[col]?.className }}"
                cdkDrag
                cdkDragBoundary=".bsk-table thead tr"
                [cdkDragDisabled]="head?.data?.[col]?.draggable === false || head?.data?.[col]?.sticky !== undefined"
                (click)="head?.data?.[col]?.sortable !== false && sort(col)"
              >
                @if (refs().head?.[col]; as template) {
                  <ng-container [ngTemplateOutlet]="template" [ngTemplateOutletContext]="{ col }" ] />
                } @else {
                  <span class="d-inline-block u-w-max-100 u-text-middle" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {{ head?.data?.[col]?.text || col }}
                  </span>
                }
                @if (sortColsState()[col] !== undefined && sortColsState()[col] !== "none") {
                  <i
                    [style.transform]="sortColsState()[col] === 'asc' ? 'rotate(0deg)' : 'rotate(180deg) scaleX(-1)'"
                    class="icon icon--table-arrow bsk-table__sort"
                  ></i>
                }
              </th>
            </ng-template>
          </tr>
        </thead>

        @if (data()) {
          @let body = config.body;
          <tbody>
            @for (row of rows(); track row.id) {
              @let index = $index;
              <tr style="{{ body?.tr?.styles }}" class="u-bg-tk-gray-75 {{ body?.tr?.className }}">
                @for (col of colsLeft(); track col) {
                  <ng-container [ngTemplateOutlet]="tdTemplate" [ngTemplateOutletContext]="{ col }" />
                }

                @for (col of cols(); track col) {
                  <ng-container [ngTemplateOutlet]="tdTemplate" [ngTemplateOutletContext]="{ col }" />
                }

                @for (col of colsRight(); track col) {
                  <ng-container [ngTemplateOutlet]="tdTemplate" [ngTemplateOutletContext]="{ col }" />
                }

                <ng-template #tdTemplate [bskTemplate]="cellTemplateType" let-col="col">
                  @let tdStyles = ((config.body?.td?.styles || "") + " " + (body?.data?.[col]?.styles || "")).trim();
                  <td
                    [ngStyle]="{
                      maxWidth: config.cols.size?.[col],
                      minWidth: config.cols.size?.[col],
                      width: config.cols.size?.[col],
                      left: head?.data?.[col]?.sticky === 'left' ? head?.data?.[col]?.offset || 0 : undefined,
                      right: head?.data?.[col]?.sticky === 'right' ? head?.data?.[col]?.offset || 0 : undefined,
                      zIndex: head?.data?.[col]?.sticky !== undefined ? 2 : 1,
                      backgroundColor: highlight().includes(row.id) ? '#ebf6ff' : '#fff',
                    }"
                    [style]="tdStyles"
                    class="bsk-table__td {{ body?.td?.className }} {{ body?.data?.[col]?.className }}"
                  >
                    @if (refs().body?.[col]; as template) {
                      <ng-container [ngTemplateOutlet]="template" [ngTemplateOutletContext]="{ index, id: row.id, row, col, value: row[col] }" />
                    } @else {
                      <span
                        class="d-inline-block u-w-max-100 u-text-middle"
                        style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                        [title]="body?.data?.[col]?.render?.(row) || row[col]"
                      >
                        {{ body?.data?.[col]?.render?.(row) || row[col] }}
                      </span>
                    }
                  </td>
                </ng-template>
              </tr>
            }
          </tbody>
        }
      </table>

      @if (!data()) {
        <div class="bsk-table__skeleton"></div>
      } @else if (!data()?.length) {
        <div class="bsk-table__empty">{{ config.body?.empty || "No data." }}</div>
      }
    </section>

    @if (config.footer; as footer) {
      <footer></footer>
    }
  `,
  host: { class: "bsk-table__host" },
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragDropModule, NgStyle, NgTemplateOutlet, ReactiveFormsModule, ScrollingModule, MyButtonComponent, MyTemplateDirective],
})
export class MyTableComponent<T extends Record<string, unknown> & { id: string }> {
  public readonly id: InputSignal<string> = input.required();
  public readonly data: InputSignal<T[] | undefined> = input.required();
  public readonly setup: InputSignal<MyTableSetup<T>> = input.required();
  public readonly refs: InputSignal<MyTableRefs<T>> = input({});
  public readonly highlight: InputSignal<string[]> = input<string[]>([]);

  public readonly rendered: OutputEmitterRef<void> = output();

  // Filter

  protected readonly filterInitEffect: EffectRef = effect(() => this.filterSelected.set(this.colsInit().map(col => col.toString())), {
    allowSignalWrites: true,
  });

  protected readonly filterColsEffect: EffectRef = effect(() => this.cols.set(this.filterSelected()), {
    allowSignalWrites: true,
  });

  protected filterInit(): string[] {
    return (this.setup().cols.init || this.setup().cols.keys)
      .filter(col => this.setup().head?.data?.[col]?.sticky === undefined)
      .map(col => col.toString());
  }

  protected readonly filterControl: FormControl<string> = new FormControl("", { nonNullable: true });
  protected readonly filterOptions: Signal<Array<keyof T>> = computed(() =>
    this.setup().cols.keys.filter(col => this.setup().head?.data?.[col]?.sticky === undefined),
  );
  protected readonly filterSelected: ModelSignal<string[]> = model<string[]>([]);

  // Pagination

  protected readonly paginationEffect: EffectRef = effect(
    () => {
      const pagination = this.setup().header?.pagination;
      if (pagination) this.pageSizeControl.setValue(pagination.pageSize || 10);
    },
    { allowSignalWrites: true },
  );

  protected readonly pageCurrent: WritableSignal<number> = signal(1);
  protected readonly pageSizeControl: FormControl<number> = new FormControl(10, { nonNullable: true });
  protected readonly pageSize: Signal<number> = toSignal(this.pageSizeControl.valueChanges.pipe(distinctUntilChanged()), {
    initialValue: this.pageSizeControl.value,
  });
  protected readonly pageTotal: Signal<number> = computed(() => Math.ceil(this.rowsLength() / this.pageSize()) || 1);

  protected pageInit(): void {
    if (this.setup().header?.pagination) this.pageCurrent.set(1);
  }

  protected pagePrev(): void {
    if (this.setup().header?.pagination) this.pageCurrent.set(Math.max(this.pageCurrent() - 1, 1));
  }

  protected pageNext(): void {
    if (this.setup().header?.pagination) this.pageCurrent.set(Math.min(this.pageCurrent() + 1, this.pageTotal()));
  }

  protected pageLast(): void {
    if (this.setup().header?.pagination) this.pageCurrent.set(this.pageTotal());
  }

  // Search

  protected readonly searchControl: FormControl<string> = new FormControl("", { nonNullable: true });
  private readonly search: Signal<string> = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(""),
      map(value => value.trim().toLowerCase()),
      debounceTime(250),
      distinctUntilChanged(),
    ),
    { initialValue: this.searchControl.value },
  );

  // Sort

  protected readonly sortColsStateStorageKey: Signal<string> = computed(() => `${this.id()}__sort__state`);
  protected readonly sortColsOrderStorageKey: Signal<string> = computed(() => `${this.id()}__sort__order`);

  protected readonly sortColsInitEffect: EffectRef = effect(
    () => {
      const sortStateItem = localStorage.getItem(this.sortColsStateStorageKey());
      const sortState = sortStateItem ? JSON.parse(sortStateItem) : undefined;
      if (sortState) this.sortColsState.set(sortState);

      const sortOrderItem = localStorage.getItem(this.sortColsOrderStorageKey());
      const sortOrder = sortOrderItem ? JSON.parse(sortOrderItem) : undefined;
      if (sortOrder) this.sortColsOrder.set(sortOrder);
    },
    { allowSignalWrites: true },
  );

  protected readonly sortColsStateEffect: EffectRef = effect(() => {
    const sortColsState = this.sortColsState();
    localStorage.setItem(this.sortColsStateStorageKey(), JSON.stringify(sortColsState));
  });

  protected readonly sortColsOrderEffect: EffectRef = effect(() => {
    const sortColsOrder = this.sortColsOrder();
    localStorage.setItem(this.sortColsOrderStorageKey(), JSON.stringify(sortColsOrder));
  });

  protected readonly sortColsState: WritableSignal<Partial<Record<keyof T, MyTableSort>>> = signal({});
  protected readonly sortColsOrder: WritableSignal<Array<keyof T>> = signal([]);
  private readonly sortColsOrientation: Record<MyTableSort, MyTableSort> = {
    none: "asc",
    asc: "desc",
    desc: "none",
  };

  protected sort(column: keyof T): void {
    this.sortColsState.update(state =>
      Object.entries({
        ...state,
        [column]: this.sortColsOrientation[state[column] || "none"],
      })
        .map(([key, sort]): [keyof T, MyTableSort] => [key as keyof T, sort as MyTableSort])
        .map(([key, sort]) => (key !== column && this.setup().head?.sort === "single" ? undefined : [key, sort]))
        .filter(sortCol => sortCol)
        .map(sortCol => sortCol!)
        .reduce((sortCols, [key, sort]) => ({ ...sortCols, [key]: sort }), {}),
    );

    this.sortColsOrder.update(order => [...order.filter(col => col !== column), column]);
  }

  private sortColsBy(a: T, b: T, col: keyof T, sort: MyTableSort): number {
    if (sort === "none") return 0;

    const A = this.setup().body?.data?.[col]?.render?.(a) || a[col];
    const B = this.setup().body?.data?.[col]?.render?.(b) || b[col];

    if ((!A && A !== 0 && A !== false) || (!a[col] && a[col] !== 0 && a[col] !== false)) return +1;
    if ((!B && B !== 0 && B !== false) || (!b[col] && b[col] !== 0 && b[col] !== false)) return -1;

    if (typeof A === "boolean" && typeof b[col] === "boolean") {
      if (a[col] < b[col]) return sort === "asc" ? -1 : +1;
      if (a[col] > b[col]) return sort === "asc" ? +1 : -1;
      return 0;
    }

    if (typeof a[col] === "number" && typeof b[col] === "number") {
      if (a[col] < b[col]) return sort === "asc" ? -1 : +1;
      if (a[col] > b[col]) return sort === "asc" ? +1 : -1;
      return 0;
    }

    if (typeof A === "string" && typeof B === "string") {
      return sort === "asc" ? A.toLowerCase().localeCompare(B) : B.toLowerCase().localeCompare(A);
    }

    return 0;
  }

  // Cols

  private readonly colsStorageKey: Signal<string> = computed(() => `${this.id()}__cols`);

  protected readonly colsInitEffect: EffectRef = effect(() => this.cols.set(this.colsInit()), {
    allowSignalWrites: true,
  });

  protected readonly colsEffect: EffectRef = effect(() => {
    const cols = this.cols();
    localStorage.setItem(this.colsStorageKey(), JSON.stringify(cols));
  });

  protected colsInit(): Array<keyof T> {
    const item = localStorage.getItem(this.colsStorageKey());
    const cols = item ? (JSON.parse(item) as Array<keyof T>) : undefined;
    return (cols || this.setup().cols.init || this.setup().cols.keys).filter(col => this.setup().head?.data?.[col]?.sticky === undefined);
  }

  protected cols: WritableSignal<Array<keyof T>> = signal([], {
    equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });

  protected colsLeft: Signal<Array<keyof T>> = computed(() => {
    const ths = this.setup().head?.data;
    if (!ths) return [];
    return Object.entries(ths)
      .filter(([key, th]) => key && th.sticky === "left")
      .map(([key]) => key as keyof T);
  });

  protected colsRight: Signal<Array<keyof T>> = computed(() => {
    const ths = this.setup().head?.data;
    if (!ths) return [];
    return Object.entries(ths)
      .filter(([key, th]) => key && th.sticky === "right")
      .map(([key]) => key as keyof T);
  });

  protected reorderCols(event: CdkDragDrop<Array<keyof T>>): void {
    const currentIndex = event.currentIndex - this.colsLeft().length;
    const previousIndex = event.previousIndex - this.colsLeft().length;
    if (previousIndex < 0 || previousIndex >= this.cols().length || currentIndex < 0 || currentIndex >= this.cols().length) {
      return;
    }

    this.cols.update(cols => {
      const _cols = [...cols];
      const element = _cols.splice(previousIndex, 1)[0];
      _cols.splice(currentIndex, 0, element);
      return [..._cols];
    });
  }

  // Rows

  protected readonly rowsEffect: EffectRef = effect(() => this.rows() && this.rendered.emit());

  protected readonly rowsLength: Signal<number> = computed(() => this.rowsFiltered()?.length || 0);

  protected readonly rowsFiltered: Signal<T[] | undefined> = computed(() => {
    const data = this.data();
    const search = this.search();
    const setup = this.setup();

    if (!data) return undefined;
    if (!search) return data;

    const dataFiltered = data.filter((row: T) =>
      Object.entries(row)
        .filter(([key]) => setup.head?.data?.[key as keyof T]?.filterable !== false)
        .some(([key, value]) => {
          const text = setup.body?.data?.[key as keyof T]?.render?.(row) || value;
          return text && text.toString().toLowerCase().includes(search);
        }),
    );
    return dataFiltered;
  });

  protected readonly rowsSorted: Signal<T[] | undefined> = computed(() => {
    const rowsFiltered = this.rowsFiltered();
    const sortColsState = this.sortColsState();
    const sortColsOrder = this.sortColsOrder();

    if (!rowsFiltered) return undefined;

    let dataSorted = [...rowsFiltered];
    sortColsOrder.forEach((column: keyof T) => {
      const sort = sortColsState[column] || "none";
      dataSorted = dataSorted.sort((a, b) => this.sortColsBy(a, b, column, sort));
    });

    return dataSorted;
  });

  protected readonly rowsPaginated: Signal<T[] | undefined> = computed(() => {
    const rowsSorted = this.rowsSorted();
    const setup = this.setup();

    if (!rowsSorted) return undefined;

    if (setup.header?.pagination) {
      const start = (this.pageCurrent() - 1) * this.pageSize();
      const end = start + this.pageSize();
      const dataPaginated = rowsSorted.slice(start, end);
      return dataPaginated;
    }

    return rowsSorted;
  });

  protected rows: Signal<T[] | undefined> = computed(() => {
    const rowsPaginated = this.rowsPaginated();
    if (!rowsPaginated) return undefined;
    return rowsPaginated;
  });

  // Helpers

  protected readonly cellTemplateType!: MyTableRefCell<T>;
}

export type MyTableSort = "asc" | "desc" | "none";

export type MyTableCols<T extends Record<string, unknown>> = {
  keys: Array<keyof T>;
  init?: Array<keyof T>;
  size?: Record<keyof T, string>;
};

export type MyTableAppearance = {
  className?: string;
  styles?: string;
};

export type MyTableHeadData = {
  text?: string;
  draggable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  hidden?: boolean;
  sticky?: "left" | "right";
  offset?: string;
  filter?: boolean;
} & MyTableAppearance;

export type MyTableHead<T extends Record<string, unknown>> = {
  tr?: MyTableAppearance;
  th?: MyTableAppearance;
  sort?: "all" | "single";
  data?: Record<keyof T, MyTableHeadData>;
};

export type MyTableBodyData<T extends Record<string, unknown>> = {
  render?: (row: T) => string | number | boolean | null | undefined;
} & MyTableAppearance;

export type MyTableBody<T extends Record<string, unknown>> = {
  tr?: MyTableAppearance;
  td?: MyTableAppearance;
  empty?: string;
  data?: Record<keyof T, MyTableBodyData<T>>;
};

export type MyTableHeader = {
  title?: string;
  search?: boolean;
  pagination?: { pageOptions?: Array<number>; pageSize?: number };
  filter?: boolean;
};

export type MyTableFooter = {
  updatedAt?: string;
};

export type MyTableSetup<T extends Record<string, unknown>> = {
  cols: MyTableCols<T>;
  head?: MyTableHead<T>;
  body?: MyTableBody<T>;
  header?: MyTableHeader;
  footer?: MyTableFooter;
};

export type MyTableRefCell<T> = {
  col: keyof T;
};

export type MyTableRefCol<T> = {
  index: number;
  id: string;
  row: T;
  col: keyof T;
  value: unknown;
};

export type MyTableRefs<T extends object> = {
  head?: Partial<Record<keyof T, TemplateRef<MyTableRefCell<T>>>>;
  body?: Partial<Record<keyof T, TemplateRef<MyTableRefCol<T>>>>;
  header?: TemplateRef<void>;
  footer?: TemplateRef<void>;
};

export type MyTableConfigThTd<T extends Record<string, unknown>> = MyTableHeadData & MyTableBodyData<T> & { size?: string };

export type MyTableConfig<T extends Record<string, unknown>> = Record<keyof T, MyTableConfigThTd<T>>;
