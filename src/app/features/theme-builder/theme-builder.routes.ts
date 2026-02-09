import type { Route } from "@angular/router";

export default [
  {
    path: "",
    loadComponent: () => import("./theme-builder-page.component").then((m) => m.ThemeBuilderPage),
  },
] satisfies Route[];
