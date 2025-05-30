import { Routes } from "@angular/router";
import { environment } from "../environments/environment";
import { LayoutComponent } from "./modules/layout/layout.component";
import { ButtonShowcaseComponent } from "./modules/style-guide/components/button-showcase/button-showcase.component";

export const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
  },
  {
    path: "style-guide",
    component: ButtonShowcaseComponent,
    // Only load the style guide in development mode
    canActivate: [() => !environment.production],
  },
];
