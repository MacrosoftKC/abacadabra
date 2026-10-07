export type ImageFile = `${string}.${"png" | "webp" | "avif" | "jpg" | "jpeg" | "svg"}`;

/** Whatever is in src/assets/products right now; files added later are picked up automatically. */
const URLS = import.meta.glob<string>("../assets/products/*.{png,webp,avif,jpg,jpeg,svg}", {
  eager: true,
  import: "default",
});

/** URL of a product cutout in src/assets/products, or undefined while it's missing. */
export function productImageUrl(file: ImageFile): string | undefined {
  return URLS[`../assets/products/${file}`];
}
