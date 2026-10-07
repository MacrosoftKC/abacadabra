import type { ImgHTMLAttributes } from "react";
import { productImageUrl, type ImageFile } from "../lib/productImages";

const PLACEHOLDER_SHAPES = {
  card: "rounded-3xl",
  oval: "aspect-[4/3] rounded-[50%]",
  circle: "rounded-full",
} as const;

interface ProductImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  file: ImageFile;
  /** Empty string for decorative images. */
  alt: string;
  placeholderShape?: keyof typeof PLACEHOLDER_SHAPES;
  /** Shows the expected file name inside the placeholder. */
  labelPlaceholder?: boolean;
  /** A decorative extra: render nothing at all while the file is missing. */
  optional?: boolean;
}

/** Renders a product cutout from src/assets/products, or a labeled placeholder while the file is missing. */
export default function ProductImage({
  file,
  alt,
  placeholderShape = "card",
  labelPlaceholder = false,
  optional = false,
  className = "",
  style,
  ...imgProps
}: ProductImageProps) {
  const src = productImageUrl(file);

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        draggable={false}
        decoding="async"
        className={className}
        style={style}
        {...imgProps}
      />
    );
  }

  if (optional) return null;

  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      title={`Missing image: src/assets/products/${file}`}
      className={`${className} ${PLACEHOLDER_SHAPES[placeholderShape]} flex flex-col items-center justify-center gap-1 border-2 border-dashed border-current/45 bg-current/5 p-2 text-center`}
      style={style}
    >
      {labelPlaceholder && (
        <>
          <span className="font-mono text-sm font-semibold">{file}</span>
          <span className="text-xs opacity-75">{alt}</span>
          <span className="font-mono text-[10px] opacity-60">src/assets/products/</span>
        </>
      )}
    </div>
  );
}
