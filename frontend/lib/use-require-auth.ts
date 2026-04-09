"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function useRequireAuth(role?: "student" | "parent") {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (role && user.role !== role) {
      router.push(user.role === "student" ? "/dashboard/student" : "/dashboard/parent");
    }
  }, [user, isLoading, role, router]);

  return { user, isLoading };
}
