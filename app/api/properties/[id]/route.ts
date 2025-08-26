// app/api/properties/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
export const runtime = "nodejs";

const secret = process.env.NEXTAUTH_SECRET ?? "";

// app/api/properties/route.ts  (or update your existing file)
// Add these helpers at the top of the file (above handlers)

const CANONICAL_FACILITY_ITEMS = [
  // Great for your stay
  "Balcony",
  "Air conditioning",
  "Parking",
  "Private bathroom",
  "View",
  "Free Wifi",
  "Kitchen",
  "Flat-screen TV",
  "Family rooms",
  "Non-smoking rooms",

  // Parking (isNote)
  "Free private parking is available on site (reservation is not needed).",

  // Internet (isNote)
  "Wifi is available in all areas and is free of charge.",

  // Kitchen
  "Kitchen",

  // Bathroom
  "Private bathroom",

  // Media & Technology
  "Flat-screen TV",

  // Outdoors
  "Picnic area",
  "Private pool",
  "Terrace",

  // Outdoor & View
  "View",

  // Transportation
  "Car rental",
  "Airport shuttle (Additional charge)",

  // Front Desk Services
  "Private check-in/out",
  "Baggage storage",

  // Cleaning Services
  "Daily housekeeping",
  "Ironing service",
  "Dry cleaning",
  "Laundry",

  // Miscellaneous
  "Hypoallergenic room available",
  "Soundproof rooms",
  "Elevator",

  // Safety & security
  "Fire extinguishers",
  "CCTV outside property",
  "CCTV in common areas",
  "Smoke alarms",
  "24-hour security",

  // Languages
  "English",
];

const MIN_IMAGES = 8;
const MIN_WIDTH = 1200;
const MIN_HEIGHT = 800;

async function ensureSharpAvailable() {
  try {
    const mod = await import("sharp");
    return mod.default ?? mod;
  } catch (err) {
    throw new Error('Server image validation requires the "sharp" package. Install it: `npm install sharp`.');
  }
}

async function getSharp() {
  const mod = await import("sharp");
  return mod.default ?? mod;
}


function isBlobOrDataUrl(u: unknown) {
  if (!u) return false;
  const s = String(u);
  return s.startsWith("blob:") || s.startsWith("data:");
}

function isHttpUrl(u: unknown) {
  if (!u) return false;
  try {
    const url = new URL(String(u));
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function validateImageUrl(url: string) {
  // return { ok: true } or { ok: false, reason: string, width?:number, height?:number }
  if (isBlobOrDataUrl(url)) {
    return { ok: false, reason: "Local blob/data URL detected - upload file to Cloudinary (stable URL) before submitting." };
  }
  if (!isHttpUrl(url)) {
    return { ok: false, reason: "Invalid URL format." };
  }

  // fetch image
  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) return { ok: false, reason: `Failed to fetch image (status ${res.status})` };

    const buf = await res.arrayBuffer();
    const buffer = Buffer.from(buf);

    // validate with sharp
    const sharp = await getSharp();
    const md = await sharp(buf).metadata();
    if (!md || !md.width || !md.height) {
      return { ok: false, reason: "Could not parse image (invalid image or unsupported format)" };
    }
    if (md.width < MIN_WIDTH || md.height < MIN_HEIGHT) {
      return { ok: false, reason: `Image too small: ${md.width}×${md.height} (min ${MIN_WIDTH}×${MIN_HEIGHT})`, width: md.width, height: md.height };
    }
    return { ok: true, width: md.width, height: md.height, format: md.format };
  } catch (err: any) {
    return { ok: false, reason: "Error fetching/validating image: " + (err?.message ?? String(err)) };
  }
}

async function checkImageUrlsAreValidAndLargeEnough(imageUrls: string[]) {
  // const sharp = await ensureSharpAvailable();
  const sharp = await getSharp();
  
  if (!Array.isArray(imageUrls)) throw new Error("images must be an array");

  const problems: string[] = [];

  // validate in parallel but keep results
  await Promise.all(imageUrls.map(async (url, idx) => {
    if (!url || typeof url !== "string") {
      problems.push(`Image #${idx + 1} is missing or not a string`);
      return;
    }
    if (url.startsWith("blob:")) {
      problems.push(`Image #${idx + 1} is a local blob URL — upload properly first.`);
      return;
    }

    // fetch image bytes
    let res: Response;
    try {
      res = await fetch(url);
    } catch (err) {
      problems.push(`Image #${idx + 1} (${url}) could not be fetched: ${String(err)}`);
      return;
    }

    if (!res.ok) {
      problems.push(`Image #${idx + 1} (${url}) returned ${res.status}`);
      return;
    }

	const buf = Buffer.from(await res.arrayBuffer());

    try {
      const metadata = await sharp(buf).metadata();
      const w = metadata.width ?? 0;
      const h = metadata.height ?? 0;
      if (w < MIN_WIDTH || h < MIN_HEIGHT) {
        problems.push(`Image #${idx + 1} is too small (${w}×${h}). Min size ${MIN_WIDTH}×${MIN_HEIGHT}.`);
      }
    } catch (err) {
      problems.push(`Image #${idx + 1}: failed to read image metadata (${String(err)})`);
    }
  }));

  return problems;
}

