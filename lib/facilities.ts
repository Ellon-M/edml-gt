// lib/facilities.ts
import {
  Contact,
  CarFront,
  Wifi,
  CookingPot,
  Bath,
  Play,
  Building2,
  TreePalm,
  TramFront,
  ConciergeBell,
  Droplet,
  SquareDashed,
  ShieldMinus,
  Languages
} from "lucide-react";

export const FACILITIES = [
  {
    title: "Great for your stay",
    icon: Contact,
    items: [
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
    ],
  },
  {
    title: "Kitchen",
    icon: CookingPot,
    items: ["Kitchen"],
  },
  {
    title: "Bathroom",
    icon: Bath,
    items: ["Private bathroom"],
  },
  {
    title: "Media & Technology",
    icon: Play,
    items: ["Flat-screen TV"],
  },
  {
    title: "Outdoors",
    icon: Building2,
    items: ["Picnic area", "Private pool", "Balcony", "Terrace"],
  },
  {
    title: "Outdoor & View",
    icon: TreePalm,
    items: ["View"],
  },
  {
    title: "Transportation",
    icon: TramFront,
    items: ["Car rental", "Airport shuttle (Additional charge)"],
  },
  {
    title: "Front Desk Services",
    icon: ConciergeBell,
    items: ["Private check-in/out", "Baggage storage"],
  },
  {
    title: "Cleaning Services",
    icon: Droplet,
    items: ["Daily housekeeping", "Ironing service", "Dry cleaning", "Laundry"],
  },
  {
    title: "Miscellaneous",
    icon: SquareDashed,
    items: [
      "Air conditioning",
      "Hypoallergenic room available",
      "Soundproof rooms",
      "Elevator",
      "Family rooms",
      "Non-smoking rooms",
    ],
  },
  {
    title: "Safety & security",
    icon: ShieldMinus,
    items: [
      "Fire extinguishers",
      "CCTV outside property",
      "CCTV in common areas",
      "Smoke alarms",
      "24-hour security",
    ],
  },
  {
    title: "Languages Spoken",
    icon: Languages,
    items: ["English"],
  },
];
