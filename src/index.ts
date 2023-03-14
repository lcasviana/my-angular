import { importProvidersFrom, provideZonelessChangeDetection } from "@angular/core";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter, withComponentInputBinding, withHashLocation } from "@angular/router";

import Aura from "@primeng/themes/aura";
import { providePrimeNG } from "primeng/config";

import { App } from "./app/app.component";
import { appRoutes } from "./app/app.routes";

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideRouter(appRoutes, withComponentInputBinding(), withHashLocation()),
    provideZonelessChangeDetection(),
    // PrimeNG
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),
  ],
}).catch((error) => console.error(error));
