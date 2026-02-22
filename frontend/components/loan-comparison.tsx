"use client";

import { useMortgage, formatCurrency } from "@/lib/mortgage-context";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertTriangle,
  Star,
} from "lucide-react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  Cell,
} from "recharts";

function calcForTerm(
  loanAmount: number,
  rate: number,
  term: number
) {
  const monthlyRate = rate / 100 / 12;
  const n = term * 12;
  let payment: number;
  if (monthlyRate > 0) {
    payment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
      (Math.pow(1 + monthlyRate, n) - 1);
  } else {
    payment = loanAmount / n;
  }
  const totalInterest = payment * n - loanAmount;
  const totalCost = payment * n;
  return { payment, totalInterest, totalCost };
}

export function LoanComparison() {
  const { data, calculations, setCurrentStep, updateData } = useMortgage();
  const [selectedTerm, setSelectedTerm] = useState<15 | 20 | 30 | null>(
    null
  );

  const terms = [15, 20, 30] as const;
  const termData = terms.map((term) => {
    const calc = calcForTerm(
      calculations.loanAmount,
      data.interestRate,
      term
    );
    return {
      term,
      ...calc,
    };
  });

  const thirtyYearInterest = termData.find((t) => t.term === 30)!.totalInterest;

  const termCards: {
    term: 15 | 20 | 30;
    badge: string;
    pros: string[];
    cons: string[];
  }[] = [
    {
      term: 15,
      badge: "Pay off fastest",
      pros: ["Huge savings on interest", "Debt-free faster"],
      cons: ["Highest monthly payment", "Less budget flexibility"],
    },
    {
      term: 20,
      badge: "Middle ground",
      pros: ["Balanced payment", "Good savings"],
      cons: ["Higher than 30-year", "Less common option"],
    },
    {
      term: 30,
      badge: "Most common",
      pros: ["Lowest payment", "Most flexibility"],
      cons: ["Most interest paid", "Longer debt period"],
    },
  ];

  const chartData = termData.map((d) => ({
    name: `${d.term}yr`,
    "Monthly Payment": Math.round(d.payment),
    "Total Interest": Math.round(d.totalInterest),
  }));

  // Determine which term is best for this user's affordability
  const recommendedTerm = (() => {
    const income = data.annualIncome / 12;
    const t15 = termData[0];
    const t15Dti =
      ((t15.payment +
        calculations.monthlyPropertyTax +
        calculations.monthlyInsurance +
        calculations.monthlyPMI) /
        income) *
      100;
    if (t15Dti <= 28) return 15;
    const t20 = termData[1];
    const t20Dti =
      ((t20.payment +
        calculations.monthlyPropertyTax +
        calculations.monthlyInsurance +
        calculations.monthlyPMI) /
        income) *
      100;
    if (t20Dti <= 28) return 20;
    return 30;
  })();

  return (
    <div className="flex flex-col gap-4 px-5 pb-10 pt-6">
      {/* Header */}
      <div className="mb-2">
        <div className="mb-1 flex items-center gap-2">
          <button
            onClick={() => setCurrentStep(4)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Step 5 of 6
          </p>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Loan Term Comparison
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lower payments mean higher interest over time. Here's exactly how
          much.
        </p>
      </div>

      {/* Term Cards */}
      {termCards.map((card) => {
        const d = termData.find((t) => t.term === card.term)!;
        const interestSavings = thirtyYearInterest - d.totalInterest;
        const isRecommended = card.term === recommendedTerm;
        const isSelected = selectedTerm === card.term;

        return (
          <button
            key={card.term}
            onClick={() => setSelectedTerm(card.term)}
            className={`w-full rounded-2xl border p-4 text-left transition-all ${
              isSelected
                ? "border-primary bg-primary/5 shadow-md"
                : isRecommended
                  ? "border-primary/30 bg-card"
                  : "border-border bg-card"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">
                  {card.term} years
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                    isRecommended
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isRecommended ? "Recommended for you" : card.badge}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(d.payment)}
                </p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>
            </div>

            <div className="mb-3 flex gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Total Interest</span>
                <p className="font-semibold text-foreground">
                  {formatCurrency(d.totalInterest)}
                </p>
              </div>
              {interestSavings > 0 && (
                <div>
                  <span className="text-muted-foreground">
                    Interest Savings
                  </span>
                  <p className="font-semibold text-success">
                    {formatCurrency(interestSavings)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-success">
                  <Check className="h-3 w-3" /> Pros
                </p>
                {card.pros.map((pro) => (
                  <p
                    key={pro}
                    className="text-xs leading-relaxed text-muted-foreground"
                  >
                    {pro}
                  </p>
                ))}
              </div>
              <div className="flex-1">
                <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-accent">
                  <AlertTriangle className="h-3 w-3" /> Cons
                </p>
                {card.cons.map((con) => (
                  <p
                    key={con}
                    className="text-xs leading-relaxed text-muted-foreground"
                  >
                    {con}
                  </p>
                ))}
              </div>
            </div>

            {isSelected && (
              <div className="mt-3 rounded-xl bg-primary/10 px-3 py-2">
                <p className="text-xs font-medium text-primary">
                  Tap "Apply & Continue" below to use this term.
                </p>
              </div>
            )}
          </button>
        );
      })}

      {/* Chart */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Payment vs. Total Interest
        </h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <RechartsTooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px" }}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="Monthly Payment"
                fill="hsl(172, 50%, 36%)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="Total Interest"
                fill="hsl(38, 92%, 50%)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insight */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <h3 className="mb-2 text-sm font-bold text-foreground">
          Choosing the Right Term
        </h3>
        <div className="flex flex-col gap-2">
          <p className="text-sm leading-relaxed text-muted-foreground">
            A <strong className="text-foreground">15-year loan</strong> saves
            you{" "}
            <strong className="text-foreground">
              {formatCurrency(
                thirtyYearInterest - termData[0].totalInterest
              )}
            </strong>{" "}
            in interest but requires a higher monthly payment.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Consider your financial goals, job stability, and other savings
            priorities when choosing.
          </p>
        </div>
      </div>

      {/* Continue */}
      <button
        onClick={() => {
          if (selectedTerm) {
            updateData({ loanTerm: selectedTerm });
          }
          setCurrentStep(6);
        }}
        className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
      >
        {selectedTerm ? "Apply & Continue" : "See Long-Term Costs"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
