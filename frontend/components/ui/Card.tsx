"use client";

/**
 * Card container component.
 * Per specs/ui/components.md
 */
import { HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      className = "",
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = "bg-white border rounded-lg";

    // Variant styles
    const variantStyles = {
      default: "border-gray-200 shadow-sm",
      interactive:
        "border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-150 cursor-pointer",
      elevated: "border-gray-200 shadow-lg",
    };

    // Padding styles
    const paddingStyles = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
