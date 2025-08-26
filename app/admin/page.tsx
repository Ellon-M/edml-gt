// app/admin/page.tsx
import React from "react";
import prisma from "@/lib/prisma";
import { requireAdminServer } from "@/lib/admin";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
// render the existing unauthorized page when not allowed
import UnauthorizedPage from "@/app/unauthorized/page";

export default async function AdminHome() {
  const session = await requireAdminServer();
  if (!session) {
    // render the unauthorized page component in-place (URL remains /admin)
    return <UnauthorizedPage />;
  }

  const [usersCount, propertiesCount, featuredCount] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.property.count({ where: { featured: true } }),
  ]);

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <div className="p-4 bg-white rounded shadow">
            <div className="text-sm text-gray-500">Users</div>
            <div className="text-2xl font-semibold">{usersCount}</div>
            <div className="mt-3 text-sm">
              <Link href="/admin/users" className="text-[#800000] hover:underline">Manage users</Link>
            </div>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <div className="text-sm text-gray-500">Properties</div>
            <div className="text-2xl font-semibold">{propertiesCount}</div>
            <div className="mt-3 text-sm">
              <Link href="/admin/properties" className="text-[#800000] hover:underline">Manage properties</Link>
            </div>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <div className="text-sm text-gray-500">Featured</div>
            <div className="text-2xl font-semibold">{featuredCount}</div>
            <div className="mt-3 text-sm">
              <Link href="/admin/properties?filter=featured" className="text-[#800000] hover:underline">View featured</Link>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Admin quick actions</h3>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <Link href="/admin/users" className="p-3 border rounded text-center hover:shadow">Users</Link>
              <Link href="/admin/properties" className="p-3 border rounded text-center hover:shadow">Properties</Link>
              <Link href="/admin/reservations" className="p-3 border rounded text-center hover:shadow">Reservations</Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
