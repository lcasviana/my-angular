import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

import { MatDivider } from "@angular/material/divider";

@Component({
  selector: "my-preview-typography",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatDivider],
  template: `
    <h3 class="mb-4 text-lg font-medium">Typography</h3>

    <div class="flex flex-col gap-4">
      <!-- Display -->
      <section>
        <p class="mb-1 text-xs font-medium tracking-wide uppercase opacity-60">Display</p>
        <div class="mat-display-large">Display Large</div>
        <div class="mat-display-medium">Display Medium</div>
        <div class="mat-display-small">Display Small</div>
      </section>
      <mat-divider />

      <!-- Headline -->
      <section>
        <p class="mb-1 text-xs font-medium tracking-wide uppercase opacity-60">Headline</p>
        <div class="mat-headline-large">Headline Large</div>
        <div class="mat-headline-medium">Headline Medium</div>
        <div class="mat-headline-small">Headline Small</div>
      </section>
      <mat-divider />

      <!-- Title -->
      <section>
        <p class="mb-1 text-xs font-medium tracking-wide uppercase opacity-60">Title</p>
        <div class="mat-title-large">Title Large</div>
        <div class="mat-title-medium">Title Medium</div>
        <div class="mat-title-small">Title Small</div>
      </section>
      <mat-divider />

      <!-- Body -->
      <section>
        <p class="mb-1 text-xs font-medium tracking-wide uppercase opacity-60">Body</p>
        <div class="mat-body-large">Body Large - The quick brown fox jumps over the lazy dog.</div>
        <div class="mat-body-medium">Body Medium - The quick brown fox jumps over the lazy dog.</div>
        <div class="mat-body-small">Body Small - The quick brown fox jumps over the lazy dog.</div>
      </section>
      <mat-divider />

      <!-- Label -->
      <section>
        <p class="mb-1 text-xs font-medium tracking-wide uppercase opacity-60">Label</p>
        <div class="mat-label-large">Label Large</div>
        <div class="mat-label-medium">Label Medium</div>
        <div class="mat-label-small">Label Small</div>
      </section>
    </div>
  `,
})
export class PreviewTypography {}
