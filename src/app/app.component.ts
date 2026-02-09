import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatListItem, MatNavList } from "@angular/material/list";
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from "@angular/material/sidenav";
import { MatToolbar } from "@angular/material/toolbar";

import { BreakpointService } from "./services/breakpoint.service";

@Component({
  selector: "my-app",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatIcon,
    MatIconButton,
    MatListItem,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatToolbar,
    RouterLink,
    RouterOutlet,
  ],
  host: { class: "block size-full" },
  template: `
    <div class="grid size-full grid-rows-[auto_1fr]">
      <mat-toolbar class="gap-4">
        <button matIconButton ariaLabel="Toggle Sidebar" (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        My Angular
      </mat-toolbar>
      <mat-sidenav-container (backdropClick)="sidenav.close()">
        <mat-sidenav
          #sidenav
          [fixedInViewport]="breakpointService.isTablet()"
          [mode]="breakpointService.isTablet() ? 'over' : 'side'"
          [opened]="!breakpointService.isTablet()"
        >
          <mat-nav-list>
            <mat-list-item routerLink="/theme-builder"> Theme Builder </mat-list-item>
            <mat-list-item routerLink="/form-builder"> Form Builder </mat-list-item>
          </mat-nav-list>
        </mat-sidenav>
        <mat-sidenav-content>
          <div class="container mx-auto">
            <router-outlet />
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
})
export class App {
  readonly breakpointService: BreakpointService = inject(BreakpointService);
}