// helper: normalize string for robust matching
function normalizeKey(s: unknown) {
  if (s === null || s === undefined) return "";
  const str = String(s);
  return str
    .toLowerCase()
    .trim()
    // remove smart quotes and surrounding quotes
    .replace(/^[\u2018\u2019\u201C\u201D"'`]+|[\u2018\u2019\u201C\u201D"'`]+$/g, "")
    // remove unusual punctuation except hyphen and spaces
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ");
}

// create a normalized map for quick matching
const canonicalMap = new Map<string, string>(); // normalized -> canonical label
for (const item of CANONICAL_FACILITY_ITEMS) {
  canonicalMap.set(normalizeKey(item), item); // normalized key -> original label
}

// match incoming facility to canonical label when possible
function matchToCanonical(raw: unknown): string | null {
  const cleaned = String(raw ?? "").trim();
  if (!cleaned) return null;

  const key = normalizeKey(cleaned);

  // 1) exact normalized match
  if (canonicalMap.has(key)) return canonicalMap.get(key)!;

  // 2) substring matches: try to find a canonical item that contains the key or vice versa
  for (const [cKey, label] of canonicalMap.entries()) {
    if (cKey.includes(key) || key.includes(cKey)) {
      return label;
    }
  }

  // 3) fallback: return the cleaned, trimmed original (title-cased-like)
  // simple Title Case
  const words = cleaned
    .replace(/^[\u2018\u2019\u201C\u201D"'`]+|[\u2018\u2019\u201C\u201D"'`]+$/g, "")
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return words.join(" ");
}

// sanitize array: map -> canonical -> dedupe -> remove empties
function sanitizeFacilitiesArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of arr) {
    const matched = matchToCanonical(raw);
    if (!matched) continue;
    if (seen.has(matched)) continue;
    seen.add(matched);
    out.push(matched);
  }
  return out;
}


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!property) return NextResponse.json({ error: "NotFound" }, { status: 404 });
  return NextResponse.json(property);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret });
    if (!token?.sub) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    const userId = String(token.sub);
    const propId = params.id;

    const dbProp = await prisma.property.findUnique({ where: { id: propId } });
    if (!dbProp) return NextResponse.json({ error: "NotFound" }, { status: 404 });
    if (dbProp.ownerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { title, description, address, city, country, price, rooms, bathrooms, images, thumbnailIndex, status, latitude, longitude, amenities, facilities } = body;

    const imagesArr = Array.isArray(images) ? images.map((i:any) => (typeof i === "string" ? { url: i } : i)).map((x:any)=>x.url) : [];

    if (imagesArr.length < MIN_IMAGES) {
      return NextResponse.json({ error: `At least ${MIN_IMAGES} images are required.` }, { status: 400 });
    }
	
	const imgs = Array.isArray(images) ? images : [];
    if (imgs.length < MIN_IMAGES) {
      return NextResponse.json({ error: "ImagesMinimum", message: `At least ${MIN_IMAGES} images are required.`, status: 400 }, { status: 400 });
    }

    // Validate images one-by-one and collect failures
    const imageErrors: any[] = [];
    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i];
      const url = String(img?.url ?? "");
      const v = await validateImageUrl(url);
      if (!v.ok) {
        imageErrors.push({ index: i, url, reason: v.reason });
      }
    }
    if (imageErrors.length > 0) {
      return NextResponse.json({ error: "ImageValidation", details: imageErrors }, { status: 400 });
    }
	
    const sanitizedAmenities = Array.isArray(amenities) ? amenities.map((a:any)=>String(a).trim()).filter(Boolean) : [];
    const sanitizedFacilities = sanitizeFacilitiesArray(facilities);

    const updated = await prisma.property.update({
      where: { id: propId },
      data: {
        title,
        description,
        address,
        city,
        country,
        price: price ? Number(price) : undefined,
        rooms: rooms ? Number(rooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        status: status ?? dbProp.status,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        amenities: sanitizedAmenities,
        facilities: sanitizedFacilities,
        images: {
          deleteMany: {},
          create: (images || []).map((img: any, idx: number) => ({
            url: typeof img === "string" ? img : img.url,
            alt: img.alt ?? null,
            order: typeof img.order === "number" ? img.order : idx,
            isThumb: idx === Number(thumbnailIndex),
          })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json({ ok: true, property: updated });
  } catch (err: any) {
    console.error("PUT /api/properties/[id] failed:", err);
    const msg = err?.message ?? "ServerError";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret });
  if (!token?.sub) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const userId = String(token.sub);
  const propId = params.id;

  console.log("DELETE request for property", propId, "by user", userId);

  const dbProp = await prisma.property.findUnique({ where: { id: propId } });
  if (!dbProp) return NextResponse.json({ error: "NotFound" }, { status: 404 });
  if (dbProp.ownerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.property.delete({ where: { id: propId } });
  return NextResponse.json({ ok: true });
}