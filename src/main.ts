import { importProvidersFrom, provideExperimentalZonelessChangeDetection } from "@angular/core";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";

import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserModule), provideAnimations(), provideExperimentalZonelessChangeDetection()],
}).catch(err => console.error(err));
