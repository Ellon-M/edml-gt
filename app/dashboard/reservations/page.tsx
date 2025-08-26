// app/dashboard/reservations/page.tsx
"use client";

import React from "react";
import Layout from "../../../components/AdminLayout";
import Card from "../../../components/Card";
import useRequireRole from "@/hooks/useRequireRole";
import Link from "next/link";

type Reservation = {
  id: string;
  guest: string;
  property: string;
  checkIn: string; // ISO date
  checkOut: string;
  nights: number;
  amount: number;
  status: "confirmed" | "pending" | "cancelled";
};

const MOCK: Reservation[] = [
  { id: "R-001", guest: "Alice Mwangi", property: "Kitwa Suite A", checkIn: "2025-09-01", checkOut: "2025-09-05", nights: 4, amount: 320, status: "confirmed" },
  { id: "R-002", guest: "John Doe", property: "Garden Studio", checkIn: "2025-09-10", checkOut: "2025-09-12", nights: 2, amount: 160, status: "pending" },
  { id: "R-003", guest: "Maria Silva", property: "Rooftop Loft", checkIn: "2025-08-28", checkOut: "2025-09-02", nights: 5, amount: 500, status: "confirmed" },
];

export default function ReservationsPage() {
  useRequireRole("PARTNER");

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Reservations</h2>
        <p className="text-sm text-gray-500">Search and manage upcoming reservations.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          {/* Table for md+ */}
          <table className="w-full border-collapse hidden md:table">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="py-3 px-4">Reservation</th>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-3 px-4 text-sm">{r.id}</td>
                  <td className="py-3 px-4 text-sm">{r.guest}</td>
                  <td className="py-3 px-4 text-sm">{r.property}</td>
                  <td className="py-3 px-4 text-sm">{r.checkIn} → {r.checkOut} ({r.nights} nights)</td>
                  <td className="py-3 px-4 text-right text-sm">KSh {r.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={
                      r.status === "confirmed" ? "text-green-700 bg-green-50 px-2 py-1 rounded text-xs" :
                      r.status === "pending" ? "text-yellow-700 bg-yellow-50 px-2 py-1 rounded text-xs" :
                      "text-red-700 bg-red-50 px-2 py-1 rounded text-xs"
                    }>{r.status}</span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/dashboard/reservations/${r.id}`}><span className="text-sm text-[#800000]">View</span></Link>
                      <button className="text-sm text-gray-500">Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile: card list */}
          <div className="space-y-3 md:hidden">
            {MOCK.map((r) => (
              <div key={r.id} className="bg-white p-4 rounded-md border shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-gray-500">{r.id}</div>
                    <div className="font-medium">{r.guest}</div>
                    <div className="text-xs text-gray-500">{r.property}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">KSh {r.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{r.nights} nights</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-gray-600">{r.checkIn} → {r.checkOut}</div>
                  <div>
                    <span className={
                      r.status === "confirmed" ? "text-green-700 bg-green-50 px-2 py-1 rounded text-xs" :
                      r.status === "pending" ? "text-yellow-700 bg-yellow-50 px-2 py-1 rounded text-xs" :
                      "text-red-700 bg-red-50 px-2 py-1 rounded text-xs"
                    }>{r.status}</span>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Link href={`/dashboard/reservations/${r.id}`}><span className="px-3 py-2 rounded border text-sm text-[#800000]">View</span></Link>
                  <Link href={``}><span className="px-3 py-2 rounded border text-sm text-gray-500">Cancel</span></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </Layout>
  );
}
