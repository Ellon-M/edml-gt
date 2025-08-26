// app/properties/[slug]/page.tsx
import { notFound } from "next/navigation";
import PropertyDetailClient from "@/components/PropertyDetailClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";

interface Props {
  params: { slug: string };
}

export default async function PropertyDetailPage({ params }: Props) {
  const slug = params.slug;
  const p = await prisma.property.findFirst({
    where: { OR: [{ slug }, { id: slug }], status: "published" },
    include: { images: true },
  });

  if (!p) return notFound();

  // reorder images so isThumb first
  const imgs = (p.images ?? []).slice().sort((a,b)=> {
    if (a.isThumb === b.isThumb) return (a.order ?? 0) - (b.order ?? 0);
    return a.isThumb ? -1 : 1;
  });

  const prop = {
    id: p.id,
    slug: p.slug ?? p.id,
    title: p.title,
    location: [p.address, p.city, p.country].filter(Boolean).join(", "),
    pricePerNight: p.price,
    currency: "KES",
    rating: 8.0,
    images: imgs.map(i => i.url),
    description: p.description ?? "",
    amenities: p.amenities ?? [],
	facilities: p.facilities ?? [],
    latitude: p.latitude ?? null,
    longitude: p.longitude ?? null,
  };

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto pt-26 px-4 pb-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Properties", href: "/properties" },
            { label: prop.title },
          ]}
        />

        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-3">
            <div className="flex flex-col mt-4 md:mt-6">
              <div className="flex flex-row gap-3 md:gap-4 mb-0 md:mb-2">
                <h1 className="text-xl md:text-2xl font-bold leading-tight">{prop.title}</h1>
                <div className="flex items-center justify-center gap-2 md:gap-4">
                  <div className="inline-flex items-center justify-center gap-2 text-white px-3 py-1 rounded-full text-sm font-semibold bg-[#800000]">
                    <span>{(prop.rating ?? 7.6).toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-1 text-sm text-gray-600">{prop.location}</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-base md:text-lg font-bold text-black">
                ${prop.pricePerNight} <span className="text-gray-900 italic">/ night</span>
              </div>
              <button type="button" className="ml-4 rounded-md px-4 py-2 text-sm font-medium text-white bg-[#800000]">See Availability</button>
            </div>
          </div>
        </header>

        <PropertyDetailClient prop={prop} />
      </main>
      <Footer />
    </>
  );
}
