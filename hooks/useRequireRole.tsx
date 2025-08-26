"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function useRequireRole(requiredRole: "PARTNER" | "ADMIN" | "SUPERUSER") {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }

    const role = (session.user as any).role as string | undefined;
    if (!role || role !== requiredRole) {
      router.replace("/unauthorized");
      return;
    }
  }, [session, status, router, requiredRole]);
}