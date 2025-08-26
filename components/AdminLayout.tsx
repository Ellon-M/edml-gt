// components/AdminLayout.tsx
import React from "react";
import { requireAdminServer } from "@/lib/admin";
import { redirect } from "next/navigation";
import AdminHeader from "./AdminHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminServer();
  if (!session) {
    // Redirect to admin login so unauthorized users land on the login page
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8 flex-1">{children}</main>

      <footer className="border-t bg-white mt-auto">
        <div className="container mx-auto px-4 py-8 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Edmor Listings Admin Panel
        </div>
      </footer>
    </div>
  );
}
