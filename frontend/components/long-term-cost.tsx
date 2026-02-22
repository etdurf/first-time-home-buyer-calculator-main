"use client";

import { useMortgage, formatCurrency } from "@/lib/mortgage-context";
import { ArrowLeft, Home, TrendingUp, Lightbulb } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

export function LongTermCost() {
  const { data, calculations, setCurrentStep } = useMortgage();

  const loanAmount = calculations.loanAmount;
  const monthlyRate = data.interestRate / 100 / 12;
  const n = data.loanTerm * 12;
  const monthlyPI = calculations.monthlyPrincipalInterest;

  const totalPrincipal = loanAmount;
  const totalInterest = calculations.totalInterest;
  const totalPropertyTax = calculations.monthlyPropertyTax * n;
  const totalInsurance = calculations.monthlyInsurance * n;
  const totalPMI = calculations.monthlyPMI * Math.min(n, 11 * 12); // PMI for ~11 years
  const totalCost =
    calculations.downPayment +
    totalPrincipal +
    totalInterest +
    totalPropertyTax +
    totalInsurance +
    totalPMI;

  const interestToLoanRatio = ((totalInterest / loanAmount) * 100).toFixed(0);

  // Equity growth data
  const equityData: { name: string; Equity: number; "Remaining Loan": number }[] = [];
  let balance = loanAmount;
  for (let year = 0; year <= data.loanTerm; year += 5) {
    if (year === 0) {
      equityData.push({
        name: `Year 0`,
        Equity: Math.round(calculations.downPayment),
        "Remaining Loan": Math.round(loanAmount),
      });
      continue;
    }
    // Calculate remaining balance at this year
    const paymentsToDate = year * 12;
    if (monthlyRate > 0) {
      balance =
        loanAmount * Math.pow(1 + monthlyRate, paymentsToDate) -
        (monthlyPI * (Math.pow(1 + monthlyRate, paymentsToDate) - 1)) /
          monthlyRate;
    } else {
      balance = loanAmount - monthlyPI * paymentsToDate;
    }
    balance = Math.max(0, balance);
    const equity = data.homePrice - balance;
    equityData.push({
      name: `Year ${year}`,
      Equity: Math.round(equity),
      "Remaining Loan": Math.round(balance),
    });
  }

  // 5-year equity check
  let balance5 = loanAmount;
  if (monthlyRate > 0) {
    balance5 =
      loanAmount * Math.pow(1 + monthlyRate, 60) -
      (monthlyPI * (Math.pow(1 + monthlyRate, 60) - 1)) / monthlyRate;
  } else {
    balance5 = loanAmount - monthlyPI * 60;
  }
  const equity5 = data.homePrice - Math.max(0, balance5);

  const costBreakdown = [
    {
      label: "Down Payment",
      value: calculations.downPayment,
      color: "bg-primary",
    },
    { label: "Total Principal", value: totalPrincipal, color: "bg-chart-1" },
    { label: "Total Interest", value: totalInterest, color: "bg-accent" },
    { label: "Property Tax", value: totalPropertyTax, color: "bg-chart-4" },
    { label: "Insurance", value: totalInsurance, color: "bg-muted-foreground" },
  ];

  if (totalPMI > 0) {
    costBreakdown.push({
      label: "PMI",
      value: totalPMI,
      color: "bg-destructive",
    });
  }

  // Key insight
  const interestMoreThanHome = totalInterest > loanAmount;

  return (
    <div className="flex flex-col gap-4 px-5 pb-10 pt-6">
      {/* Header */}
      <div className="mb-2">
        <div className="mb-1 flex items-center gap-2">
          <button
            onClick={() => setCurrentStep(5)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Step 6 of 6
          </p>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Long-Term Cost Analysis
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The full picture over {data.loanTerm} years — this is a long-term
          scenario, not a monthly view.
        </p>
      </div>

      {/* Key Takeaway */}
      <div className="rounded-2xl bg-accent/10 px-4 py-3">
        <p className="text-sm font-medium text-foreground">
          {interestMoreThanHome
            ? `Interest will cost ${interestToLoanRatio}% of the loan amount — more than the borrowed amount itself.`
            : `Interest will add ${interestToLoanRatio}% to your loan amount over ${data.loanTerm} years.`}
        </p>
      </div>

      {/* Total Cost Card */}
      <div className="rounded-2xl bg-primary px-5 py-5 text-primary-foreground">
        <p className="text-sm font-medium text-primary-foreground/80">
          Total Cost of Home
        </p>
        <p className="text-3xl font-bold">{formatCurrency(totalCost)}</p>
        <p className="text-sm text-primary-foreground/70">
          Over {data.loanTerm} years including all costs
        </p>
      </div>

      {/* Cost Breakdown */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          {costBreakdown.slice(0, 2).map((item) => (
            <div
              key={item.label}
              className="flex-1 rounded-2xl border border-border bg-card p-4"
            >
              <p className="text-xs font-medium text-muted-foreground">
                {item.label}
              </p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(item.value)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          {costBreakdown.slice(2, 4).map((item) => (
            <div
              key={item.label}
              className="flex-1 rounded-2xl border border-border bg-card p-4"
            >
              <p className="text-xs font-medium text-muted-foreground">
                {item.label}
              </p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(item.value)}
              </p>
              {item.label === "Total Interest" && (
                <p className="text-xs text-accent">
                  {interestToLoanRatio}% of loan
                </p>
              )}
              {item.label === "Property Tax" && (
                <p className="text-xs text-muted-foreground">
                  Over {data.loanTerm} years
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          {costBreakdown.slice(4).map((item) => (
            <div
              key={item.label}
              className="flex-1 rounded-2xl border border-border bg-card p-4"
            >
              <p className="text-xs font-medium text-muted-foreground">
                {item.label}
              </p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(item.value)}
              </p>
              {item.label === "PMI" && (
                <p className="text-xs text-muted-foreground">~11 years</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Equity Chart */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Equity Growth Over Time
        </h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={equityData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
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
                dataKey="Equity"
                stackId="a"
                fill="hsl(172, 50%, 36%)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="Remaining Loan"
                stackId="a"
                fill="hsl(210, 14%, 83%)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insights */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Key Insights</h3>
        </div>
        <div className="flex flex-col gap-2.5">
          <Insight
            text={`You'll pay ${formatCurrency(totalInterest)} in interest (${interestToLoanRatio}% of the loan amount).`}
          />
          <Insight
            text={`After 5 years, you'll have built approximately ${formatCurrency(equity5)} in equity.`}
          />
          {data.downPaymentPercent < 20 && (
            <Insight
              text={`Increasing your down payment to 20% would save you ${formatCurrency(totalPMI)} in PMI.`}
            />
          )}
          <Insight
            text={`Property taxes and insurance will add ${formatCurrency(totalPropertyTax + totalInsurance)} over the life of the loan.`}
          />
        </div>
      </div>

      {/* Back Home */}
      <button
        onClick={() => setCurrentStep(0)}
        className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
      >
        <Home className="h-4 w-4" />
        Back to Home
      </button>
    </div>
  );
}

function Insight({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  );
}
