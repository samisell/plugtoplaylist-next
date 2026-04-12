"use client";

export { useAuth } from "@/context/auth-context";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook to get current user
 * @returns User object or null if not authenticated
 */
export function useUser() {
  const { user } = useAuth();
  return user;
}

/**
 * Hook to get authentication session
 * @returns Session info with user and auth status
 */
export function useSession() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  return {
    user,
    isLoading,
    isAuthenticated,
    status: isLoading ? "loading" : isAuthenticated ? "authenticated" : "unauthenticated",
  };
}

/**
 * Hook to require authentication
 * Redirects to login if user is not authenticated
 */
export function useRequireAuth() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  return { user, isLoading, isAuthenticated: !!user };
}

/**
 * Hook to require user NOT to be authenticated
 * Redirects to dashboard if user is authenticated
 */
export function useRequireGuest() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  return { isLoading, isGuest: !user };
}
