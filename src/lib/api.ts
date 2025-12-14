import type { ApiTodo, ApiTodoList, Todo, TodoList, User } from "@/types";

const API_BASE_URL = "http://localhost:3001";

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(`API Error: ${response.statusText}`, response.status);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network error or other fetch failure
    throw new ApiError(
      "Network error. Please check your connection and ensure the API server is running.",
      0
    );
  }
}

interface ApiUser {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * API Client for Wimi Todo App
 *
 * Note: Authentication is mocked client-side for this test.
 * In production, auth would use:
 * - POST /auth/login with credentials in body
 * - Server-side password hashing (bcrypt)
 * - Real JWT tokens from backend
 */

async function loginUser(
  credentials: LoginCredentials
): Promise<{ user: User; token: string }> {
  const { email, password } = credentials;

  // Fetch all users (OK for mock with ~3 users in db.json)
  const users = await fetchApi<ApiUser[]>("/users");

  const apiUser = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!apiUser) {
    throw new ApiError("Invalid email or password", 401);
  }

  const user: User = {
    id: String(apiUser.id),
    email: apiUser.email,
    name: `${apiUser.firstName} ${apiUser.lastName}`,
  };

  const token = `mock-jwt-${apiUser.id}-${Date.now()}`;

  return { user, token };
}

/**
 * Fetch all todo lists for a specific user
 */
async function fetchTodoLists(userId: string): Promise<TodoList[]> {
  const apiTodoLists = await fetchApi<ApiTodoList[]>(
    `/todoLists?userId=${userId}`
  );

  return apiTodoLists.map((apiList) => ({
    id: String(apiList.id),
    title: apiList.title,
    userId: String(apiList.userId),
    color: apiList.color,
    createdAt: apiList.createdAt,
  }));
}

/**
 * Fetch all todos for a specific todo list
 */
async function fetchTodos(todoListId: string): Promise<Todo[]> {
  const apiTodos = await fetchApi<ApiTodo[]>(`/todos?todoListId=${todoListId}`);

  return apiTodos.map((apiTodo) => ({
    id: String(apiTodo.id),
    title: apiTodo.title,
    description: apiTodo.description,
    completed: apiTodo.completed,
    todoListId: String(apiTodo.todoListId),
    priority: apiTodo.priority,
    dueDate: apiTodo.dueDate,
    createdAt: apiTodo.createdAt,
  }));
}

/**
 * Update a todo (typically used for toggling completion status)
 */
async function updateTodo(
  todoId: string,
  updates: Partial<Omit<Todo, "id">>
): Promise<Todo> {
  const apiTodo = await fetchApi<ApiTodo>(`/todos/${todoId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

  return {
    id: String(apiTodo.id),
    title: apiTodo.title,
    description: apiTodo.description,
    completed: apiTodo.completed,
    todoListId: String(apiTodo.todoListId),
    priority: apiTodo.priority,
    dueDate: apiTodo.dueDate,
    createdAt: apiTodo.createdAt,
  };
}

/**
 * Create a new todo
 */
async function createTodo(data: Omit<Todo, "id" | "createdAt">): Promise<Todo> {
  const apiTodo = await fetchApi<ApiTodo>("/todos", {
    method: "POST",
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      completed: data.completed ?? false,
      todoListId: Number(data.todoListId),
      priority: data.priority,
      dueDate: data.dueDate,
    }),
  });

  return {
    id: String(apiTodo.id),
    title: apiTodo.title,
    description: apiTodo.description,
    completed: apiTodo.completed,
    todoListId: String(apiTodo.todoListId),
    priority: apiTodo.priority,
    dueDate: apiTodo.dueDate,
    createdAt: apiTodo.createdAt,
  };
}

export {
  ApiError,
  createTodo,
  fetchApi,
  fetchTodoLists,
  fetchTodos,
  loginUser,
  updateTodo,
};
