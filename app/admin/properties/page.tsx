// app/admin/properties/page.tsx
import React from "react";
import prisma from "@/lib/prisma";
import { requireAdminServer } from "@/lib/admin";
import AdminLayout from "@/components/AdminLayout";
import AdminPropertiesTable from "@/components/AdminPropertiesTable";

export default async function AdminPropertiesPage({ searchParams }: any = {}) {
  const session = await requireAdminServer();
  if (!session) return <div className="p-8">Unauthorized</div>;

  const rawFilter = searchParams?.filter;
  const filter = Array.isArray(rawFilter) ? rawFilter[0] : rawFilter ?? "";
  const where: any = {};
  if (filter === "featured") where.featured = true;

  const props = await prisma.property.findMany({
    where,
    include: { owner: { select: { id: true, name: true, email: true } }, images: true },
    orderBy: { updatedAt: "desc" },
    take: 1000,
  });

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold mb-4">Properties</h2>
      <div className="bg-white p-4 rounded shadow">
        <AdminPropertiesTable initialProperties={props} />
      </div>
    </AdminLayout>
  );
}
