// app/dashboard/properties/new/page.tsx
"use client";

import React from "react";
import Layout from "@/components/PartnerLayout";
import PropertyForm from "@/components/PropertyForm";
import { useRouter } from "next/navigation";
import useRequireRole from "@/hooks/useRequireRole";

export default function NewPropertyPage() {
  useRequireRole("PARTNER");
  const router = useRouter();

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Create property</h2>
      </div>

      <PropertyForm
        onSaved={(prop) => {
          router.push("/dashboard/properties");
        }}
      />
    </Layout>
  );
}
