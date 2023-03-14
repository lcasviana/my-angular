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
    <div class="container mx-auto space-y-4 p-4">
      <p-menubar class="block" [model]="menuBarItems">
        <ng-template #start>Financial Tracker</ng-template>
      </p-menubar>

      <router-outlet />
    </div>
  `,
})
export class Layout {
  protected readonly menuBarItems: MenuItem[] = [
    { label: "Expenses", icon: "pi pi-wallet", routerLink: "/expenses" },
    { label: "Payments", icon: "pi pi-receipt", routerLink: "/payments" },
  ];
}
