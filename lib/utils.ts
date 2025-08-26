import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type RatingBucket = { min: number; max: number; label: string };

export const ratingBuckets: RatingBucket[] = [
  { min: 6, max: 7, label: 'Nice' },
  { min: 7, max: 8, label: 'Very Good' },
  { min: 8, max: 9, label: 'Excellent' },
  { min: 9, max: Infinity, label: 'Exceptional' },
];

// helper to filter by bucket if you need it:
export function filterByBucket<T extends { rating: number }>(
  items: T[],
  bucketMin: number
) {
  const bucket = ratingBuckets.find(b => b.min === bucketMin)!;
  return items.filter(i => i.rating >= bucket.min && i.rating < bucket.max);
}

// ---------- Helper utils ----------
export const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export const isStrongPassword = (s: string) => s.length >= 8 && /[A-Z]/.test(s) && /[a-z]/.test(s) && /[0-9]/.test(s);
