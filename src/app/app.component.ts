import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "my-root",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }
  `,
})
export class AppComponent {}
