"use client";

/**
 * Textarea component with character count.
 * Per specs/ui/components.md
 */
import { forwardRef, TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      showCount = false,
      maxLength,
      value,
      className = "",
      id,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          maxLength={maxLength}
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          aria-required={required}
          className={`
            w-full px-3 py-2 text-base text-gray-800
            bg-white border rounded-md
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-colors duration-150 resize-none
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }
            ${className}
          `}
          {...props}
        />
        <div className="flex justify-between mt-1">
          {error ? (
            <p
              id={`${textareaId}-error`}
              className="text-sm text-red-600"
              role="alert"
            >
              {error}
            </p>
          ) : (
            <span />
          )}
          {showCount && maxLength && (
            <span
              className={`text-sm ${
                currentLength >= maxLength ? "text-red-500" : "text-gray-500"
              }`}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
