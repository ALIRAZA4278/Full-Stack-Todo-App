"use client";

/**
 * Auth layout - redirects authenticated users to /tasks.
 * Per specs/features/authentication.md - US-AUTH-5
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth";
import { Spinner } from "@/components/ui";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (session?.user) {
        // Authenticated users should go to tasks
        router.push("/tasks");
      } else {
        setIsChecking(false);
      }
    }
  }, [session, isPending, router]);

  // Show loading while checking auth
  if (isPending || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  // If authenticated, return null (redirect will happen)
  if (session?.user) {
    return null;
  }

  return <>{children}</>;
}
