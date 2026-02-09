import { DOCUMENT } from "@angular/common";
import { inject, Injectable } from "@angular/core";

export const GOOGLE_FONTS = [
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Inter",
  "Nunito",
  "Raleway",
  "Ubuntu",
  "Playfair Display",
  "Merriweather",
  "Source Sans 3",
  "Noto Sans",
  "Oswald",
  "Roboto Slab",
  "PT Sans",
  "Fira Sans",
  "Work Sans",
  "Rubik",
  "Cabin",
] as const;

@Injectable({ providedIn: "root" })
export class FontLoaderService {
  readonly #document = inject(DOCUMENT);
  readonly #loadedFonts = new Set<string>();

  loadFont(fontFamily: string): void {
    if (this.#loadedFonts.has(fontFamily)) return;

    const link = this.#document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@300;400;500;700&display=swap`;
    this.#document.head.appendChild(link);
    this.#loadedFonts.add(fontFamily);
  }
}
