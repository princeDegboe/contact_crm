# Contact CRM

## Project Description

Contact CRM is a mini CRM built with Angular and TypeScript. It lets users manage a local contact base: create, edit and delete contacts, organize them into color-coded categories, mark favorites, and search, filter and sort the list.

There is no backend or external API: all data is stored in the browser's `localStorage`, so it survives page refreshes.

### Features

- Dashboard with global statistics (total contacts, favorites, categories, latest additions, contacts per category)
- Contacts management (create, edit, delete) with a reactive form and strict validation
- Categories management (create, edit, delete). A category cannot be deleted while it still contains contacts
- Favorites page
- Search by name, filter by category or favorites only, sort by name (A–Z / Z–A) or by date (newest / oldest)
- Confirmation before any deletion

### Routes

| Route                  | Description                              |
| ---------------------- | ---------------------------------------- |
| `/`                    | Dashboard                                |
| `/contacts`            | List of all contacts                     |
| `/contacts/new`        | Create a contact                         |
| `/contacts/:id`        | Contact details                          |
| `/contacts/:id/edit`   | Edit a contact                           |
| `/categories`          | List of all categories                   |
| `/categories/new`      | Create a category                        |
| `/categories/:id`      | Category details and its contacts        |
| `/categories/:id/edit` | Edit a category                          |
| `/favorites`           | List of favorite contacts                |

## Technologies

- Angular 22 (standalone components, signals, built-in control flow, lazy-loaded routes)
- TypeScript in strict mode
- Angular Reactive Forms
- ESLint (angular-eslint) and Prettier
- Vitest (default test runner of the Angular CLI)
- Plain CSS, no UI component library

## Installation

Prerequisites: Node.js 22 or later and npm.

```bash
git clone <repository-url>
cd <repository-folder>/IDV-ANGU/day03/contact-crm
npm install
```

## Run the Project

```bash
npm start
```

`npm run dev` works as well. Then open http://localhost:4200 in your browser.

Other useful scripts:

```bash
npm run build    # production build
npm run lint     # run ESLint
npm run format   # format the code with Prettier
npm test         # run unit tests
```

## Architecture & Design Choices

```
src/app/
├── core/        # models, services (storage, contacts, categories), utilities
├── shared/      # reusable pieces (contact card component, validators)
├── layout/      # header, sidebar, footer
└── features/    # dashboard, contacts, categories, favorites
```

- **Feature-based structure.** Each section of the app lives in its own folder. Pages are standalone components loaded lazily through the router (`loadComponent`).
- **State with signals.** Each service owns a private writable signal and exposes a read-only version (`asReadonly()`), so components can read data but only the service can change it. Derived data (filtered lists, statistics) uses `computed()` and updates automatically.
- **Persistence layer.** `StorageService` only reads and writes lists in `localStorage` (JSON serialization, error handling). `ContactService` and `CategoryService` build on it. Replacing it with an HTTP backend later would only affect the services, not the components.
- **Business rules in services.** For example, deleting a category that still contains contacts is refused by `CategoryService`, whichever page triggers the deletion.
- **Reactive Forms and validation.** Required fields, a stricter email pattern than the built-in validator, and a custom phone validator. Error messages are shown per field.
- **Reusable component.** `ContactCard` receives a contact through `input()` and notifies its parent through `output()`; the contact list and the favorites page share it.
- **Strict typing.** TypeScript strict mode is enabled and ESLint forbids `any`. IDs are generated with `crypto.randomUUID()` and dates are stored as ISO strings.
- **Error handling.** Storage failures are caught and displayed to the user instead of crashing the app.

## Author

Prince