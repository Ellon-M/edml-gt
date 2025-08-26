// components/AdminPropertiesTable.tsx
"use client";

import React, { useEffect, useState } from "react";

type PropertyRow = {
  id: string;
  title: string;
  city?: string | null;
  country?: string | null;
  price: number;
  featured?: boolean;
  owner?: { id: string; name?: string | null; email?: string | null };
  images?: { id: string; url: string }[];
  updatedAt?: string;
};

export default function AdminPropertiesTable({ initialProperties }: { initialProperties: PropertyRow[] }) {
  const [properties, setProperties] = useState<PropertyRow[]>(initialProperties);
  const [loading, setLoading] = useState(false);

  useEffect(() => setProperties(initialProperties), [initialProperties]);

  async function reload(q?: string) {
    setLoading(true);
    try {
      const url = new URL("/api/admin/properties", location.origin);
      if (q) url.searchParams.set("q", q);
      const res = await fetch(url.toString());
      const js = await res.json();
      if (!res.ok) throw new Error(js?.error || "Failed");
      setProperties(js.properties);
    } catch (err: any) {
      alert(err?.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(p: PropertyRow) {
    if (!confirm(`Delete property "${p.title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/properties/${p.id}`, { method: "DELETE" });
      const js = await res.json();
      if (!res.ok) throw new Error(js?.error || "Failed");
      setProperties((s) => s.filter((x) => x.id !== p.id));
    } catch (err: any) {
      alert(err?.message || "Delete failed");
    }
  }

  async function toggleFeatured(p: PropertyRow) {
    try {
      const res = await fetch(`/api/admin/properties/${p.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ featured: !p.featured }),
      });
      const js = await res.json();
      if (!res.ok) throw new Error(js?.error || "Failed");
      setProperties((s) => s.map((x) => (x.id === p.id ? { ...x, featured: js.property.featured } : x)));
    } catch (err: any) {
      alert(err?.message || "Toggle failed");
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => reload()} className="px-3 py-2 border rounded">Reload</button>
        <div className="ml-auto text-sm text-gray-500">{properties.length} properties</div>
      </div>

      {/* Table for md+ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left text-xs text-gray-600 border-b">
              <th className="py-2">Title</th>
              <th className="py-2">Owner</th>
              <th className="py-2">Location</th>
              <th className="py-2">Price</th>
              <th className="py-2">Featured</th>
              <th className="py-2">Images</th>
              <th className="py-2">Updated</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-2">{p.title}</td>
                <td className="py-2">{p.owner?.name ?? p.owner?.email ?? "—"}</td>
                <td className="py-2">{[p.city, p.country].filter(Boolean).join(", ") || "—"}</td>
                <td className="py-2">KSh {p.price.toLocaleString()}</td>
                <td className="py-2">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={!!p.featured} onChange={() => toggleFeatured(p)} />
                    <span className="text-sm">{p.featured ? "Yes" : "No"}</span>
                  </label>
                </td>
                <td className="py-2">{(p.images?.length ?? 0)}</td>
                <td className="py-2">{p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "—"}</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(p)} className="px-2 py-1 border rounded text-sm text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}

            {properties.length === 0 && (
              <tr><td colSpan={8} className="py-4 text-sm text-gray-500">No properties.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked property cards */}
      <div className="md:hidden space-y-3">
        {properties.map((p) => (
          <div key={p.id} className="bg-white border rounded-lg p-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-20 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {p.images && p.images.length > 0 ? (
                  // show first image thumbnail (plain img ok)
                  <img src={(p.images as any)[0].url ?? (p.images as any)[0]} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No image</div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-sm text-gray-500">{p.owner?.name ?? p.owner?.email}</div>
                    <div className="text-xs text-gray-500 mt-1">{[p.city, p.country].filter(Boolean).join(", ")}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold">KSh {p.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : ""}</div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button onClick={() => toggleFeatured(p)} className="px-3 py-2 border rounded text-sm">
                    {p.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button onClick={() => handleDelete(p)} className="px-3 py-2 border rounded text-sm text-red-600">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
