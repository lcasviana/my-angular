import { importProvidersFrom, provideExperimentalZonelessChangeDetection } from "@angular/core";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";

import { provideStore } from "@ngrx/store";

import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserModule), provideAnimations(), provideExperimentalZonelessChangeDetection(), provideStore()],
}).catch(err => console.error(err));
