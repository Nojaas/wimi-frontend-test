# Wimi - Frontend Engineer Technical Test

Welcome to the technical test for the **Frontend Engineer React** position at Wimi! 🚀

## 📋 Context

You will create a task management application (Todo Lists) using React and TypeScript.
This application will allow users to log in, view their task lists, and create new tasks.

## 🎯 Exercise Objectives

This exercise aims to evaluate:

- Your mastery of **React** and **TypeScript**
- Your ability to create **modular and reusable interfaces**
- Your understanding of **best practices** (architecture, tests, performance)
- Your sense of **product** and **UX**

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone this repository

```bash
git clone <https://github.com/Nojaas/wimi-frontend-test.git>
cd wimi-frontend-test
```

2. Install dependencies

```bash
npm install
```

3. Start the mock API server

```bash
npm run api
```

4. Start React App

```bash
npm run dev
```

The API server will be accessible at `http://localhost:3001` and the React App at `http://localhost:5173`

### Available API Endpoints

The mocked REST API provides the following endpoints:

#### Authentication & Users

- `GET /users` - List all users
- `GET /users/:id` - Get a user by ID
- `GET /users?email={email}&password={password}` - Authentication (used for login)

#### Todo Lists

- `GET /todoLists` - List all todo lists
- `POST /todoLists` - Create a new list
- `PUT /todoLists/:id` - Update a list
- `DELETE /todoLists/:id` - Delete a list

#### Todos

- `GET /todos` - List all tasks
- `POST /todos` - Create a new task
- `PUT /todos/:id` - Update a task
- `PATCH /todos/:id` - Partially update a task
- `DELETE /todos/:id` - Delete a task

### Test Credentials

Use these credentials to log in:

| Email                  | Password    | Name       |
| ---------------------- | ----------- | ---------- |
| john.doe@example.com   | password123 | John Doe   |
| jane.smith@example.com | password123 | Jane Smith |
| bob.wilson@example.com | password123 | Bob Wilson |

## 📝 Expected Features

### 1. Login Page ✅

**Required:**

- Form with email and password
- Basic validation
- Error handling
- Redirect after successful login

**Bonus points:**

- Request loading state
- Session persistence
- Clear error messages and polished UX

### 2. Main View - Todo Lists & Todos ✅

**Required:**

- Display todo lists for the logged-in user
- Display todos for each list
- Ability to mark a task as completed
- **Main feature: Create a new task**

**Bonus points:**

- Filters (all/completed/in progress)
- Task search
- Task sorting (by date, priority)
- Edit/delete tasks
- Smooth animations and transitions
- List virtualization for performance optimization

### 3. Sidebar - User Information ✅

**Required:**

- User avatar

**Bonus points:**

- Profile menu (name, role)
- Statistics (number of tasks, completion rate)
- Logout button
- Dark/light theme

## 🏗️ Expected Architecture & Best Practices

### Component Structure

- **Modular and reusable** components
- Separation of concerns
- Props typed with TypeScript

### State Management

- Free choice: Context API, Redux, Zustand, or other
- Well-thought-out local vs global state

### Tests (highly appreciated)

- Component unit tests
- Integration tests if relevant

### Performance

- Relevant optimizations
- Component lazy loading

### Code Quality

- Clean and readable code
- Consistent naming conventions
- Relevant comments

## 🎨 Design & UX

You are **free with the design**! We evaluate:

- Ergonomics and intuitiveness
- Visual consistency
- Attention to detail

## 📦 Deliverables

### What we expect

1. **Source code** of your React application
2. **Your own documentation** in `IMPLEMENTATION.md` file with:
   - Instructions to install and run your project
   - Technical choices and justifications
   - Future improvements you would consider
3. **Tests** (if implemented)

## ⏱️ Estimated Duration

**4 to 6 hours** depending on your level and implemented features.

**No pressure!** We prefer clean and well-thought code over a complete but rushed application.

## 💡 Tips

- ✅ Start simple, then iterate
- ✅ Document your technical choices
- ✅ Don't hesitate to propose improvements
- ❌ No need for over-engineering

## 🤔 Questions?

If you have questions during the test, feel free to:

- Document your assumptions in the `IMPLEMENTATION.md`
- Leave comments in your code
- Contact us at pierre-nicolas.morzy@wimi-teamwork.com

## 🎉 Good luck!

We look forward to seeing your creativity and technical expertise in action!

**The Wimi Tech Team** 🚀
