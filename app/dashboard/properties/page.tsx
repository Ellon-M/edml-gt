// app/dashboard/properties/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Layout from "../../../components/AdminLayout";
import ListPropertyCard from "../../../components/ListPropertyCard";
import Link from "next/link";
import useRequireRole from "@/hooks/useRequireRole";

const PropertiesPage: React.FC = () => {
  useRequireRole("PARTNER");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/properties");
      const json = await res.json();
      if (res.ok) setProperties(json || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function handleDelete(id: string) {
    setProperties((s) => s.filter((p) => p.id !== id));
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Your properties</h2>
        <Link href="/dashboard/properties/new">
          <span className="inline-flex items-center px-4 py-2 rounded-md text-white font-medium" style={{ backgroundColor: "#800000" }}>
            Create listing
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? <div>Loading…</div> : null}
        {!loading && properties.length === 0 && <div className="text-sm text-gray-500">You have no properties yet.</div>}
        {properties.map((p) => {
  // p.images is an array of { url, isThumb, order } (from API)
  const imgs = (p.images ?? []).slice();
  imgs.sort((a: any, b: any) => {
    if (a.isThumb === b.isThumb) return (a.order ?? 0) - (b.order ?? 0);
    return a.isThumb ? -1 : 1;
  });

  return (
    <ListPropertyCard
      key={p.id}
      p={{
        id: p.id,
        title: p.title,
        address: p.address,
        city: p.city,
        country: p.country,
        price: p.price,
        rooms: p.rooms,
        bathrooms: p.bathrooms,
        status: p.status,
        images: imgs.map((i:any)=> (i?.url ?? i)), // keeps backwards-compatible shape
        description: p.description,
      }}
      onDelete={handleDelete}
    />
  );
})}
      </div>
    </Layout>
  );
};

export default PropertiesPage;
