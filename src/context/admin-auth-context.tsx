"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  display_name?: string;
  role: string;
  metadata?: {
    referral_code?: string;
    referralCode?: string;
  };
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AdminUser>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AdminUser | null>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load admin from session cookie on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/auth");
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setAdmin(data.user);
          }
        }
      } catch (error) {
        console.error("Failed to initialize admin auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<AdminUser> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Admin login failed");
      }

      const data = await response.json();
      setAdmin(data.user);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });

      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async (): Promise<AdminUser | null> => {
    try {
      const response = await fetch("/api/admin/auth");
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setAdmin(data.user);
          return data.user;
        }
      }
      setAdmin(null);
      return null;
    } catch (error) {
      console.error("Failed to refresh admin session:", error);
      return null;
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, isAuthenticated: !!admin, login, logout, refreshSession }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}

export function useAdmin() {
  const { admin } = useAdminAuth();
  return admin;
}

export function useAdminSession() {
  const { isLoading, isAuthenticated } = useAdminAuth();
  return { isLoading, isAuthenticated };
}

export function useRequireAdminAuth() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = require("next/navigation").useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, router]);
}
