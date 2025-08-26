// components/AdminUsersTable.tsx
"use client";

import React, { useEffect, useState } from "react";

type UserRow = {
  id: string;
  name?: string | null;
  email: string;
  role: "PARTNER" | "ADMIN" | "SUPERUSER";
  phone?: string | null;
  country?: string | null;
  companyName?: string | null;
  createdAt?: string;
};

export default function AdminUsersTable({ initialUsers }: { initialUsers: UserRow[] }) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setUsers(initialUsers), [initialUsers]);

  async function reload(q?: string) {
    try {
      setLoading(true);
      const url = new URL("/api/admin/users", location.origin);
      if (q) url.searchParams.set("q", q);
      const res = await fetch(url.toString());
      const js = await res.json();
      if (!res.ok) throw new Error(js?.error || "Failed");
      setUsers(js.users);
    } catch (err: any) {
      setError(err?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(u: UserRow) {
    if (!confirm(`Delete user ${u.email}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
      const js = await res.json();
      if (!res.ok) throw new Error(js?.error || "Failed");
      setUsers((s) => s.filter((x) => x.id !== u.id));
    } catch (err: any) {
      alert(err?.message || "Delete failed");
    }
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      const payload: any = {
        name: editing.name,
        phone: editing.phone,
        country: editing.country,
        companyName: editing.companyName,
      };
      const res = await fetch(`/api/admin/users/${editing.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const js = await res.json();
      if (!res.ok) throw new Error(js?.error || "Failed to update");
      setUsers((s) => s.map((u) => (u.id === editing.id ? { ...u, ...js.user } : u)));
      setEditing(null);
    } catch (err: any) {
      alert(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="px-3 py-2 border rounded w-full md:w-1/3"
        />
        <button onClick={() => reload(search)} className="px-3 py-2 bg-[#800000] text-white rounded">Search</button>
        <button onClick={() => { setSearch(""); reload(); }} className="px-3 py-2 border rounded">Reset</button>
        <div className="ml-auto text-sm text-gray-500">{users.length} users</div>
      </div>

      {/* Table for md+ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left text-xs text-gray-600 border-b">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Company</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">Created</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="py-2">{u.name ?? <span className="text-sm text-gray-400">—</span>}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2"><span className="text-sm font-medium">{u.role}</span></td>
                <td className="py-2">{u.companyName ?? "—"}</td>
                <td className="py-2">{u.phone ?? "—"}</td>
                <td className="py-2">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(u)} className="px-2 py-1 border rounded text-sm">Edit</button>
                    <button onClick={() => handleDelete(u)} className="px-2 py-1 border rounded text-sm text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr><td colSpan={7} className="py-4 text-sm text-gray-500">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-3">
        {users.map((u) => (
          <div key={u.id} className="bg-white border rounded-lg p-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-700">
                {(u.name || u.email || "A")[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{u.name ?? <span className="text-gray-500">—</span>}</div>
                    <div className="text-sm text-gray-500">{u.email}</div>
                    <div className="text-xs text-gray-500 mt-1">{u.companyName ?? ""}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">{u.role}</div>
                    <div className="text-xs text-gray-400">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}</div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button onClick={() => setEditing(u)} className="flex-1 px-3 py-2 border rounded text-sm">Edit</button>
                  <button onClick={() => handleDelete(u)} className="flex-1 px-3 py-2 border rounded text-sm text-red-600">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <div className="bg-white p-6 rounded shadow z-10 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-2">Edit user</h3>

            <label className="block mb-2">
              <div className="text-sm">Name</div>
              <input className="w-full px-3 py-2 border rounded" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </label>

            <label className="block mb-2">
              <div className="text-sm">Phone</div>
              <input className="w-full px-3 py-2 border rounded" value={editing.phone ?? ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
            </label>

            <label className="block mb-2">
              <div className="text-sm">Country</div>
              <input className="w-full px-3 py-2 border rounded" value={editing.country ?? ""} onChange={(e) => setEditing({ ...editing, country: e.target.value })} />
            </label>

            <label className="block mb-4">
              <div className="text-sm">Company</div>
              <input className="w-full px-3 py-2 border rounded" value={editing.companyName ?? ""} onChange={(e) => setEditing({ ...editing, companyName: e.target.value })} />
            </label>

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-3 py-2 border rounded">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-3 py-2 bg-[#800000] text-white rounded">{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  );
}
