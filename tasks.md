# Financial Tracker - Task Management

## Project Description

This Angular project is a financial tracker application designed to help users manage their recurring and one-time expenses. The application will allow users to track expenses and view payment histories.

## Data Structure Guidelines

### Expense

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

### Payment

- **Required Fields:**
  - `uuid`: Unique identifier for each payment
  - `date`: Date when payment was made (stored in GMT+0)
  - `value`: Amount paid

## Project Structure

This project uses Angular v20 (Zoneless) with the following structure:

- Models: Define data structures (expense, payment)
- Components: UI elements following the requirements below
- Services: Business logic and data manipulation
- Store: Feature-based Signal Store management for the application

## Development Guidelines

- Follow Angular best practices
- Use signal-based state management with NgRx Signal Store
  - Prefer feature-based organization (withState, withComputed, withMethods, withHooks)
  - Use functional patchState updates for immutable state changes
  - Leverage lifecycle hooks for initialization logic
- Create reusable components
- Write tests for components and services
- Follow proper Git workflow
- All dates must be handled as GMT+0 to ensure consistent timezone handling

### Component Requirements

- All components must be standalone
- Change detection must be OnPush (changeDetection: ChangeDetectionStrategy.OnPush)
- View encapsulation must be None (encapsulation: ViewEncapsulation.None)
- Template must be inline (no separate HTML files)
- Styles must be inline as a single string (no separate CSS files, no style arrays)
- Must use built-in control flow syntax (@if, @for, @switch, etc)
- Must use the inject() function for dependency injection instead of constructor injection
- Selector prefix must be "my" (example: "my-root")
- Must use readonly signal-based input(), output(), viewChild()
- Use readonly properties as much as possible
- Use Context7 as documentation reference
- Routes must be defined using standalone components directly, no NgModules

### Tooling

- **Package Manager**: Bun
- **Component Library**: PrimeNG
- **CSS Framework**: TailwindCSS
- **Linting**: ESLint + Prettier (enforced via Husky pre-commit hook)
- **Build**: Angular CLI with custom configurations
