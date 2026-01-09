"use client";

/**
 * Delete confirmation modal component.
 * Per specs/ui/components.md
 */
import { Task } from "@/lib/api";
import { Button, Modal } from "@/components/ui";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  task,
  onConfirm,
  isDeleting,
}: DeleteConfirmModalProps) {
  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Task" size="sm">
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to delete &quot;{task.title}&quot;? This action
          cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            loading={isDeleting}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
