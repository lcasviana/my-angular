import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

import { ConfigPanel } from "./components/config-panel/config-panel.component";
import { PreviewArea } from "./components/preview-area/preview-area.component";

@Component({
  selector: "my-theme-builder-page",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ConfigPanel, PreviewArea],
  host: { class: "block size-full" },
  template: `
    <div class="grid h-full grid-cols-[340px_1fr]">
      <my-config-panel class="overflow-y-auto border-r border-[var(--mat-sys-outline-variant)] bg-[var(--mat-sys-surface)]" />
      <my-preview-area class="overflow-y-auto" />
    </div>
  `,
})
export class ThemeBuilderPage {}
