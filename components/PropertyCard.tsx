// components/PropertyCard.tsx
"use client";

import Image from "next/image";
import React from "react";
import { cloudinaryTransform, isCloudinaryUrl } from "@/lib/cloudinary";

export interface PropertyCardProps {
  id: string;
  slug: string;
  title: string;
  location: string;
  pricePerNight: number;
  currency: string;
  rating: number;
  images: string[];
  onClick?: () => void;
}

const CLOUD_DEFAULT_WIDTH = 800;

export const PropertyCard: React.FC<PropertyCardProps> = ({
  images,
  title,
  location,
  pricePerNight,
  currency,
  rating,
  onClick,
}) => {
  const raw = images?.[0] ?? "/default-fallback-image.png";
  console.log("raw", raw);
  // If Cloudinary: request a transformed hi-res thumbnail
  const src = isCloudinaryUrl(raw) ? cloudinaryTransform(raw, `c_fill,w_${CLOUD_DEFAULT_WIDTH},q_auto,f_auto`) : raw;
   console.log("src", src);

  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick?.(); }}
    >
      <div className="relative w-full h-48 rounded-md mb-4 overflow-hidden bg-gray-100">
        <Image
          src={src}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          // allow external images (next.config.js must allow remote patterns) or set unoptimized if needed
          unoptimized={false}
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-600 mb-1">{location}</p>
      <p className="font-bold text-blue-600 mb-2">
        From {currency} {pricePerNight}/night
      </p>
      <p className="text-sm text-yellow-500">{'★'.repeat(Math.round(rating))}</p>
    </div>
  );
};
