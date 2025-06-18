import { importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from "@angular/core";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withComponentInputBinding, withHashLocation } from "@angular/router";

import Aura from "@primeng/themes/aura";
import { providePrimeNG } from "primeng/config";

import { App } from "./app/app.component";
import { appRoutes } from "./app/app.routes";

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding(), withHashLocation()),
    provideZonelessChangeDetection(),
    providePrimeNG({ theme: { preset: Aura } }),
  ],
}).catch((error) => console.error(error));
