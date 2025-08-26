// app/properties/page.tsx  (server component)
import React from "react";
import PropertyGrid from "@/components/PropertyGrid";
import ListingsClient from "@/components/ListingsClient";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type SearchParams = {
  q?: string;
  city?: string;
  country?: string;
  minPrice?: string;
  maxPrice?: string;
  rooms?: string;
  amenities?: string; // comma separated
  sort?: string; // price_asc | price_desc | newest
  page?: string;
  perPage?: string;
};

function parseNumber(v?: string, fallback?: number) {
  if (!v) return fallback;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

export default async function ListingsPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ?? {};
  const q = (params.q ?? "").trim();
  const city = (params.city ?? "").trim();
  const country = (params.country ?? "").trim();
  const minPrice = parseNumber(params.minPrice, undefined);
  const maxPrice = parseNumber(params.maxPrice, undefined);
  const rooms = parseNumber(params.rooms, undefined);
  const amenities = params.amenities ? params.amenities.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const sort = params.sort ?? "newest";
  const page = parseNumber(params.page, 1) ?? 1;
  const perPage = parseNumber(params.perPage, 24) ?? 24;
  const skip = (page - 1) * perPage;

  // Base where: only active & published properties
  const where: any = {
    active: true,
    status: "published",
  };

  // Text search across title, city, country, address, description
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { country: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }
  if (country) {
    where.country = { contains: country, mode: "insensitive" };
  }

  if (typeof minPrice === "number" || typeof maxPrice === "number") {
    where.price = {};
    if (typeof minPrice === "number") where.price.gte = minPrice;
    if (typeof maxPrice === "number") where.price.lte = maxPrice;
  }

  if (typeof rooms === "number") {
    where.rooms = rooms;
  }

  if (amenities && amenities.length > 0) {
    // hasSome finds properties that include at least one of the requested amenities
    where.amenities = { hasSome: amenities };
  }

  // sorting
  let orderBy: any = { updatedAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  else if (sort === "price_desc") orderBy = { price: "desc" };

  const props = await prisma.property.findMany({
    where,
    include: { images: { orderBy: { order: "asc" } } },
    orderBy,
    skip,
    take: perPage,
  });

  const mapped = props.map((p) => {
    // reorder images so thumbnail (isThumb) is first
    const thumbObj = (p.images || []).find((img: any) => img.isThumb);
    // fallback to first image object
    const firstObj = thumbObj ?? (p.images && p.images.length ? p.images[0] : null);
    const allUrls = (p.images || []).map((i: any) => (i.url ?? i));
    const thumbUrl = firstObj ? (firstObj.url ?? firstObj) : "/images/placeholder.png";

    // make sure images[0] is the thumbnail so consumers can just use images[0]
    const imagesOrdered = [thumbUrl, ...allUrls.filter((u: string) => u !== thumbUrl)];
    return {
      id: p.id,
      slug: p.slug ?? p.id,
      title: p.title,
      location: [p.address, p.city, p.country].filter(Boolean).join(", "),
      pricePerNight: p.price,
      currency: "KES",
      rating: 8.0,
      images: imagesOrdered,
      description: p.description ?? "",
      amenities: p["amenities"] ?? [],
      rooms: p.rooms ? String(p.rooms) : "—",
      type: p["type"] ?? undefined,
    };
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto py-8 px-4">
          <ListingsClient initialProperties={mapped} initialSearchQuery={q} />
        </div>
      </main>
      <Footer />
    </>
  );
}
