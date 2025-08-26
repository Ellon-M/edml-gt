// components/ListPropertyCard.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { cloudinaryTransform, isCloudinaryUrl } from "@/lib/cloudinary";
import DeleteConfirmModal from "./DeleteConfirmModal";

type Img = { url: string; isThumb?: boolean } | string;

type P = {
  id: string;
  title: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  price: number;
  rooms?: number | null;
  bathrooms?: number | null;
  status?: "draft" | "published" | "suspended" | string;
  images?: Img[];
  description?: string | null;
  slug?: string;
};

const ANIM_DURATION = 300; // keep in sync with the tailwind duration class

const ListPropertyCard: React.FC<{ p: P; onDelete?: (id: string) => void }> = ({
  p,
  onDelete,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isHiding, setIsHiding] = useState(false); // controls the hide animation
  const [removed, setRemoved] = useState(false); // when true we stop rendering the card
  const imgRef = useRef<HTMLImageElement | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  // choose thumbnail intelligently
  const first = (() => {
    if (!p.images || p.images.length === 0) return null;
    const obj = (p.images as any[]).find((i) => i && typeof i === "object" && i.isThumb);
    if (obj && obj.url) return obj.url;
    const firstImg = p.images[0];
    return typeof firstImg === "string" ? firstImg : firstImg?.url ?? null;
  })();

  const imageUrl = first ?? "/default-fallback-image.png";
  const displayUrl = isCloudinaryUrl(imageUrl)
    ? cloudinaryTransform(imageUrl, "c_fill,w_900,q_auto,f_auto")
    : imageUrl;

  useEffect(() => {
    let mounted = true;
    setLoaded(false);
    setError(false);
    if (!displayUrl) {
      setError(true);
      return;
    }
    const pre = new Image();
    pre.src = displayUrl;
    pre.onload = () => mounted && setLoaded(true);
    pre.onerror = () => {
      if (!mounted) return;
      setError(true);
      setLoaded(false);
    };
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth) {
      setLoaded(true);
    }
    return () => {
      mounted = false;
      pre.onload = null;
      pre.onerror = null;
    };
  }, [displayUrl]);

  useEffect(() => {
    return () => {
      // cleanup any pending timeout
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  async function doDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/properties/${p.id}`, { method: "DELETE" });
      if (!res.ok) {
        const js = await res.json().catch(() => ({}));
        throw new Error(js?.error ?? "Failed to delete");
      }

      // close modal immediately
      setModalOpen(false);

      // start hide animation
      setIsHiding(true);

      // After animation finishes remove from DOM and call parent onDelete if provided
      hideTimeoutRef.current = window.setTimeout(() => {
        onDelete?.(p.id);
        setRemoved(true);
      }, ANIM_DURATION);
    } catch (err: any) {
      console.error("Delete failed", err);
      alert(err?.message ?? "Failed to delete property");
      // if delete failed, ensure we don't leave the card hidden
      setIsHiding(false);
    } finally {
      setDeleting(false);
    }
  }

  // If we've finished removal, render nothing.
  if (removed) return null;

  return (
    <div
      aria-hidden={isHiding}
      className={clsx(
        "transition-all duration-300 ease-in-out",
        isHiding
          ? "opacity-0 scale-95 max-h-0 p-0 my-0 pointer-events-none"
          : "opacity-100"
      )}
    >
      <article className="bg-white rounded-md overflow-hidden shadow-sm border">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-48 flex-shrink-0">
            <div className="w-full h-48 md:h-full bg-gray-100 relative overflow-hidden">
              {!loaded && !error && (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 animate-spin text-gray-300" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.15" />
                    <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              )}

              {error && (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden>
                    <path d="M21 15V7a2 2 0 0 0-2-2h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M3 9v8a2 2 0 0 0 2 2h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M8 13l3 3 5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
              )}

              <img
                ref={imgRef}
                src={displayUrl}
                alt={p.title}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                onError={() => { setError(true); setLoaded(false); }}
                className={clsx("w-full h-full object-cover transition-opacity duration-300", loaded ? "opacity-100" : "opacity-0")}
              />
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg truncate">{p.title}</h3>
                  <div className="text-sm text-gray-500 truncate">{p.address ?? [p.city, p.country].filter(Boolean).join(", ")}</div>
                </div>

                <div className="text-right ml-3 flex-shrink-0">
                  <div className="text-sm text-gray-500">Price</div>
                  <div className="font-bold">${p.price?.toLocaleString?.() ?? p.price}/night</div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-600">Rooms: {p.rooms ?? "—"} • Bathrooms: {p.bathrooms ?? "—"}</div>
                <span className={clsx("ml-2 px-2 py-1 text-xs font-medium rounded",
                  p.status === "published" ? "bg-green-100 text-green-700" :
                  p.status === "draft" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                )}>{p.status ?? "—"}</span>
              </div>

              <p className="mt-3 text-sm text-gray-600 line-clamp-3">{p.description ?? "No description available."}</p>
            </div>

            <div className="mt-4">
              <div className="flex gap-2 flex-wrap">
                <Link href={`/dashboard/properties/${p.id}/edit`} className="w-full md:w-auto">
                  <span className="inline-flex items-center gap-2 justify-center px-3 py-2 rounded-md border text-sm bg-white hover:bg-gray-50 cursor-pointer">Edit</span>
                </Link>

                <Link href={`/properties/${p.slug ?? p.id}`} className="w-full md:w-auto">
                  <span className="inline-flex items-center gap-2 justify-center px-3 py-2 rounded-md border text-sm" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>View</span>
                </Link>

                <button
                  onClick={() => setModalOpen(true)}
                  disabled={deleting}
                  className="w-full md:w-auto inline-flex items-center gap-2 justify-center px-3 py-2 rounded-md border text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <DeleteConfirmModal
        open={modalOpen}
        title="Delete property"
        message="This action is permanent. To confirm deletion type the property title exactly."
        requiredText={p.title}
        confirmLabel="Delete property"
        cancelLabel="Cancel"
        loading={deleting}
        onCancel={() => setModalOpen(false)}
        onConfirm={doDelete}
      />
    </div>
  );
};

export default ListPropertyCard;
