/**
 * API client with JWT token attachment.
 * Per specs/api/rest-endpoints.md
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Task type matching backend TaskResponse schema.
 */
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Task list response type.
 */
export interface TaskListResponse {
  tasks: Task[];
  count: number;
}

/**
 * Task create request type.
 */
export interface TaskCreate {
  title: string;
  description?: string | null;
}

/**
 * Task update request type.
 */
export interface TaskUpdate {
  title: string;
  description?: string | null;
}

/**
 * API error type.
 */
export interface ApiError {
  detail: string;
}

/**
 * Custom error class for API errors.
 */
export class ApiException extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
    this.name = "ApiException";
  }
}

/**
 * Make an authenticated API request.
 * Automatically attaches JWT token from Better Auth session.
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Get token from Better Auth session cookie
  // The token is automatically included via credentials: 'include'
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // Include cookies for authentication
  });

  // Handle no content response (DELETE)
  if (response.status === 204) {
    return undefined as T;
  }

  // Parse response
  const data = await response.json();

  // Handle errors
  if (!response.ok) {
    throw new ApiException(
      response.status,
      data.detail || "An unexpected error occurred"
    );
  }

  return data as T;
}

/**
 * Task API methods.
 */
export const tasksApi = {
  /**
   * List all tasks for the user.
   * GET /api/{userId}/tasks
   */
  list: async (userId: string, token: string): Promise<TaskListResponse> => {
    return apiRequest<TaskListResponse>(`/api/${userId}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /**
   * Create a new task.
   * POST /api/{userId}/tasks
   */
  create: async (
    userId: string,
    data: TaskCreate,
    token: string
  ): Promise<Task> => {
    return apiRequest<Task>(`/api/${userId}/tasks`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  /**
   * Get a single task by ID.
   * GET /api/{userId}/tasks/{taskId}
   */
  get: async (userId: string, taskId: number, token: string): Promise<Task> => {
    return apiRequest<Task>(`/api/${userId}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /**
   * Update a task.
   * PUT /api/{userId}/tasks/{taskId}
   */
  update: async (
    userId: string,
    taskId: number,
    data: TaskUpdate,
    token: string
  ): Promise<Task> => {
    return apiRequest<Task>(`/api/${userId}/tasks/${taskId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a task.
   * DELETE /api/{userId}/tasks/{taskId}
   */
  delete: async (
    userId: string,
    taskId: number,
    token: string
  ): Promise<void> => {
    await apiRequest<void>(`/api/${userId}/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /**
   * Toggle task completion status.
   * PATCH /api/{userId}/tasks/{taskId}/complete
   */
  toggleComplete: async (
    userId: string,
    taskId: number,
    token: string
  ): Promise<Task> => {
    return apiRequest<Task>(`/api/${userId}/tasks/${taskId}/complete`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
