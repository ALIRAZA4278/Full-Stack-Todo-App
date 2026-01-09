"use client";

/**
 * Skeleton loading placeholder component.
 * Per specs/ui/components.md
 */

export interface SkeletonProps {
  variant?: "text" | "title" | "avatar" | "card";
  width?: string;
  height?: string;
  className?: string;
}

const variantStyles = {
  text: "h-4 w-full rounded",
  title: "h-6 w-3/4 rounded",
  avatar: "h-10 w-10 rounded-full",
  card: "h-32 w-full rounded-lg",
};

export function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`animate-pulse bg-gray-200 ${variantStyles[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton for a task card.
 */
export function TaskCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex items-start gap-3">
        {/* Checkbox skeleton */}
        <Skeleton variant="avatar" width="20px" height="20px" className="mt-1" />

        <div className="flex-1 space-y-2">
          {/* Title skeleton */}
          <Skeleton variant="title" width="60%" />

          {/* Description skeleton */}
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="40%" />

          {/* Date skeleton */}
          <Skeleton variant="text" width="30%" className="mt-3" />
        </div>

        {/* Menu skeleton */}
        <Skeleton variant="avatar" width="24px" height="24px" />
      </div>
    </div>
  );
}
