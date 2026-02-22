"use client";

import { useMortgage, formatCurrency } from "@/lib/mortgage-context";
import {
  ArrowLeft,
  ArrowRight,
  Star,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  Shield,
} from "lucide-react";
import { useState } from "react";

interface Tip {
  title: string;
  description: string;
  impact: "high" | "medium";
  timing: "now" | "later";
  personalized?: string;
}

export function BuyerTips() {
  const { calculations, data, setCurrentStep } = useMortgage();
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<"all" | "now" | "later">("all");

  const tips: Tip[] = [
    {
      title: "Get Pre-Approved Early",
      description:
        "Getting pre-approved for a mortgage shows sellers you're serious and helps you understand exactly what you can afford. It's different from pre-qualification — pre-approval involves a credit check and is much more reliable.",
      impact: "high",
      timing: "now",
    },
    {
      title: "Budget for Closing Costs",
      description: `Plan for 2-5% of the home price in closing costs (title insurance, appraisal, inspections, etc.). That's ${formatCurrency(data.homePrice * 0.02)}-${formatCurrency(data.homePrice * 0.05)} on a ${formatCurrency(data.homePrice)} home. Some costs may be negotiable with the seller.`,
      impact: "high",
      timing: "now",
      personalized: `For your ${formatCurrency(data.homePrice)} home, budget ${formatCurrency(data.homePrice * 0.03)} for closing costs.`,
    },
    {
      title: "Consider Reaching 20% Down",
      description:
        "Putting down 20% eliminates PMI (private mortgage insurance), saving you significant money each month. However, don't deplete all your savings — keep an emergency fund.",
      impact: data.downPaymentPercent < 20 ? "high" : "medium",
      timing: "now",
      personalized:
        data.downPaymentPercent < 20
          ? `Moving from ${data.downPaymentPercent}% to 20% down would save you ~${formatCurrency(calculations.monthlyPMI)}/mo in PMI.`
          : "You're already at 20%+ — great job avoiding PMI!",
    },
    {
      title: "Don't Skip the Home Inspection",
      description:
        "A professional home inspection ($300-500) can reveal costly issues before you buy. It gives you negotiating power or the option to walk away if major problems are found.",
      impact: "high",
      timing: "later",
    },
    {
      title: "Shop Around for Rates",
      description:
        "Even a 0.25% rate difference can save thousands over the life of your loan. Get quotes from at least 3 lenders. Credit pulls within a 45-day window count as one inquiry.",
      impact: "high",
      timing: "now",
    },
    {
      title: "Build an Emergency Fund",
      description:
        "Aim for 3-6 months of housing costs in savings before buying. Homeownership brings unexpected expenses — a water heater, roof repair, or appliance replacement can cost thousands.",
      impact: "medium",
      timing: "now",
    },
    {
      title: "Understand Your Neighborhood Costs",
      description:
        "Property taxes, insurance rates, and HOA fees vary widely by location. Research these for your target neighborhoods to avoid surprises in your monthly budget.",
      impact: "medium",
      timing: "later",
    },
    {
      title: "Check First-Time Buyer Programs",
      description:
        "Many states and local governments offer grants, down payment assistance, or reduced-rate loans for first-time buyers. These programs can save you thousands upfront.",
      impact: "high",
      timing: "now",
    },
  ];

  const filteredTips =
    filter === "all" ? tips : tips.filter((t) => t.timing === filter);
  const visibleTips = showAll ? filteredTips : filteredTips.slice(0, 4);

  return (
    <div className="flex flex-col gap-4 px-5 pb-10 pt-6">
      {/* Header */}
      <div className="mb-2">
        <div className="mb-1 flex items-center gap-2">
          <button
            onClick={() => setCurrentStep(3)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Step 4 of 6
          </p>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          First-Time Buyer Tips
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Practical advice ranked by impact on your situation.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(
          [
            { key: "all", label: "All Tips" },
            { key: "now", label: "Do Now" },
            { key: "later", label: "Do Later" },
          ] as const
        ).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              filter === f.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tips */}
      <div className="flex flex-col gap-3">
        {visibleTips.map((tip, i) => (
          <TipCard key={tip.title} tip={tip} index={i} />
        ))}
      </div>

      {filteredTips.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {showAll ? "Show Less" : `Show ${filteredTips.length - 4} More Tips`}
          {showAll ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      )}

      {/* Disclaimer */}
      <div className="rounded-2xl border border-border bg-muted/50 p-4">
        <div className="flex items-start gap-2.5">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs font-semibold text-foreground">Remember</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              This calculator provides estimates for planning purposes. Actual
              rates, taxes, and insurance vary by location and lender. Always
              consult a licensed mortgage professional before making decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Continue */}
      <button
        onClick={() => setCurrentStep(5)}
        className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
      >
        Compare Loan Terms
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function TipCard({ tip, index }: { tip: Tip; index: number }) {
  const [expanded, setExpanded] = useState(index < 2);

  return (
    <div
      className={`rounded-2xl border bg-card transition-all ${
        tip.impact === "high"
          ? "border-primary/20"
          : "border-border"
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            tip.impact === "high"
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {tip.impact === "high" ? (
            <Zap className="h-4 w-4" />
          ) : (
            <Star className="h-4 w-4" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              {tip.title}
            </h3>
          </div>
          <div className="flex gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                tip.impact === "high"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {tip.impact === "high" ? "High impact" : "Helpful"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              <Clock className="h-2.5 w-2.5" />
              {tip.timing === "now" ? "Do now" : "Do later"}
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {tip.description}
          </p>
          {tip.personalized && (
            <div className="mt-2.5 rounded-xl bg-primary/5 px-3 py-2">
              <p className="text-xs font-medium text-primary">
                For your scenario: {tip.personalized}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
