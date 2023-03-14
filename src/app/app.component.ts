import { ChangeDetectionStrategy, Component, HostBinding } from "@angular/core";

import { MyButtonComponent, MyFormComponent, MyFormGroup } from "@/shared";

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: "my-root",
  template: `
    <button myButton appearance="contained" class="text-green-600" (click)="onClick()">Contained</button>
    <button myButton appearance="outlined" class="text-yellow-600" (click)="onClick()">Outlined</button>
    <button myButton appearance="text" class="text-red-600" (click)="onClick()">Text</button>
    <button myButton [disabled]="true" appearance="contained" class="text-green-600" (click)="onClick()">Contained</button>
    <button myButton [disabled]="true" appearance="outlined" class="text-yellow-600" (click)="onClick()">Outlined</button>
    <button myButton [disabled]="true" appearance="text" class="text-red-600" (click)="onClick()">Text</button>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MyButtonComponent, MyFormComponent],
})
export class AppComponent {
  @HostBinding("className") protected readonly className = "flex flex-col items-start w-full h-full";

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

  protected readonly cols: (keyof Product)[] = ["id", "name", "price"];
  protected readonly data: Product[] = [
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
    { id: 3, name: "Product 3", price: 300 },
  ];

  protected onClick(): void {
    alert("Clicked");
  }
}
