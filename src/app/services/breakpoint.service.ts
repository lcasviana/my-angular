import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { inject, Injectable, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { map, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class BreakpointService {
  readonly #breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

  private matchBreakpoint(breakpoint: string): Observable<boolean> {
    return this.#breakpointObserver.observe(breakpoint).pipe(map(({ matches }) => matches));
  }

  readonly isTablet: Signal<boolean> = toSignal(this.matchBreakpoint(Breakpoints.Tablet), { initialValue: false });
}
