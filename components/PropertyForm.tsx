// components/PropertyForm.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Trash2, Image as ImgIcon, MapPin, Plus } from "lucide-react";
import { cloudinaryTransform, isCloudinaryUrl } from "@/lib/cloudinary";
import { FACILITIES } from "@/lib/facilities";

type ImagePreview = {
  file?: File;
  url: string;
  uploaded?: boolean;
  alt?: string;
  progress?: number;
  valid?: boolean;
  error?: string | null;
};

const AMENITY_OPTIONS = [
  "Wifi","Free parking","Air conditioning","Kitchen","Washer","TV","Pool","Hot tub","Breakfast","Elevator",
  "Gym","Pet friendly","Parking on site","Garden","Fireplace","Office space","BBQ grill","Beach access","Wheelchair accessible",
  "Iron","Hair dryer","Shampoo","24-hour check-in","Private entrance","Smoke alarm","Heating","Laptop friendly workspace"
];

const MIN_WIDTH = 1200;
const MIN_HEIGHT = 800;
const MIN_IMAGES = 8;
const MAX_FILES = 30;
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const MAP_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function PropertyForm({
  initial,
  onSaved,
  propertyId,
}: {
  initial?: any;
  onSaved?: (property: any) => void;
  propertyId?: string;
}) {
  // basic fields
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [rooms, setRooms] = useState<number>(initial?.rooms ?? 1);
  const [bathrooms, setBathrooms] = useState<number>(initial?.bathrooms ?? 1);

  // images
  const [images, setImages] = useState<ImagePreview[]>(
    (initial?.images ?? []).map((i: any, idx: number) => ({
      url: i?.url ?? i,
      uploaded: true,
      alt: i?.alt ?? "",
      progress: 100,
      valid: true,
    }))
  );
  const [thumbIndex, setThumbIndex] = useState<number>(
    typeof initial?.images?.findIndex === "function"
      ? initial?.images?.findIndex((im: any) => im.isThumb) ?? 0
      : 0
  );
  const [status, setStatus] = useState<"draft" | "published">(initial?.status ?? "draft");

  // location & extras
  const [latitude, setLatitude] = useState<number | "" | null>(initial?.latitude ?? "");
  const [longitude, setLongitude] = useState<number | "" | null>(initial?.longitude ?? "");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initial?.amenities ?? []);
  const [customAmenity, setCustomAmenity] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(initial?.facilities ?? []);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // revoke any object URLs we created
      images.forEach((img) => {
        if (img.url?.startsWith("blob:")) {
          try { URL.revokeObjectURL(img.url); } catch {}
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Helpers ----
  function addLocalFiles(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files).slice(0, Math.max(0, MAX_FILES - images.length));
    const newPreviews: ImagePreview[] = [];
    for (const f of arr) {
      if (f.size > MAX_FILE_SIZE) {
        setErrors((s) => ({ ...s, images: `File ${f.name} is too large (max ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB).` }));
        continue;
      }
      const blobUrl = URL.createObjectURL(f);
      newPreviews.push({ file: f, url: blobUrl, uploaded: false, progress: 0, valid: undefined, error: null });
    }
    setImages((s) => {
      const next = [...s, ...newPreviews];
      // if no thumbnail set, set first as thumb
      if ((s.length === 0) && next.length > 0) setThumbIndex(0);
      return next;
    });
  }

  async function checkDimensionsForFile(file: File): Promise<{ width: number; height: number } | null> {
    try {
      // createImageBitmap is reliable and fast
      // some browsers may throw for certain blobs; we fallback to Image tag
      if ("createImageBitmap" in window) {
        const bitmap = await (window as any).createImageBitmap(file);
        return { width: bitmap.width, height: bitmap.height };
      }
    } catch (err) {
      // fall-through to <img> approach
    }

    return await new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const res = { width: img.naturalWidth, height: img.naturalHeight };
        URL.revokeObjectURL(url);
        resolve(res);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  }

  async function checkDimensionsForUrl(url: string): Promise<{ width: number; height: number } | null> {
    try {
      if (!url) return null;
      if (url.startsWith("blob:") || url.startsWith("data:")) return null;
      // try fetch blob (Cloudinary supports CORS)
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) return null;
      const blob = await res.blob();
      if ("createImageBitmap" in window) {
        try {
          const bitmap = await (window as any).createImageBitmap(blob);
          return { width: bitmap.width, height: bitmap.height };
        } catch (err) {
          // fallback
        }
      }
      return await new Promise((resolve) => {
        const objUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          const out = { width: img.naturalWidth, height: img.naturalHeight };
          URL.revokeObjectURL(objUrl);
          resolve(out);
        };
        img.onerror = () => {
          URL.revokeObjectURL(objUrl);
          resolve(null);
        };
        img.src = objUrl;
      });
    } catch {
      return null;
    }
  }

  function uploadToCloudinaryXHR(file: File, onProgress?: (pct: number) => void): Promise<string> {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      return Promise.reject(new Error("Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_* env vars."));
    }

    return new Promise((resolve, reject) => {
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
      const xhr = new XMLHttpRequest();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);

      xhr.open("POST", url);

      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable && onProgress) {
          const pct = Math.round((ev.loaded / ev.total) * 100);
          onProgress(pct);
        }
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && json && json.secure_url) {
            resolve(json.secure_url);
          } else {
            reject(new Error(json?.error?.message || `Upload failed (status ${xhr.status})`));
          }
        } catch (err) {
          reject(new Error("Invalid response from upload server"));
        }
      };

      xhr.send(fd);
    });
  }

  // ---- Validation ----
  function validateBasic(): boolean {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required.";
    if (!price || Number(price) <= 0) e.price = "Price must be a positive number.";
    if (!images || images.length < MIN_IMAGES) e.images = `Please add at least ${MIN_IMAGES} images.`;
    if (images.length > 0 && (thumbIndex < 0 || thumbIndex >= images.length)) e.thumb = "Please select a thumbnail image.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ---- Geocode (wire to button) ----
  async function handleGeocode() {
    setErrors((s) => ({ ...s, geocode: "" }));
    if (!MAP_KEY) {
      setErrors((s) => ({ ...s, geocode: "Google Maps API key not configured." }));
      return;
    }
    const q = [address, city].filter(Boolean).join(", ").trim();
    if (!q) {
      setErrors((s) => ({ ...s, geocode: "Enter address or city to geocode." }));
      return;
    }

    try {
      const encoded = encodeURIComponent(q);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${MAP_KEY}`;
      const res = await fetch(url);
      if (!res.ok) {
        setErrors((s) => ({ ...s, geocode: `Geocode API error: ${res.status}` }));
        return;
      }
      const data = await res.json();
      if (data.status !== "OK" || !Array.isArray(data.results) || data.results.length === 0) {
        setErrors((s) => ({ ...s, geocode: "No location found for that address." }));
        return;
      }
      const best = data.results[0];
      const loc = best.geometry?.location;
      if (!loc?.lat || !loc?.lng) {
        setErrors((s) => ({ ...s, geocode: "Geocoding returned no coordinates." }));
        return;
      }

      setLatitude(Number(loc.lat));
      setLongitude(Number(loc.lng));
      if (best.formatted_address) setAddress(best.formatted_address);
      setErrors((s) => ({ ...s, geocode: "" }));
    } catch (err) {
      console.error("Geocode failed:", err);
      setErrors((s) => ({ ...s, geocode: "Failed to geocode address." }));
    }
  }
  
  async function ensureFileFromBlob(url: string, fallbackName = "upload.jpg"): Promise<File | null> {
  try {
    // fetch can fetch blob: urls in same-origin context
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    // create a file from the blob (provide a sensible name + type)
    const ext = (blob.type && blob.type.split("/")[1]) || "jpg";
    const name = fallbackName.endsWith(`.${ext}`) ? fallbackName : `${fallbackName}.${ext}`;
    const file = new File([blob], name, { type: blob.type || "image/jpeg" });
    return file;
  } catch (err) {
    // fetch may fail for cross-origin blob URLs or other reasons
    return null;
  }
}

  // ---- Save handler (full flow) ----
  async function handleSave() {
    setErrors({});
    if (!validateBasic()) return;
    setLoading(true);

    try {
      // working copy of images so we can mutate
      const working = images.map((it) => ({ ...it }));

      // 1) client-side dimension checks (parallel)
      const checks = working.map(async (ip, idx) => {
  try {
    // If we have a local file object, prefer checking that
    if (ip.file) {
      const dims = await checkDimensionsForFile(ip.file);
      if (!dims) {
        working[idx].valid = false;
        working[idx].error = "Could not determine image dimensions; try re-uploading.";
        return;
      }
      if (dims.width < MIN_WIDTH || dims.height < MIN_HEIGHT) {
        working[idx].valid = false;
        working[idx].error = `Image too small (${dims.width}×${dims.height}). Minimum ${MIN_WIDTH}×${MIN_HEIGHT}.`;
        return;
      }
      working[idx].valid = true;
      working[idx].error = null;
      return;
    }

    // If no file but URL exists:
    if (ip.url) {
      // If it's a blob: url try to recover the File from it
      if (ip.url.startsWith("blob:")) {
        // attempt to fetch the blob and create a File object
        const recovered = await ensureFileFromBlob(ip.url, `image-${idx}`);
        if (recovered) {
          // use the recovered file to check dimensions
          const dims = await checkDimensionsForFile(recovered);
          if (!dims) {
            working[idx].valid = false;
            working[idx].error = "Could not determine image dimensions from local preview. Re-upload the file if this persists.";
            return;
          }
          if (dims.width < MIN_WIDTH || dims.height < MIN_HEIGHT) {
            working[idx].valid = false;
            working[idx].error = `Image too small (${dims.width}×${dims.height}). Minimum ${MIN_WIDTH}×${MIN_HEIGHT}.`;
            return;
          }
          // store the recovered file so we can upload it later
          working[idx].file = recovered;
          working[idx].valid = true;
          working[idx].error = null;
          return;
        } else {
          // Could not recover the blob as a File — tell the user to reselect
          working[idx].valid = false;
          working[idx].error = "Temporary preview detected; please re-select the image file before saving.";
          return;
        }
      }

      // Normal remote URL (http/https) — fetch a blob and check dimensions
      const dimsRemote = await checkDimensionsForUrl(ip.url);
      if (!dimsRemote) {
        working[idx].valid = false;
        working[idx].error = "Could not inspect remote image dimensions (CORS or invalid image).";
        return;
      }
      if (dimsRemote.width < MIN_WIDTH || dimsRemote.height < MIN_HEIGHT) {
        working[idx].valid = false;
        working[idx].error = `Image too small (${dimsRemote.width}×${dimsRemote.height}). Minimum ${MIN_WIDTH}×${MIN_HEIGHT}.`;
        return;
      }
      working[idx].valid = true;
      working[idx].error = null;
      return;
    }

    // No file and no url -> invalid
    working[idx].valid = false;
    working[idx].error = "No image file available; re-upload the image.";
  } catch (err: any) {
    working[idx].valid = false;
    working[idx].error = String(err?.message ?? err);
  }
});

      await Promise.all(checks);

      // reflect validation into UI
      if (!mountedRef.current) return;
      setImages(working);

      // stop if any invalid
      const invalids = working.filter((i) => i.valid === false);
      if (invalids.length) {
        setErrors({ images: "Some images failed validation. Fix or re-upload them." });
        setLoading(false);
        return;
      }

      // 2) upload local files in parallel with per-image progress
      const uploadPromises: Promise<{ idx: number; url?: string; error?: any }>[] = [];

      working.forEach((ip, idx) => {
        if (ip.uploaded && ip.url && !ip.url.startsWith("blob:")) {
          // stable url already present
          return;
        }

        if (ip.file) {
          // mark progress in UI
          setImages((prev) => prev.map((it, i) => (i === idx ? { ...it, progress: 0, error: null } : it)));

          const p = uploadToCloudinaryXHR(ip.file!, (pct) => {
            if (!mountedRef.current) return;
            setImages((prev) => prev.map((it, i) => (i === idx ? { ...it, progress: pct } : it)));
          })
            .then((secureUrl) => {
              // update working copy + UI
              working[idx].url = secureUrl;
              working[idx].uploaded = true;
              working[idx].progress = 100;
              working[idx].valid = true;
              working[idx].error = null;
              setImages((prev) => prev.map((it, i) => (i === idx ? { ...it, url: secureUrl, uploaded: true, progress: 100, valid: true, error: null } : it)));
              return { idx, url: secureUrl };
            })
            .catch((err) => {
              const message = err?.message ?? String(err);
              working[idx].error = message;
              working[idx].valid = false;
              setImages((prev) => prev.map((it, i) => (i === idx ? { ...it, error: message, valid: false } : it)));
              return { idx, error: message };
            });

          uploadPromises.push(p);
        } else if (ip.url) {
          // remote url present but not marked uploaded - treat as uploaded
          working[idx].uploaded = true;
        }
      });

      const settled = await Promise.allSettled(uploadPromises);
      const uploadFailures = settled
        .map((s) => (s.status === "fulfilled" ? s.value : (s as PromiseRejectedResult).reason))
        .filter((r) => r && (r as any).error);

      if (uploadFailures.length) {
        setErrors((s) => ({ ...s, images: "Some uploads failed. Fix or retry." }));
        setLoading(false);
        return;
      }

      // ensure images state has final urls
      if (!mountedRef.current) return;
      setImages(working);

      // final images payload
      const finalImagesOrdered = working.map((it) => ({ url: it.url, alt: it.alt }));

      // enforce min images
      if (finalImagesOrdered.length < MIN_IMAGES) {
        setErrors({ images: `At least ${MIN_IMAGES} images are required.` });
        setLoading(false);
        return;
      }

      if (thumbIndex < 0 || thumbIndex >= finalImagesOrdered.length) {
        setErrors({ thumb: "Please select a thumbnail image." });
        setLoading(false);
        return;
      }

      // 3) send to server
      const payload = {
        title,
        description,
        address,
        city,
        price: Number(price),
        rooms: Number(rooms),
        bathrooms: Number(bathrooms),
        images: finalImagesOrdered,
        thumbnailIndex: thumbIndex,
        status,
        latitude: (latitude === "" ? null : latitude),
        longitude: (longitude === "" ? null : longitude),
        amenities: selectedAmenities,
        facilities: selectedFacilities,
      };

      const method = propertyId ? "PUT" : "POST";
      const endpoint = propertyId ? `/api/properties/${propertyId}` : "/api/properties";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        // helpful server-side image validation mapping
        if (json?.error === "ImageValidation" && Array.isArray(json.details)) {
          const copy = working.map((it) => ({ ...it }));
          for (const d of json.details) {
            const idx = Number(d.index);
            if (!Number.isNaN(idx) && copy[idx]) {
              copy[idx].error = d.reason;
              copy[idx].valid = false;
            }
          }
          setImages(copy);
          setErrors({ images: "Some images failed server-side validation. See errors below each thumbnail." });
          setLoading(false);
          return;
        }
        if (json?.error === "ImagesMinimum") {
          setErrors({ images: json?.message ?? `At least ${MIN_IMAGES} images required.` });
          setLoading(false);
          return;
        }

        throw new Error(json?.message ?? json?.error ?? "Server error");
      }

      // success
      onSaved?.(json.property);
    } catch (err: any) {
      console.error("Save property failed:", err);
      setErrors((s) => ({ ...s, form: err?.message ?? String(err) }));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }

  // ---- small helpers ----
  function removeImage(index: number) {
    setImages((s) => {
      const toRemove = s[index];
      if (toRemove?.url?.startsWith("blob:")) {
        try { URL.revokeObjectURL(toRemove.url); } catch {}
      }
      const next = s.filter((_, i) => i !== index);
      return next;
    });
    setThumbIndex((prevThumb) => {
      if (index === prevThumb) return 0;
      if (index < prevThumb) return Math.max(0, prevThumb - 1);
      return prevThumb;
    });
  }

  function setAsThumbnail(index: number, e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    setThumbIndex(index);
  }

  function toggleFacility(item: string) {
    setSelectedFacilities((prev) => (prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item]));
  }

  function toggleAmenity(item: string) {
    setSelectedAmenities((prev) => (prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]));
  }

  function addCustomAmenity() {
    const val = customAmenity.trim();
    if (!val) return;
    if (selectedAmenities.includes(val)) {
      setCustomAmenity("");
      return;
    }
    setSelectedAmenities((s) => [...s, val]);
    setCustomAmenity("");
  }

  function removeAmenity(item: string) {
    setSelectedAmenities((s) => s.filter((a) => a !== item));
  }

  // map preview + link
  const mapPreviewUrl = (latitude && longitude && MAP_KEY)
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=640x320&markers=color:red%7C${latitude},${longitude}&key=${MAP_KEY}`
    : "/map-placeholder.png";

  const googleMapsLink = (latitude && longitude)
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : undefined;

  // ---- render ----
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
          {errors.title && <div className="text-xs text-red-600 mt-1">{errors.title}</div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-sm font-medium">Price (per night)</label>
            <input type="number" value={price as any} onChange={(e)=>setPrice(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
            {errors.price && <div className="text-xs text-red-600 mt-1">{errors.price}</div>}
          </div>

          <div>
            <label className="text-sm font-medium">Rooms</label>
            <input type="number" min={1} value={rooms} onChange={(e)=>setRooms(Number(e.target.value))} className="mt-1 block w-full rounded-md border px-3 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Address</label>
            <input value={address} onChange={(e)=>setAddress(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">City</label>
            <input value={city} onChange={(e)=>setCity(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-sm font-medium">Latitude</label>
            <input value={latitude ?? ""} onChange={(e)=>setLatitude(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Longitude</label>
            <input value={longitude ?? ""} onChange={(e)=>setLongitude(e.target.value === "" ? "" : Number(e.target.value))} className="mt-1 block w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <button onClick={handleGeocode} className="mt-1 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#800000] text-white">
              <MapPin size={16} /> Geocode address
            </button>
            {errors.geocode && <div className="text-xs text-red-600 mt-1">{errors.geocode}</div>}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Map preview</label>
          <div className="mt-2 w-full h-40 rounded overflow-hidden border border-gray-200">
            {googleMapsLink ? (
              <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                <img src={mapPreviewUrl} alt="Map preview" className="w-full h-full object-cover" />
              </a>
            ) : (
              <img src={mapPreviewUrl} alt="Map preview" className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border px-3 py-2" />
        </div>

        {/* Amenities */}
        <div>
          <label className="text-sm font-medium">Amenities</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((opt) => {
              const selected = selectedAmenities.includes(opt);
              return (
                <button key={opt} type="button" onClick={() => toggleAmenity(opt)} className={clsx("px-3 py-1 rounded-full border text-sm", selected ? "bg-[#800000] text-white border-transparent" : "bg-white text-gray-700")}>
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex gap-2 items-center">
            <input value={customAmenity} onChange={(e)=>setCustomAmenity(e.target.value)} placeholder="Add custom amenity" className="rounded-md border px-3 py-2 w-full" />
            <button type="button" onClick={addCustomAmenity} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100">
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {selectedAmenities.map((a) => (
              <div key={a} className="inline-flex items-center gap-2 bg-gray-50 border px-3 py-1 rounded-full text-sm">
                <span>{a}</span>
                <button type="button" onClick={() => removeAmenity(a)} className="text-xs text-gray-500">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div>
          <label className="text-sm font-medium">Facilities</label>
          <div className="mt-3 space-y-4">
            {FACILITIES.map((cat) => {
              const Icon = cat.icon as any;
              return (
                <div key={cat.title} className="bg-white border rounded p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 text-gray-700 flex-shrink-0">{Icon ? <Icon /> : null}</div>
                    <div className="font-medium">{cat.title}</div>
                  </div>

                  {cat.isNote ? (
                    <p className="text-sm text-gray-600 mb-2">{cat.items[0]}</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cat.items.map((it) => {
                        const checked = selectedFacilities.includes(it);
                        return (
                          <label key={it} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleFacility(it)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <span>{it}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {selectedFacilities.map((f) => (
              <div key={f} className="inline-flex items-center gap-2 bg-gray-50 border px-3 py-1 rounded-full text-sm">
                <span>{f}</span>
                <button type="button" onClick={() => toggleFacility(f)} className="text-xs text-gray-500">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium">Status</label>
          <select value={status} onChange={(e)=>setStatus(e.target.value as any)} className="mt-1 block w-full rounded-md border px-3 py-2">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <div className="text-xs text-[#800000] mt-1">Drafts are not visible in the public listings.</div>
        </div>

        {/* Images */}
        <div>
          <label className="text-sm font-medium">Images (min {MIN_IMAGES})</label>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
            {images.map((img, idx) => {
              const src = isCloudinaryUrl(img.url) ? cloudinaryTransform(img.url, "c_fill,w_1600,q_auto,f_auto") : img.url;
              return (
                <div key={idx} className="relative border rounded overflow-hidden">
                  <img src={src} alt={img.alt ?? `Image ${idx+1}`} className="w-full h-32 object-cover" />
                  <div className="absolute left-1 top-1 bg-white/80 rounded px-2 py-1 text-xs">
                    {thumbIndex === idx ? <span className="font-medium text-xs">Thumbnail</span> : <button className="text-xs" onClick={(e)=>setAsThumbnail(idx, e)}>Set thumb</button>}
                  </div>
                  <button onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); removeImage(idx); }} className="absolute right-1 top-1 bg-white/80 p-1 rounded">
                    <Trash2 size={14} />
                  </button>

                  {typeof img.progress === "number" && img.progress < 100 && (
                    <div className="absolute left-0 right-0 bottom-0 h-1 bg-white/30">
                      <div style={{ width: `${img.progress}%` }} className="h-1 bg-[#800000] transition-all" />
                    </div>
                  )}

                  {img.error ? (
                    <div className="absolute left-0 right-0 bottom-0 text-xs bg-red-50 text-red-700 px-2 py-1">{img.error}</div>
                  ) : img.valid === false ? (
                    <div className="absolute left-0 right-0 bottom-0 text-xs bg-yellow-50 text-yellow-700 px-2 py-1">Validation failed</div>
                  ) : null}
                </div>
              );
            })}

            {images.length < MAX_FILES && (
              <label className="flex flex-col items-center justify-center h-32 border rounded cursor-pointer text-sm text-gray-500">
                <ImgIcon size={28} />
                <div className="mt-1">Upload</div>
                <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e)=>{ addLocalFiles(e.target.files); }} />
              </label>
            )}
          </div>
          {errors.images && <div className="text-xs text-red-600 mt-1 whitespace-pre-line">{errors.images}</div>}
          {errors.thumb && <div className="text-xs text-red-600 mt-1">{errors.thumb}</div>}
        </div>

        {errors.form && <div className="text-sm text-red-600">{errors.form}</div>}

        <div className="flex gap-3">
          <button onClick={handleSave} disabled={loading} className="px-4 py-2 rounded bg-[#800000] text-white">
            {loading ? "Saving..." : "Save property"}
          </button>
        </div>
      </div>
    </div>
  );
}
