import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "my-root",
  template: `
    <div class="container mx-auto p-4">
      <header class="mb-8">
        <h1 class="text-3xl font-bold">Financial Tracker</h1>
      </header>
      <main>
        <p>Welcome to the Financial Tracker application</p>
      </main>
    </div>
  `,
  styles: `
    .my-root {
      display: block;
    }
  `,
  host: { class: "my-root" },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {}
