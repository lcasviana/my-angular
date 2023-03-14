# Gemini Development Guidelines

This document provides guidelines for the Gemini AI assistant to ensure its contributions align with the project's standards, conventions, and architecture. Adhere strictly to these rules when generating or modifying code.

## 1. Core Technologies

- **Framework**: Angular v20 (Zoneless)
- **State Management**: NgRx Signal Store
- **Package Manager**: Bun
- **UI Components**: PrimeNG
- **Styling**: TailwindCSS
- **Linting**: ESLint & Prettier (enforced by Husky)

## 2. Development Rules

### 2.1. Angular Component Authoring

All Angular components **MUST** adhere to the following structure and rules:

- **Standalone**: Components must be `standalone: true`.
- **Change Detection**: Use `changeDetection: ChangeDetectionStrategy.OnPush`.
- **View Encapsulation**: Set `encapsulation: ViewEncapsulation.None` to allow global styles (TailwindCSS) to apply.
- **Inline Template**: Must be an inline string using backticks. No external HTML files.
- **Inline Styles**: Must be an inline string using backticks. No external CSS files or style arrays.
- **Control Flow**: Use built-in control flow syntax (`@if`, `@for`, `@switch`).
- **Dependency Injection**: Use the `inject()` function. **DO NOT** use constructor injection.
- **Selector Prefix**: All component selectors must have the `my-` prefix (e.g., `my-expense-form`).
- **Signal-based Features**: Use `input()`, `output()`, and `viewChild()` as readonly signals.
- **Immutability**: Use `readonly` for properties wherever possible.
- **Routing**: Routes must be defined using standalone components. Do not use NgModules.

**Component Example:**

```typescript
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input } from "@angular/core";

import { ChildComponent } from "./child.component";
import { SomeService } from "./some.service";

@Component({
  selector: "my-example",
  template: `
    @if (thing(); as thing) {
      <h1>{{ thing.name }}</h1>
      <my-child [thing]="thing" />
    }
  `,
  styles: `
    .my-example {
      display: block;
    }
  `,
  host: { class: "my-example" },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ChildComponent],
})
export class ExampleComponent {
  readonly #someService = inject(SomeService);
  readonly thing = input.required();
}
```

### 2.2. State Management (NgRx Signal Store)

- **Organization**: Use a feature-based approach. Create a separate store for each primary feature (e.g., `expenses.store.ts`, `payments.store.ts`).
- **Structure**: Organize stores functionally using `withState`, `withComputed`, `withMethods`, and `withHooks`.
- **State Updates**: Use the functional `patchState` for immutable state updates.
- **Initialization**: Use `withHooks` for lifecycle logic, such as fetching initial data when the store is initialized.

### 2.3. Data Models & Services

- **Data Structures**: Adhere to the defined `Expense` and `Payment` models located in `src/app/models`.
- **Timezone**: All dates (`startDate`, `endDate`, `date`) **MUST** be handled and stored in GMT+0.
- **Services**: Contain business logic and data manipulation. Inject services into components or stores using `inject()`.

### 2.4. General Guidelines

- **File Structure**: Follow the existing project structure (`components`, `services`, `store`, `models`, etc.).
- **Tooling**: All code must pass ESLint and Prettier checks. Use `bun` for package management.
- **Git**: Follow conventional Git workflow practices.

## 3. Business Logic

This Angular project is a financial tracker application designed to help users manage their recurring and one-time expenses. The application will allow users to track expenses and view payment histories.

### 3.1 Expenses

- **Required Fields:**
  - `uuid`: Unique identifier for each expense
  - `title`: Name/title of the expense
  - `category`: Type/category of expense
  - `startDate`: When the expense begins (stored in GMT+0)
  - `recurrence`: How often the expense occurs (monthly, yearly)

- **Optional Fields:**
  - `description`: Additional notes about the expense
  - `endDate`: When the expense ends (null for ongoing expenses) (stored in GMT+0)
  - `paymentMethod`: Method of payment (credit card, bank transfer, etc.)
  - `payments`: List of individual payments for this expense

### 3.2 Payments

- **Required Fields:**
  - `uuid`: Unique identifier for each payment
  - `date`: Date when payment was made (stored in GMT+0)
  - `value`: Amount paid
