// app/dashboard/properties/[id]/edit/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/AdminLayout";
import PropertyForm from "@/components/PropertyForm";
import useRequireRole from "@/hooks/useRequireRole";

export default function EditPropertyPage() {
  useRequireRole("PARTNER");
  const router = useRouter();
  const params = useParams();
  const id = (params as any)?.id;
  const [initial, setInitial] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error("Not found");
        const json = await res.json();
        setInitial({
          ...json,
          images: (json.images || []).map((i:any)=>({ url: i.url }))
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Edit property</h2>
      </div>

      {loading ? <div>Loading…</div> : initial ? (
        <PropertyForm initial={initial} propertyId={id} onSaved={() => router.push("/dashboard/properties")} />
      ) : <div>Property not found.</div>}
    </Layout>
  );
}
