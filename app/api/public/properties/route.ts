// app/api/public/properties/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const props = await prisma.property.findMany({
    where: { status: "published" },
    include: { images: true },
    orderBy: { updatedAt: "desc" },
  });

  const mapped = props.map((p) => ({
    id: p.id,
    slug: p.slug ?? p.id,
    title: p.title,
    location: [p.address, p.city, p.country].filter(Boolean).join(", "),
    pricePerNight: p.price,
    currency: "KES",
    rating: 8.0,
    images: p.images.map((i) => i.url),
    description: p.description ?? "",
    amenities: p["amenities"] ?? [],
    rooms: p.rooms ?? null,
    type: p["type"] ?? null,
  }));

  return NextResponse.json(mapped);
}
