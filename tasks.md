# Financial Tracker - Task Management

## Project Description

This Angular project is a financial tracker application designed to help users manage their recurring and one-time expenses. The application will allow users to track expenses, categorize them, and view payment histories.

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

This project uses Angular v19 (Zoneless) with the following structure:

- Models: Define data structures (expense, payment)
- Components: UI elements following the requirements below
- Services: Business logic and data manipulation
- Store: Feature-based Signal Store management for the application

## Tasks

### Todo

- [ ] Implement data persistence (backend)
- [ ] Add data export functionality
- [ ] Create documentation

### Ongoing

- [ ] Enhance expense listing with advanced sorting options

### Completed

- [x] Project initialization
- [x] Set up basic project structure
- [x] Create expense data models based on guidelines
- [x] Implement state management for expenses (using NgRx Signal Store)
- [x] Implement expense creation form
- [x] Develop expense listing functionality
- [x] Implement local storage persistence
- [x] Refactor to feature-based Signal Store architecture
- [x] Implement category-based filtering using Signal Store computed properties
- [x] Add date range filtering for expenses
- [x] Add payment tracking features
- [x] Standardize date handling to use GMT+0 timezone
- [x] Create summary/dashboard view

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

- Standalone as default (do not explicit set as true)
- Change detection must be OnPush (changeDetection: ChangeDetectionStrategy.OnPush)
- View encapsulation must be None (encapsulation: ViewEncapsulation.None)
- Template must be inline (no separate HTML files)
- Styles must be inline (no separate CSS files)
- Must use built-in control flow syntax (@if, @for, @switch, etc)
- Must use the inject() function for dependency injection instead of constructor injection
- Selector prefix must be "my" (example: "my-root")
- Must use readonly signal-based input(), output(), viewChild()
- Use readonly properties as much as possible
- Use Context7 as documentation reference

### Tooling

- **Package Manager**: Bun
- **CSS Framework**: TailwindCSS
- **Linting**: ESLint + Prettier (enforced via husky pre-commit hooks)
- **Build**: Angular CLI with custom configurations
