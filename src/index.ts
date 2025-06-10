import { importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from "@angular/core";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withComponentInputBinding, withHashLocation } from "@angular/router";

import { App } from "./app/app.component";
import { appRoutes } from "./app/app.routes";

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding(), withHashLocation()),
    provideZonelessChangeDetection(),
  ],
}).catch((err) => console.error(err));
