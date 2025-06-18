import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  selector: "my-layout",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  host: { class: "block size-full" },
  template: `
    <main class="container mx-auto p-4">
      <header class="mb-8">
        <div class="flex justify-between items-center mb-2">
          <h1 class="text-3xl font-bold">Financial Tracker</h1>
          <div class="space-x-2">
            <a
              routerLink="/dashboard"
              routerLinkActive="bg-blue-500 text-white"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 rounded-lg bg-gray-200"
            >
              Dashboard
            </a>
            <a
              routerLink="/expenses"
              routerLinkActive="bg-blue-500 text-white"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 rounded-lg bg-gray-200"
            >
              Expenses
            </a>
          </div>
        </div>
      </header>

      <router-outlet />
    </main>
  `,
})
export class Layout {}
