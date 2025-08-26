// components/FeaturedProperties.tsx
import React from "react";
import prisma from "@/lib/prisma";
import FeaturedCarouselClient from "./FeaturedCarouselClient";

type FProp = {
  id: string;
  slug?: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  images: string[];
};

export default async function FeaturedProperties() {
  // fetch up to 12 featured, active & published properties
  const rows = await prisma.property.findMany({
    where: { featured: true, active: true, status: "published" },
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: { updatedAt: "desc" },
    take: 12,
  });

  const props: FProp[] = rows.map((r: any) => {
    const images = (r.images ?? []).map((img: any) => img?.url ?? String(img)) as string[];
    const thumb = images.length ? images[0] : "/images/placeholder.png";
    const locationParts = [r.address, r.city, r.country].filter(Boolean);
    return {
      id: r.id,
      slug: r.slug ?? r.id,
      title: r.title,
      location: locationParts.join(", "),
      price: r.price,
      rating: (r as any).rating ?? 0,
      images: [thumb, ...images.filter((u) => u !== thumb)],
    };
  });

  // If none, client carousel will show a friendly message
  return <FeaturedCarouselClient properties={props} />;
}
