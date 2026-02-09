import { Route } from "@angular/router";

export default [
  {
    path: "",
    loadComponent: () => import("./form-builder-page.component").then((m) => m.FormBuilderPage),
  },
] satisfies Route[];
