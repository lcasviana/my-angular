import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "my-app",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet],
  host: { class: "block min-h-dvh min-w-dvw" },
  template: `<router-outlet />`,
})
export class App {}
