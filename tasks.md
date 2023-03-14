# Financial Tracker - Task Management

## Project Description

This Angular project is a financial tracker application designed to help users manage their recurring and one-time expenses. The application will allow users to track expenses, categorize them, and view payment histories.

## Data Structure Guidelines

### Expense

- **Required Fields:**

  - `uuid`: Unique identifier for each expense
  - `title`: Name/title of the expense
  - `startDate`: When the expense begins
  - `recurrency`: How often the expense occurs (monthly, yearly)
  - `category`: Type/category of expense

- **Optional Fields:**
  - `endDate`: When the expense ends (null for ongoing expenses)
  - `paymentMethod`: Method of payment (credit card, bank transfer, etc.)
  - `description`: Additional notes about the expense
  - `payments`: List of individual payments for this expense

### Payment

- **Required Fields:**
  - `uuid`: Unique identifier for each payment
  - `paymentDate`: Date when payment was made
  - `value`: Amount paid

## Tasks

### Todo

- [ ] Set up basic project structure
- [ ] Create expense data models based on guidelines
- [ ] Implement expense creation form
- [ ] Develop expense listing and filtering functionality
- [ ] Add payment tracking features
- [ ] Create summary/dashboard view
- [ ] Implement data persistence (local storage/backend)
- [ ] Add data export functionality
- [ ] Create documentation

### Ongoing

- [ ] Setting up project architecture

### Completed

- [x] Project initialization

## Development Guidelines

- Follow Angular best practices
- Implement proper state management with NgRx
- Create reusable components
- Write tests for components and services
- Follow proper Git workflow

### Component Requirements

- All components must be standalone (default is true)
- Change detection must be OnPush for all components
- View encapsulation must be set to None
- Templates must be inline (no separate HTML files)
- Styles must be inline (no separate CSS/SCSS files)
- Always use Angular's built-in control flow syntax (@if, @for, etc.)
- Use the inject() function for dependency injection instead of constructor injection
