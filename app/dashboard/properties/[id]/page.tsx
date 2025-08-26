"use client";

import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import React from 'react';
import Layout from '@/components/AdminLayout';
import { dummyProperties } from '@/data/dummy';
import Card from '@/components/Card';
import useRequireRole from "@/hooks/useRequireRole";

const EditProperty: React.FC = () => {
  useRequireRole("PARTNER");
  
  const router = useRouter();
  const { id } = useParams<{ id: string }>(); // <-- from dynamic segment
  const property = dummyProperties.find((p) => p.id === id);

  return (
    <Layout>
      <div className="flex items-start gap-6">
        <div className="flex-1">
          <Card title={property?.title || 'Property'}>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Title</label>
                <input defaultValue={property?.title} className="mt-1 w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Address</label>
                <input defaultValue={property?.address} className="mt-1 w-full border rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Price</label>
                  <input defaultValue={property?.price} className="mt-1 w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Rooms</label>
                  <input defaultValue={property?.rooms} className="mt-1 w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Status</label>
                  <select defaultValue={property?.status} className="mt-1 w-full border rounded px-3 py-2">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button style={{backgroundColor:'var(--color-primary)', color:'white'}} className="px-4 py-2 rounded">Save</button>
                <button className="px-4 py-2 rounded border">Cancel</button>
              </div>
            </form>
          </Card>
        </div>

        <div style={{width: 360}}>
          <Card title="Preview">
            <img src={property?.images?.[0] || ''} className="w-full h-40 object-cover rounded" />
            <div className="mt-3">
              <div className="font-semibold">{property?.title}</div>
              <div className="text-sm text-gray-500">{property?.address}</div>
              <div className="mt-2 font-bold">${property?.price}/night</div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EditProperty;
