import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

import { MyFormComponent, MyFormGroup } from "./components/form.component";
import { MyTableComponent } from "./components/table.component";

type Product = { id: number; name: string; price: number };

@Component({
  selector: "my-root",
  template: `
    <!-- <my-form [config]="config" /> -->
    <my-table [data]="data" [cols]="cols" />
  `,
  host: { class: "grid w-full h-full" },
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MyFormComponent, MyTableComponent],
})
export class AppComponent {
  protected readonly config: MyFormGroup = {
    name: "Personal Info",
    instance: "group",
    controls: [
      { name: "firstName", instance: "control", type: "text", value: "Lucas" },
      { name: "lastName", instance: "control", type: "text", value: "Viana" },
      { name: "birthDate", instance: "control", type: "text", value: "05-04-1995" },
      { name: "wife", instance: "control", type: "text", value: "Ingrid" },
    ],
  };

  protected readonly cols: Array<keyof Product> = ["id", "name", "price"];
  protected readonly data: Array<Product> = [
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
    { id: 3, name: "Product 3", price: 300 },
  ];
}
