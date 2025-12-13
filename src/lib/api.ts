import type { User } from "@/types";

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

export { ApiError, fetchApi, loginUser };
