import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "my-root",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  host: { class: "block min-h-dvh min-w-dvw" },
})
export class AppComponent {}
