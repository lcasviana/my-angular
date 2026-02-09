import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CssVariableApplierService {
  applySystemVariables(element: HTMLElement, variables: Record<string, string>): void {
    for (const [name, value] of Object.entries(variables)) {
      element.style.setProperty(`--mat-sys-${name}`, value);
    }
  }

  applyComponentVariables(element: HTMLElement, variables: Record<string, string>): void {
    for (const [name, value] of Object.entries(variables)) {
      element.style.setProperty(`--mat-${name}`, value);
    }
  }

  clearAllVariables(element: HTMLElement): void {
    element.removeAttribute("style");
  }
}
