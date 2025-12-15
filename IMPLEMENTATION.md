# Implementation Documentation

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js v16 or higher
- npm or yarn

### How to Run

```bash
# Install dependencies
npm install

# Start mock API server (in one terminal)
npm run api

# Start React app (in another terminal)
npm run dev
```

The API will be accessible at `http://localhost:3001` and the app at `http://localhost:5173`.

For tests:

```bash
npm test
```

## 🏗️ Technical Choices

### Architecture

Modular structure with clear separation of concerns:

- **Pages** : LoginPage, DashboardPage (routing)
- **Components** : Reusable UI (shadcn/ui) + business components (todos, layout, auth)
- **Hooks** : React Query logic for data management
- **Stores** : Zustand for global authentication state
- **Lib** : API utilities, validation, helpers

This architecture enables easy maintenance and progressive evolution.

### State Management

- **Zustand** with persist for auth: simple, lightweight, no boilerplate. Session is persisted in localStorage.
- **TanStack Query** for all server state (todos, lists, stats): automatic caching, smart refetching, loading/error state management.
- **useState** local for UI-only state (filters, open dialogs, etc.).

This separation avoids unnecessary re-renders and simplifies async data handling.

### Styling

**Tailwind CSS** + **shadcn/ui**:

- Used Tailwind for rapid development and design consistency. I already have strong experience with Tailwind, which helped me structure the UI efficiently.
- shadcn/ui for accessible, customizable React components (dialogs, forms, sidebar)
- Dark mode with `next-themes` and a toggle in the sidebar
- Subtle animations utilizing Framer Motion for smooth transitions

This utility-first methodology speeds up styling and avoids custom CSS, providing both flexibility and maintainability.

### Testing

Unit tests with **Vitest** + **Testing Library**:

- Tests for `CreateTodoForm` (validation, interactions, accessibility)
- Focus on critical paths rather than exhaustive coverage
- Mock React Query hooks to isolate tests

## ✨ Implemented Features

### Core Features

- [x] Login page with authentication (Zod validation, error handling, loading state)
- [x] Todo lists display (responsive grid with skeletons)
- [x] Todos display within lists (cards with priority, dates, descriptions)
- [x] Mark todos as completed (toggle with toast feedback)
- [x] Create new todos (dialog with complete form: title, description, priority, date)
- [x] User sidebar with information (avatar, name, email, role)

### Bonus Features

- [x] **Filters** : All / Active / Completed with counters
- [x] **Sorting** : by priority (high/low), date (nearest/farthest), creation (newest/oldest)
- [x] **Edit/Delete** : Edit via dialog, delete with confirmation
- [x] **Statistics** : Total tasks, completed, completion rate in sidebar
- [x] **Logout** : Button in sidebar with redirect
- [x] **Dark mode** : Toggle in sidebar, theme persistence
- [x] **Animations** : Framer Motion for lists and transitions
- [x] **Loading states** : Skeletons during loading
- [x] **Tests** : Unit tests for CreateTodoForm

**Not implemented**: Task search (did not have time and wasn't critical for the demo)

## 📚 Libraries & Dependencies

| Library               | Purpose             | Why?                                        |
| --------------------- | ------------------- | ------------------------------------------- |
| React 19              | UI Framework        | Modern version with better performance      |
| TypeScript            | Type safety         | Fewer bugs, better DX                       |
| Vite                  | Build tool          | Fast HMR, quick builds                      |
| React Router v7       | Routing             | Simple and performant navigation            |
| Zustand               | Global state (auth) | Lightweight, simple API, built-in persist   |
| TanStack Query        | Server state        | Automatic cache, refetching, error handling |
| React Hook Form + Zod | Forms & validation  | Performant, type-safe validation            |
| Tailwind CSS          | Styling             | Speed, consistency, no custom CSS           |
| shadcn/ui             | UI components       | Accessible, customizable, based on Radix    |
| Framer Motion         | Animations          | Simple API, performant                      |
| Vitest                | Testing             | Fast, Vite-compatible                       |
| Sonner                | Toasts              | Elegant notifications                       |

## ⏱️ Time Spent

**Total time:** ~7 hours

**Breakdown:**

- Setup & configuration (Vite, TypeScript, shadcn, routing): ~45 min
- Core features (login, lists, todos, create): ~3h
- Bonus features (filters, sorting, edit, stats, dark mode): ~2h
- Styling & polish (animations, skeletons, responsive): ~45 min
- Tests: ~30 min

## 🚧 Future Improvements

With more time, I would add:

1. **Task search** : Search input with debounce, search in title/description
2. **List virtualization** : To handle 100+ todos per list (currently fine with <50 per list)
3. **Drag & drop** : Reorder todos, move between lists
4. **Notifications** : Reminders for tasks with due dates
5. **Integration tests** : End-to-end scenarios (login → create todo → toggle)

### Performance Optimizations (handling 1000+ tasks)

**Pagination** (implemented):

- I actually chose classic pagination for long lists (10 tasks per page + "Load more") which is much simpler and UX-friendly for this context.
- Works well up to several hundred tasks before rendering becomes an issue.

**List Virtualization** (@tanstack/react-virtual):

- Would render only visible todos (+ overscan) for massive lists.
- Makes sense if you expect 100s-1000s of items.

**My choice:** For this test, classic pagination was more than enough (my lists had <50 items. Virtualization would have been overkill in this context. However, if this were a real backend/API call with potentially very large datasets, virtualization would not be overkill and could become necessary for performance.

## 🤔 Challenges & Learnings

### Authentication Without a Real Backend

**Challenge:** Implement the authentication flow without a real backend, while preserving a production-ready structure.

**Solution:** Mock the authentication by:

- Fetching all users (small dataset)
- Generating mock JWT tokens
- Replicating the real API structure
- Documenting limitations clearly in code comments

### Error Handling Patterns

**Challenge:** Consistent error handling across the application with proper user feedback and TypeScript typing.

**Solution:** Created a custom `ApiError` class that extends `Error` with a `status` property. This allows:

- Type-safe error handling
- Different error messages based on status codes
- Network error detection (status 0)
- Consistent error display in UI

## 📝 Notes

- Authentication is mocked client-side (no real JWT). In production, use a real backend with tokens.
- API server (json-server) has a 300ms delay to simulate a real API.
- No network error handling on API side (timeout, retry): easily addable with React Query.
