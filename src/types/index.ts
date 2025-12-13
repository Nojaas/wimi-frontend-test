export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  todoListId: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  createdAt?: string;
}

export interface TodoList {
  id: string;
  title: string;
  userId: string;
  color?: string;
  createdAt?: string;
}

// API response types (numbers from db.json)
export interface ApiTodo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  todoListId: number;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  createdAt?: string;
}

export interface ApiTodoList {
  id: number;
  title: string;
  userId: number;
  color?: string;
  createdAt?: string;
}
