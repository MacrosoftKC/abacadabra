import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { scrollToSection, sectionHref } from "../lib/activeSection";
import type { SectionId } from "../site.config";

interface SectionLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: SectionId;
}

/**
 * A real link to a section's URL. A plain click glides there; a modified
 * click (new tab, new window) opens the deep link as usual.
 */
export default function SectionLink({ to, onClick, ...rest }: SectionLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    scrollToSection(to);
  };

  return <a href={sectionHref(to)} onClick={handleClick} {...rest} />;
}
