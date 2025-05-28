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

This project uses Angular v20 (Zoneless) with the following structure:

- Models: Define data structures (expense, payment)
- Components: UI elements following the requirements below
- Services: Business logic and data manipulation
- Store: Feature-based Signal Store management for the application

## Tasks

### Todo

- [ ] Implement data persistence (backend)
- [ ] Add data export functionality
- [ ] Create documentation
- [ ] Implement unit tests for components and services
- [ ] Add integration tests for store interactions
- [ ] Set up E2E testing
- [ ] Implement lazy loading for feature modules
- [ ] Add performance monitoring
- [ ] Optimize bundle size
- [ ] Implement virtual scrolling for large lists
- [ ] Add comprehensive error handling
- [ ] Implement loading states and skeleton screens
- [ ] Ensure responsive design
- [ ] Implement accessibility features (WCAG)
- [ ] Add keyboard navigation support
- [ ] Implement data validation and error handling
- [ ] Create data migration strategy
- [ ] Add backup and restore functionality
- [ ] Implement offline support
- [ ] Add data synchronization
- [ ] Implement security measures (XSS, CSRF, rate limiting)
- [ ] Set up error tracking
- [ ] Add user analytics
- [ ] Implement Storybook for component documentation
- [ ] Set up automated dependency updates
- [ ] Configure CI/CD pipeline
- [ ] Add multi-language support
- [ ] Implement currency formatting
- [ ] Add date/time localization
- [ ] Create expense templates feature
- [ ] Add bulk operations
- [ ] Implement advanced reporting
- [ ] Add budget planning features
- [ ] Create recurring payment scheduling
- [ ] Implement state persistence strategy
- [ ] Add state rehydration
- [ ] Implement optimistic updates

### Ongoing

- [ ] Enhance expense listing with advanced sorting options
- [ ] Implement feature modules organization
- [ ] Create shared module for common components
- [ ] Set up core module for singleton services
- [ ] Improve state management architecture

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

### Testing Requirements

- Unit tests must cover:
  - Component logic and rendering
  - Service functionality
  - Store operations
  - Data transformations
- Integration tests must verify:
  - Component interactions
  - Store integration
  - Service communication
- E2E tests must validate:
  - Critical user flows
  - Data persistence
  - Error scenarios
- Test coverage minimum: 80%

### Security Guidelines

- Implement input sanitization
- Add XSS protection
- Configure CSRF protection
- Set up rate limiting
- Implement security headers
- Follow OWASP security best practices
- Regular security audits

### Performance Guidelines

- Implement lazy loading
- Use virtual scrolling for large lists
- Optimize bundle size
- Monitor performance metrics
- Implement caching strategies
- Use web workers for heavy computations
- Optimize change detection

### Documentation Requirements

- API documentation
- Component documentation
- Setup and deployment guides
- Contributing guidelines
- Architecture documentation
- State management documentation
- Testing documentation
