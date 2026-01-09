"use client";

/**
 * Tasks page - Main task management interface.
 * Per specs/ui/pages.md and specs/features/task-crud.md
 */
import { useState, useEffect, useCallback } from "react";
import { useSession, getApiToken } from "@/lib/auth";
import { tasksApi, Task, TaskCreate, TaskUpdate, ApiException } from "@/lib/api";
import { Button, ToastProvider, useToast } from "@/components/ui";
import { TaskList, TaskForm, DeleteConfirmModal } from "@/components/todo";

function TasksPageContent() {
  const { data: session } = useSession();
  const { showToast } = useToast();

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Get user ID from session
  const userId = session?.user?.id;

  // Fetch API token when session changes
  useEffect(() => {
    async function fetchToken() {
      if (session?.user) {
        const apiToken = await getApiToken();
        setToken(apiToken);
      }
    }
    fetchToken();
  }, [session]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!userId || !token) return;

    try {
      setIsLoading(true);
      const response = await tasksApi.list(userId, token);
      setTasks(response.tasks);
    } catch (error) {
      if (error instanceof ApiException) {
        showToast(error.detail, "error");
      } else {
        showToast("Failed to load tasks", "error");
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, token, showToast]);

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle create task
  const handleCreate = async (data: TaskCreate | TaskUpdate) => {
    if (!userId || !token) return;

    setIsSubmitting(true);
    try {
      const newTask = await tasksApi.create(userId, data as TaskCreate, token);
      // Optimistic update - add to beginning of list
      setTasks((prev) => [newTask, ...prev]);
      setIsFormOpen(false);
      showToast("Task created successfully", "success");
    } catch (error) {
      if (error instanceof ApiException) {
        showToast(error.detail, "error");
      } else {
        showToast("Failed to create task", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update task
  const handleUpdate = async (data: TaskCreate | TaskUpdate) => {
    if (!userId || !token || !selectedTask) return;

    setIsSubmitting(true);
    try {
      const updatedTask = await tasksApi.update(
        userId,
        selectedTask.id,
        data as TaskUpdate,
        token
      );
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
      setIsFormOpen(false);
      setSelectedTask(null);
      showToast("Task updated successfully", "success");
    } catch (error) {
      if (error instanceof ApiException) {
        showToast(error.detail, "error");
      } else {
        showToast("Failed to update task", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle toggle complete
  const handleToggleComplete = async (taskId: number) => {
    if (!userId || !token) return;

    // Find task for optimistic update
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );

    try {
      await tasksApi.toggleComplete(userId, taskId, token);
    } catch (error) {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, completed: task.completed } : t
        )
      );
      if (error instanceof ApiException) {
        showToast(error.detail, "error");
      } else {
        showToast("Failed to update task", "error");
      }
    }
  };

  // Handle delete task
  const handleDelete = async () => {
    if (!userId || !token || !selectedTask) return;

    setIsDeleting(true);
    try {
      await tasksApi.delete(userId, selectedTask.id, token);
      // Remove from list
      setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
      showToast("Task deleted successfully", "success");
    } catch (error) {
      if (error instanceof ApiException) {
        showToast(error.detail, "error");
      } else {
        showToast("Failed to delete task", "error");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Open create form
  const openCreateForm = () => {
    setFormMode("create");
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  // Open edit form
  const openEditForm = (task: Task) => {
    setFormMode("edit");
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  // Open delete confirmation
  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">My Tasks</h1>
          <p className="mt-1 text-gray-600">
            {tasks.length === 0
              ? "Create your first task to get started"
              : `${tasks.filter((t) => !t.completed).length} of ${tasks.length} tasks remaining`}
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Task
        </Button>
      </div>

      {/* Task list */}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onToggleComplete={handleToggleComplete}
        onEdit={openEditForm}
        onDelete={openDeleteModal}
        onCreateClick={openCreateForm}
      />

      {/* Create/Edit form modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTask(null);
        }}
        mode={formMode}
        task={selectedTask}
        onSubmit={formMode === "create" ? handleCreate : handleUpdate}
        isSubmitting={isSubmitting}
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default function TasksPage() {
  return (
    <ToastProvider>
      <TasksPageContent />
    </ToastProvider>
  );
}
