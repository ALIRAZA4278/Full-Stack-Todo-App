"use client";

/**
 * Navigation component.
 * Per specs/ui/components.md
 */
import Link from "next/link";
import { UserMenu } from "./UserMenu";

interface NavigationProps {
  user?: {
    name?: string | null;
    email: string;
  } | null;
}

export function Navigation({ user }: NavigationProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={user ? "/tasks" : "/"}
            className="flex items-center gap-2 text-gray-800 hover:text-gray-600 transition-colors"
          >
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <span className="font-semibold text-lg">Hackathon Todo</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
