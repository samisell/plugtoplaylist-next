"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

interface LogoutButtonProps {
  isAdmin?: boolean;
  className?: string;
  showText?: boolean;
}

export function LogoutButton({ isAdmin = false, className = "", showText = true }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const endpoint = isAdmin ? "/auth/admin-sign-out" : "/auth/sign-out";
      
      // Call the sign-out endpoint which clears the session cookie
      const response = await fetch(endpoint, { method: "POST" });
      
      // The endpoint should redirect, but if it doesn't, we redirect manually
      if (response.ok || response.status === 303 || response.status === 307) {
        const redirectUrl = isAdmin ? "/admin/login" : "/login";
        router.push(redirectUrl);
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if there's an error
      const redirectUrl = isAdmin ? "/admin/login" : "/login";
      router.push(redirectUrl);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center gap-2 transition-colors disabled:opacity-50 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      {showText && <span>{isLoading ? "Logging out..." : "Log Out"}</span>}
    </button>
  );
}
