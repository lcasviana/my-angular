import { Route } from "@angular/router";

export const appRoutes: Route[] = [
  {
    path: "",
    children: [
      {
        path: "button",
        loadComponent: () => import("./views/button-view.component").then((m) => m.ButtonView),
      },
    ],
  },
];
