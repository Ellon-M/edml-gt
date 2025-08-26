// app/admin/users/page.tsx
import React from "react";
import prisma from "@/lib/prisma";
import { requireAdminServer } from "@/lib/admin";
import AdminLayout from "@/components/AdminLayout";
import AdminUsersTable from "@/components/AdminUsersTable";

export default async function AdminUsersPage() {
  const session = await requireAdminServer();
  if (!session) return <div className="p-8">Unauthorized</div>;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, phone: true, country: true, companyName: true, createdAt: true },
    take: 1000,
  });

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      <div className="bg-white p-4 rounded shadow">
        <AdminUsersTable initialUsers={users} />
      </div>
    </AdminLayout>
  );
}
