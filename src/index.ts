import { importProvidersFrom, provideZonelessChangeDetection } from "@angular/core";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";

import { App } from "./app/app.component";
import { appRoutes } from "./app/app.routes";

bootstrapApplication(App, {
  providers: [importProvidersFrom(BrowserModule), provideRouter(appRoutes), provideZonelessChangeDetection()],
}).catch((error) => console.error(error));
