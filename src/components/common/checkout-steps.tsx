"use client";

import { Check } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type StepKey = "bag" | "identification" | "payment";

interface CheckoutStepsProps {
  current: StepKey;
}

const STEPS: Array<{ key: StepKey; label: string; href: string }> = [
  { key: "bag", label: "Sacola", href: "/cart" },
  {
    key: "identification",
    label: "Identificação",
    href: "/cart/identification",
  },
  { key: "payment", label: "Pagamento", href: "/cart/confirmation" },
];

export default function CheckoutSteps({ current }: CheckoutStepsProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <nav aria-label="Etapas do checkout" className="mt-2 mb-6 w-full">
      <ol className="mx-auto flex max-w-6xl items-center gap-3 px-5 md:px-4">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <li key={step.key} className="flex flex-1 items-center gap-3">
              {/* bolinha + label */}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "grid h-6 w-6 place-items-center rounded-full border text-xs font-semibold",
                    isCompleted &&
                      "border-emerald-500 bg-emerald-500 text-white",
                    isCurrent && "border-emerald-600 text-emerald-700",
                    !isCompleted &&
                      !isCurrent &&
                      "border-slate-300 text-slate-400",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${idx + 1} ${step.label}${isCurrent ? " (etapa atual)" : ""}`}
                  title={step.label}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                </div>

                {isCompleted ? (
                  <Link
                    href={step.href}
                    className="text-xs font-medium text-emerald-700 hover:underline md:text-sm"
                  >
                    {step.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "text-xs md:text-sm",
                      isCurrent
                        ? "font-medium text-slate-900"
                        : "text-slate-500",
                    )}
                  >
                    {step.label}
                  </span>
                )}
              </div>

              {/* conector */}
              {idx !== STEPS.length - 1 && (
                <span
                  className={cn(
                    "hidden h-[2px] flex-1 rounded-sm md:block",
                    idx < currentIndex ? "bg-emerald-500" : "bg-slate-200",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
