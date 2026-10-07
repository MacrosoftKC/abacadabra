/**
 * Abacá's details in one place: the page's sections (and the URL each one
 * owns), contact info, cafés and socials.
 *
 * Everything marked TODO is a placeholder: confirm it with Abacá before
 * the site goes live.
 */

export const BRAND = {
  name: "Abacá Baking Company",
  short: "Abacá",
  tagline: "Handcrafted since 2006",
  founded: 2006,
} as const;

/**
 * The one-page site, top to bottom. Scrolling a section into the middle of
 * the screen puts its path in the address bar and its title on the tab;
 * opening that path lands on it.
 */
export const SECTIONS = [
  { id: "home", path: "/", label: "Home", title: `${BRAND.name} — ${BRAND.tagline}` },
  { id: "menu", path: "/menu", label: "Menu", title: `Menu · ${BRAND.name}` },
  { id: "craft", path: "/craft", label: "The Craft", title: `The Craft · ${BRAND.name}` },
  { id: "about", path: "/about", label: "Our Story", title: `Our Story · ${BRAND.name}` },
  { id: "visit", path: "/visit", label: "Visit", title: `Visit · ${BRAND.name}` },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

// TODO: Abacá's real contact details.
export const CONTACT = {
  email: "hello@abaca.example",
  phone: { label: "(032) 000 0000", href: "tel:+63320000000" },
} as const;

export interface Cafe {
  name: string;
  address: readonly string[];
}

// TODO: the real cafés.
export const CAFES: readonly Cafe[] = [
  { name: "Flagship café", address: ["Street address", "Cebu City, Philippines"] },
  { name: "Mall café", address: ["Mall name, level", "City, Philippines"] },
];

export interface OpeningHours {
  days: string;
  time: string;
}

// TODO: confirm the opening hours.
export const HOURS: readonly OpeningHours[] = [
  { days: "Monday – Friday", time: "7:00 AM – 9:00 PM" },
  { days: "Saturday – Sunday", time: "8:00 AM – 9:00 PM" },
];

// TODO: point these at Abacá's profiles.
export const SOCIALS = [
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "Facebook", href: "#", icon: "facebook" },
] as const;
