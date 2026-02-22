"use client";

import { useMortgage, formatCurrency } from "@/lib/mortgage-context";
import { ArrowLeft, ArrowRight, Info, AlertCircle } from "lucide-react";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";

function InfoPopover({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        onClick={() => setShow(!show)}
        onBlur={() => setShow(false)}
        className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
        aria-label="More info"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 z-10 mb-2 w-60 -translate-x-1/2 rounded-xl bg-foreground px-3 py-2 text-xs leading-relaxed text-background shadow-lg">
          {text}
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-foreground" />
        </div>
      )}
    </span>
  );
}

const COLORS = [
  "hsl(172, 50%, 36%)",
  "hsl(38, 92%, 50%)",
  "hsl(220, 20%, 60%)",
  "hsl(210, 14%, 68%)",
  "hsl(4, 70%, 56%)",
];

export function PaymentBreakdown() {
  const { calculations, data, setCurrentStep } = useMortgage();

  const pitiItems = [
    {
      name: "Principal",
      value: calculations.principalPayment,
      color: COLORS[0],
    },
    {
      name: "Interest",
      value: calculations.interestPayment,
      color: COLORS[1],
    },
    {
      name: "Property Tax",
      value: calculations.monthlyPropertyTax,
      color: COLORS[2],
    },
    {
      name: "Insurance",
      value: calculations.monthlyInsurance,
      color: COLORS[3],
    },
  ];

  if (calculations.monthlyPMI > 0) {
    pitiItems.push({
      name: "PMI",
      value: calculations.monthlyPMI,
      color: COLORS[4],
    });
  }

  const incomePercent = (
    (calculations.monthlyPITI / calculations.monthlyIncome) *
    100
  ).toFixed(0);

  const largestCost = pitiItems.reduce((a, b) =>
    a.value > b.value ? a : b
  );

  return (
    <div className="flex flex-col gap-4 px-5 pb-10 pt-6">
      {/* Header */}
      <div className="mb-2">
        <div className="mb-1 flex items-center gap-2">
          <button
            onClick={() => setCurrentStep(1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Step 2 of 6
          </p>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Monthly Payment Breakdown
        </h1>
      </div>

      {/* Key Takeaway */}
      <div className="rounded-2xl bg-accent/10 px-4 py-3">
        <p className="text-sm font-medium text-foreground">
          <span className="font-bold text-accent">{largestCost.name}</span> is
          your largest monthly cost at{" "}
          {formatCurrency(largestCost.value)}
        </p>
      </div>

      {/* PITI Card */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-1 flex items-center gap-1.5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Monthly PITI Payment
          </h2>
          <InfoPopover text="PITI stands for Principal, Interest, Taxes, and Insurance — the core costs lenders look at when determining what you can afford." />
        </div>
        <p className="text-3xl font-bold text-foreground">
          {formatCurrency(calculations.monthlyPITI)}
        </p>
        <p className="text-sm text-muted-foreground">
          {incomePercent}% of your monthly income (
          {formatCurrency(calculations.monthlyIncome)})
        </p>
      </div>

      {/* Chart + Legend */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mx-auto h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pitiItems}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {pitiItems.map((entry, index) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {pitiItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-foreground">{item.name}</span>
                {item.name === "PMI" && (
                  <InfoPopover text="Private Mortgage Insurance is required when your down payment is less than 20%. It typically drops off once you reach 20% equity in the home." />
                )}
              </div>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total Housing Cost */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-1 flex items-center gap-1.5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Total Monthly Housing Cost
          </h2>
          <InfoPopover text="This includes PITI plus your additional living costs like utilities, maintenance, and HOA fees." />
        </div>
        <p className="mb-3 text-3xl font-bold text-foreground">
          {formatCurrency(calculations.totalMonthlyHousingCost)}
        </p>

        <div className="flex flex-col gap-1.5 border-t border-border pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">PITI</span>
            <span className="font-medium text-foreground">
              {formatCurrency(calculations.monthlyPITI)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Utilities</span>
            <span className="font-medium text-foreground">
              {formatCurrency(data.utilities)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Maintenance</span>
            <span className="font-medium text-foreground">
              {formatCurrency(data.maintenance)}
            </span>
          </div>
          {data.hoaFees > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">HOA Fees</span>
              <span className="font-medium text-foreground">
                {formatCurrency(data.hoaFees)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Income Comparison */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Compared to your income
        </h3>
        <div className="mb-2 h-4 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${Math.min((calculations.totalMonthlyHousingCost / calculations.monthlyIncome) * 100, 100)}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Housing: {formatCurrency(calculations.totalMonthlyHousingCost)}
          </span>
          <span>
            Remaining:{" "}
            {formatCurrency(
              calculations.monthlyIncome -
                calculations.totalMonthlyHousingCost
            )}
          </span>
        </div>
      </div>

      {/* Loan Summary */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-2xl bg-primary/5 p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Loan Amount
          </p>
          <p className="text-lg font-bold text-foreground">
            {formatCurrency(calculations.loanAmount)}
          </p>
        </div>
        <div className="flex-1 rounded-2xl bg-primary/5 p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Down Payment
          </p>
          <p className="text-lg font-bold text-foreground">
            {formatCurrency(calculations.downPayment)}
          </p>
        </div>
      </div>

      {/* Continue */}
      <button
        onClick={() => setCurrentStep(3)}
        className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
      >
        Check Affordability
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
