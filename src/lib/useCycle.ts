import { useEffect, useState } from "react";

/**
 * Ever-increasing step counter for a rotation. Callers derive the active item
 * with `step % count`; never wrapping keeps a wheel's angle monotonic so it
 * always turns the same way. Ticks are skipped while the tab is hidden.
 */
export function useCycle(intervalMs: number): number {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") setStep((s) => s + 1);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return step;
}
