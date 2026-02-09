import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

import { MatBadge } from "@angular/material/badge";
import { MatChipSet, MatChip } from "@angular/material/chips";
import { MatIcon } from "@angular/material/icon";
import { MatListItem, MatNavList } from "@angular/material/list";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { MatToolbar } from "@angular/material/toolbar";

@Component({
  selector: "my-preview-navigation",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatBadge, MatChip, MatChipSet, MatIcon, MatListItem, MatNavList, MatTab, MatTabGroup, MatToolbar],
  template: `
    <h3 class="mb-4 text-lg font-medium">Navigation</h3>

    <!-- Toolbar -->
    <section class="mb-4">
      <p class="mb-2 text-sm font-medium">Toolbar</p>
      <mat-toolbar>
        <mat-icon class="mr-2">menu</mat-icon>
        <span>Application Title</span>
        <span class="flex-1"></span>
        <mat-icon [matBadge]="3" matBadgeColor="warn">notifications</mat-icon>
      </mat-toolbar>
    </section>

    <!-- Tabs -->
    <section class="mb-4">
      <p class="mb-2 text-sm font-medium">Tabs</p>
      <mat-tab-group>
        <mat-tab label="Overview">
          <div class="p-3">Overview content goes here.</div>
        </mat-tab>
        <mat-tab label="Details">
          <div class="p-3">Details content goes here.</div>
        </mat-tab>
        <mat-tab label="Settings">
          <div class="p-3">Settings content goes here.</div>
        </mat-tab>
      </mat-tab-group>
    </section>

    <!-- Nav List -->
    <section class="mb-4">
      <p class="mb-2 text-sm font-medium">Navigation List</p>
      <mat-nav-list class="max-w-xs">
        <a mat-list-item>
          <mat-icon matListItemIcon>home</mat-icon>
          <span matListItemTitle>Home</span>
        </a>
        <a mat-list-item>
          <mat-icon matListItemIcon>settings</mat-icon>
          <span matListItemTitle>Settings</span>
        </a>
        <a mat-list-item>
          <mat-icon matListItemIcon>person</mat-icon>
          <span matListItemTitle>Profile</span>
        </a>
      </mat-nav-list>
    </section>

    <!-- Chips -->
    <section>
      <p class="mb-2 text-sm font-medium">Chips</p>
      <mat-chip-set>
        <mat-chip>Angular</mat-chip>
        <mat-chip>Material</mat-chip>
        <mat-chip>Design</mat-chip>
        <mat-chip>Theme</mat-chip>
      </mat-chip-set>
    </section>
  `,
})
export class PreviewNavigation {}
