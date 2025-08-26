// components/PropertyGrid.tsx
"use client";

import React from "react";
import { PropertyCard } from "./PropertyCard";
import Link from "next/link";

export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  pricePerNight: number;
  currency: string;
  rating: number;
  amenities?: string[];
  rooms?: string;
  type?: string;
  images: string[];
  description?: string;
}

export interface PropertyGridProps {
  properties: Property[];
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((prop) => (
        <Link key={prop.id} href={`/properties/${prop.slug}`}>
          <span>
            <PropertyCard
              {...prop}
            />
          </span>
        </Link>
      ))}
    </div>
  );
}
