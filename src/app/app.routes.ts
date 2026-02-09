import { Route } from "@angular/router";

export const appRoutes: Route[] = [
  {
    path: "",
    children: [
      {
        path: "theme-builder",
        loadChildren: () => import("./features/theme-builder/theme-builder.routes"),
      },
      {
        path: "form-builder",
        loadChildren: () => import("./features/form-builder/form-builder.routes"),
      },
    ],
  },
];
