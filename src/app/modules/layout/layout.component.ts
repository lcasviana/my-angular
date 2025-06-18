import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { MenuItem } from "primeng/api";
import { MenubarModule } from "primeng/menubar";

@Component({
  selector: "my-layout",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MenubarModule, RouterOutlet],
  host: { class: "block size-full" },
  template: `
    <main class="container mx-auto p-4 space-y-4">
      <header class="card">
        <p-menubar [model]="menuBarItems">
          <ng-template #start>Financial Tracker</ng-template>
        </p-menubar>
      </header>

      <router-outlet />
    </main>
  `,
})
export class Layout {
  protected readonly menuBarItems: MenuItem[] = [
    { label: "Dashboard", icon: "pi pi-th-large", routerLink: "/dashboard" },
    { label: "Expenses", icon: "pi pi-receipt", routerLink: "/expenses" },
  ];
}
