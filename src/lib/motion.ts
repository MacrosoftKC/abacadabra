/** Smooths mouse-wheel steps out of scroll-linked layers. */
export const SCROLL_SPRING = { stiffness: 220, damping: 40, mass: 0.3, restDelta: 0.0005 } as const;

/** Lags just behind the pointer, so layers drift rather than jump. */
export const POINTER_SPRING = { stiffness: 90, damping: 20, mass: 0.6 } as const;

/** A long, soft ease-out for things settling into place. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Symmetric ease for things that turn or roll over. */
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];
