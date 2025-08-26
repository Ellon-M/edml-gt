// app/admin/reservations/page.tsx
import React from "react";
import { requireAdminServer } from "@/lib/admin";
import AdminLayout from "@/components/AdminLayout";

export default async function AdminReservationsPage() {
  const session = await requireAdminServer();
  if (!session) return <div className="p-8">Unauthorized</div>;

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold mb-4">Reservations</h2>
      <div className="bg-white p-6 rounded shadow text-gray-600">
        There are no reservations yet. This page will show active bookings and allow admins to manage them once reservations are implemented.
      </div>
    </AdminLayout>
  );
}
