import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

import { MatButtonModule } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "my-preview-buttons",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatButtonModule, MatDivider, MatIcon],
  template: `
    <h3 class="mb-4 text-lg font-medium">Buttons</h3>

    <section class="mb-4">
      <p class="mb-2 text-sm font-medium">Text</p>
      <div class="flex flex-wrap items-center gap-2">
        <button matButton>Basic</button>
        <button matButton disabled>Disabled</button>
      </div>
    </section>
    <mat-divider />

    <section class="my-4">
      <p class="mb-2 text-sm font-medium">Elevated</p>
      <div class="flex flex-wrap items-center gap-2">
        <button matButton="elevated">Basic</button>
        <button matButton="elevated" disabled>Disabled</button>
      </div>
    </section>
    <mat-divider />

    <section class="my-4">
      <p class="mb-2 text-sm font-medium">Outlined</p>
      <div class="flex flex-wrap items-center gap-2">
        <button matButton="outlined">Basic</button>
        <button matButton="outlined" disabled>Disabled</button>
      </div>
    </section>
    <mat-divider />

    <section class="my-4">
      <p class="mb-2 text-sm font-medium">Filled</p>
      <div class="flex flex-wrap items-center gap-2">
        <button matButton="filled">Basic</button>
        <button matButton="filled" disabled>Disabled</button>
      </div>
    </section>
    <mat-divider />

    <section class="my-4">
      <p class="mb-2 text-sm font-medium">Tonal</p>
      <div class="flex flex-wrap items-center gap-2">
        <button matButton="tonal">Basic</button>
        <button matButton="tonal" disabled>Disabled</button>
      </div>
    </section>
    <mat-divider />

    <section class="my-4">
      <p class="mb-2 text-sm font-medium">Icon Buttons</p>
      <div class="flex flex-wrap items-center gap-2">
        <button matIconButton aria-label="More options">
          <mat-icon>more_vert</mat-icon>
        </button>
        <button matIconButton disabled aria-label="Open in new tab">
          <mat-icon>open_in_new</mat-icon>
        </button>
      </div>
    </section>
    <mat-divider />

    <section class="my-4">
      <p class="mb-2 text-sm font-medium">FAB</p>
      <div class="flex flex-wrap items-center gap-3">
        <button matFab aria-label="Add">
          <mat-icon>add</mat-icon>
        </button>
        <button matMiniFab aria-label="Edit">
          <mat-icon>edit</mat-icon>
        </button>
        <button matFab extended>
          <mat-icon>favorite</mat-icon>
          Favorite
        </button>
      </div>
    </section>
  `,
})
export class PreviewButtons {}
