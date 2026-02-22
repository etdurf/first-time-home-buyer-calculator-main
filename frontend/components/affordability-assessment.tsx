"use client";

import { useMortgage, formatCurrency } from "@/lib/mortgage-context";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  TrendingDown,
} from "lucide-react";
import { useState } from "react";

function DTIBar({
  label,
  value,
  recommended,
  maxStretch,
  tooltip,
}: {
  label: string;
  value: number;
  recommended: number;
  maxStretch: number;
  tooltip: string;
}) {
  const [showTip, setShowTip] = useState(false);
  const isOk = value <= recommended;
  const isStretch = value > recommended && value <= maxStretch;
  const isHigh = value > maxStretch;

  const barColor = isOk
    ? "bg-success"
    : isStretch
      ? "bg-accent"
      : "bg-destructive";

  const textColor = isOk
    ? "text-success"
    : isStretch
      ? "text-accent"
      : "text-destructive";

  return (
    <div className="mb-5">
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="relative inline-flex">
            <button
              onClick={() => setShowTip(!showTip)}
              onBlur={() => setShowTip(false)}
              className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
              aria-label="More info"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
            {showTip && (
              <div className="absolute bottom-full left-1/2 z-10 mb-2 w-60 -translate-x-1/2 rounded-xl bg-foreground px-3 py-2 text-xs leading-relaxed text-background shadow-lg">
                {tooltip}
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-foreground" />
              </div>
            )}
          </span>
        </div>
        <span className={`text-lg font-bold ${textColor}`}>
          {value.toFixed(1)}%
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
        {/* Markers */}
        <div
          className="absolute top-0 h-full w-0.5 bg-foreground/30"
          style={{ left: `${recommended}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-foreground/20"
          style={{ left: `${maxStretch}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
        <span>
          Recommended: {"<"}
          {recommended}%
        </span>
        <span>Max stretch: {maxStretch}%</span>
      </div>
    </div>
  );
}

export function AffordabilityAssessment() {
  const { calculations, data, setCurrentStep } = useMortgage();

  const housingDTI = calculations.housingDTI;
  const totalDTI = calculations.totalDTI;
  const isAffordable = housingDTI <= 28 && totalDTI <= 36;
  const isStretch =
    !isAffordable && housingDTI <= 33 && totalDTI <= 43;
  const isDifficult = !isAffordable && !isStretch;

  const remaining =
    calculations.monthlyIncome -
    calculations.totalMonthlyHousingCost -
    data.monthlyDebts;

  const summaryText = isAffordable
    ? "This looks manageable based on your current scenario."
    : isStretch
      ? "This is a stretch but may be possible with careful budgeting."
      : "This may be difficult to afford with your current numbers.";

  const summaryIcon = isAffordable
    ? CheckCircle2
    : isStretch
      ? AlertTriangle
      : TrendingDown;

  const summaryBg = isAffordable
    ? "bg-success/10 border-success/20"
    : isStretch
      ? "bg-accent/10 border-accent/20"
      : "bg-destructive/10 border-destructive/20";

  const summaryTextColor = isAffordable
    ? "text-success"
    : isStretch
      ? "text-accent"
      : "text-destructive";

  const SummaryIcon = summaryIcon;

  return (
    <div className="flex flex-col gap-4 px-5 pb-10 pt-6">
      {/* Header */}
      <div className="mb-2">
        <div className="mb-1 flex items-center gap-2">
          <button
            onClick={() => setCurrentStep(2)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Step 3 of 6
          </p>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Affordability Assessment
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Based on your current scenario — not a final judgment.
        </p>
      </div>

      {/* Status Card */}
      <div
        className={`flex items-start gap-3 rounded-2xl border p-4 ${summaryBg}`}
      >
        <SummaryIcon
          className={`mt-0.5 h-5 w-5 shrink-0 ${summaryTextColor}`}
        />
        <div>
          <p className={`text-sm font-semibold ${summaryTextColor}`}>
            {summaryText}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Adjusting your inputs may change this result. This is based on
            general guidelines, not a lender decision.
          </p>
        </div>
      </div>

      {/* DTI Bars */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <DTIBar
          label="Housing DTI"
          value={housingDTI}
          recommended={28}
          maxStretch={33}
          tooltip="Housing debt-to-income ratio measures what percentage of your gross monthly income goes toward housing costs (PITI). Lenders prefer this below 28%."
        />
        <DTIBar
          label="Total DTI"
          value={totalDTI}
          recommended={36}
          maxStretch={43}
          tooltip="Total debt-to-income includes all monthly debt obligations (housing + car payments, student loans, etc.) divided by your gross income. Lenders generally prefer below 36%."
        />
      </div>

      {/* Monthly Budget */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Monthly Budget Snapshot
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly Income</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(calculations.monthlyIncome)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Housing Costs (PITI)</span>
            <span className="font-medium text-foreground">
              {formatCurrency(calculations.monthlyPITI)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Additional Costs</span>
            <span className="font-medium text-foreground">
              {formatCurrency(data.utilities + data.maintenance + data.hoaFees)}
            </span>
          </div>
          <div className="border-t border-border pt-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-foreground">
                Remaining for Other Expenses
              </span>
              <span
                className={`font-bold ${remaining >= 0 ? "text-success" : "text-destructive"}`}
              >
                {formatCurrency(remaining)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* What This Means */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <h3 className="mb-3 text-sm font-bold text-foreground">
          What This Means for You
        </h3>
        <div className="flex flex-col gap-2.5">
          {isDifficult && (
            <>
              <Suggestion text="Consider a lower price range or wait until income increases." />
              <Suggestion text="A larger down payment could reduce monthly costs significantly." />
              <Suggestion text="Make sure you're accounting for all expenses accurately." />
              <Suggestion text="This is just a scenario — adjusting one input can change the picture." />
            </>
          )}
          {isStretch && (
            <>
              <Suggestion text="This is possible but leaves less room for unexpected costs." />
              <Suggestion text="Consider building a larger emergency fund before buying." />
              <Suggestion text="A slightly lower home price could move you into a comfortable range." />
            </>
          )}
          {isAffordable && (
            <>
              <Suggestion text="Your housing costs are within recommended guidelines." />
              <Suggestion text="You have room in your budget for savings and unexpected expenses." />
              <Suggestion text="Consider getting pre-approved to lock in your rate." />
            </>
          )}
        </div>
      </div>

      {/* Continue */}
      <button
        onClick={() => setCurrentStep(4)}
        className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
      >
        See Buyer Tips
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Suggestion({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  );
}
