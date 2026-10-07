import type { ReactNode } from "react";
import { CRUST } from "../../theme";

interface InfoCardProps {
  label: string;
  children: ReactNode;
}

/** Small white card for the cafés / hours / contact details. */
export default function InfoCard({ label, children }: InfoCardProps) {
  return (
    <div className="h-full rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
      <p className="eyebrow text-[10px]" style={{ color: CRUST }}>
        {label}
      </p>
      <div className="mt-3 text-sm">{children}</div>
    </div>
  );
}
