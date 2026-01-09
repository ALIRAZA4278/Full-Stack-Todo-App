"use client";

/**
 * TaskForm component for creating and editing tasks.
 * Per specs/ui/components.md
 */
import { useState, useEffect } from "react";
import { Task, TaskCreate, TaskUpdate } from "@/lib/api";
import { Button, Input, Textarea, Modal } from "@/components/ui";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  task?: Task | null;
  onSubmit: (data: TaskCreate | TaskUpdate) => Promise<void>;
  isSubmitting: boolean;
}

export function TaskForm({
  isOpen,
  onClose,
  mode,
  task,
  onSubmit,
  isSubmitting,
}: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen && mode === "edit" && task) {
      setFormData({
        title: task.title,
        description: task.description || "",
      });
    } else if (isOpen && mode === "create") {
      setFormData({ title: "", description: "" });
    }
    setErrors({});
  }, [isOpen, mode, task]);

  // Validate form
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be 200 characters or less";
    }

    if (formData.description.length > 1000) {
      newErrors.description = "Description must be 1000 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim() || null,
    });
  };

  const title = mode === "create" ? "Create Task" : "Edit Task";
  const submitText = mode === "create" ? "Create" : "Save";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="Enter task title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          error={errors.title}
          required
          disabled={isSubmitting}
          maxLength={200}
        />

        <Textarea
          label="Description"
          placeholder="Enter task description (optional)"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          error={errors.description}
          disabled={isSubmitting}
          maxLength={1000}
          showCount
          rows={4}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            {submitText}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
