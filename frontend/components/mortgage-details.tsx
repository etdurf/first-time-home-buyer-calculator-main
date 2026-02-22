"use client";

import React from "react";
import { useState, useEffect } from "react";

import { useMortgage, formatCurrency } from "@/lib/mortgage-context";
import {
  Home,
  DollarSign,
  Percent,
  Calendar,
  Wrench,
  Info,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        onClick={() => setShow(!show)}
        onBlur={() => setShow(false)}
        className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="More info"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-xl bg-foreground px-3 py-2 text-xs leading-relaxed text-background shadow-lg">
          {text}
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-foreground" />
        </div>
      )}
    </span>
  );
}

function SliderField({
  icon: Icon,
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  hint,
  tooltip,
  warning,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  hint?: string;
  tooltip?: string;
  warning?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">{label}</span>
          {tooltip && <Tooltip text={tooltip} />}
        </div>
        <span className="text-base font-bold text-foreground">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
        aria-label={label}
      />
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
      {hint && !warning && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
      {warning && (
        <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-accent">
          {warning}
        </p>
      )}
    </div>
  );
}

export function MortgageDetails() {
  const { data, updateData, calculations, setCurrentStep } = useMortgage();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const userId = 1; // Default user ID - in production this would come from auth

  // Load saved mortgage settings on mount
  useEffect(() => {
    if (isLoaded) return; // Prevent reloading

    const loadMortgageSettings = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/users/${userId}/mortgage-settings`,
        );
        const settings = await response.json();
        console.log("📥 Loaded mortgage settings:", settings);

        const updates: any = {};

        if (settings.loan_term && [15, 20, 30].includes(settings.loan_term)) {
          console.log(`✓ Restoring loan term: ${settings.loan_term} years`);
          updates.loanTerm = settings.loan_term as 15 | 20 | 30;
        }

        if (settings.home_price) {
          updates.homePrice = parseFloat(settings.home_price);
        }

        if (settings.down_payment_percent) {
          updates.downPaymentPercent = parseFloat(
            settings.down_payment_percent,
          );
        }

        if (settings.interest_rate) {
          updates.interestRate = parseFloat(settings.interest_rate);
        }

        if (settings.annual_income) {
          updates.annualIncome = parseFloat(settings.annual_income);
        }

        if (Object.keys(updates).length > 0) {
          updateData(updates);
        }

        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to load mortgage settings:", err);
        setIsLoaded(true);
      }
    };
    loadMortgageSettings();
  }, [userId, isLoaded, updateData]);

  // Save loan term to database
  const saveLoanTerm = async (term: 15 | 20 | 30) => {
    setIsSaving(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/${userId}/mortgage-settings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            loan_term: term,
            home_price: data.homePrice,
            down_payment_percent: data.downPaymentPercent,
            interest_rate: data.interestRate,
            annual_income: data.annualIncome,
          }),
        },
      );
      if (!response.ok) throw new Error("Failed to save");
      console.log("✓ Loan term saved to database");
    } catch (err) {
      console.error("Failed to save loan term:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save all settings when they change (debounced)
  useEffect(() => {
    if (!isLoaded) return; // Don't save during initial load

    const timeoutId = setTimeout(async () => {
      try {
        await fetch(
          `http://localhost:3001/api/users/${userId}/mortgage-settings`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              loan_term: data.loanTerm,
              home_price: data.homePrice,
              down_payment_percent: data.downPaymentPercent,
              interest_rate: data.interestRate,
              annual_income: data.annualIncome,
            }),
          },
        );
        console.log("✓ Settings auto-saved");
      } catch (err) {
        console.error("Failed to auto-save settings:", err);
      }
    }, 1000); // Save 1 second after user stops adjusting

    return () => clearTimeout(timeoutId);
  }, [data, userId, isLoaded]);

  const downPaymentDollar = data.homePrice * (data.downPaymentPercent / 100);
  const priceToIncomeRatio = data.homePrice / data.annualIncome;

  const getHomePriceWarning = () => {
    if (priceToIncomeRatio > 5)
      return "This is more than 5x your income, which is higher than typically recommended.";
    return undefined;
  };

  const getDownPaymentHint = () => {
    if (data.downPaymentPercent < 20)
      return `Below 20% means you'll pay PMI (~${formatCurrency(calculations.monthlyPMI)}/mo). 20% eliminates PMI entirely.`;
    return "Great! At 20%+ you avoid PMI costs.";
  };

  const getInterestHint = () => {
    if (data.interestRate < 5) return "Below average for current market rates.";
    if (data.interestRate > 7.5)
      return "Above average — consider shopping around with multiple lenders.";
    return "This is within a typical range for current rates.";
  };

  return (
    <div className="flex flex-col gap-4 px-5 pb-10 pt-6">
      {/* Header */}
      <div className="mb-2">
        <div className="mb-1 flex items-center gap-2">
          <button
            onClick={() => setCurrentStep(0)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Step 1 of 6
          </p>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Mortgage Details</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Adjust the sliders to match your situation. No need to be exact —
          estimates work great.
        </p>
      </div>

      {/* Sliders */}
      <SliderField
        icon={Home}
        label="Home Price"
        value={data.homePrice}
        min={100000}
        max={1000000}
        step={5000}
        format={formatCurrency}
        onChange={(v) => updateData({ homePrice: v })}
        warning={getHomePriceWarning()}
        hint="The median home price in the US is ~$420k."
      />

      <SliderField
        icon={DollarSign}
        label="Annual Income"
        value={data.annualIncome}
        min={30000}
        max={200000}
        step={1000}
        format={formatCurrency}
        onChange={(v) => updateData({ annualIncome: v })}
        hint="Your total household income before taxes."
      />

      <SliderField
        icon={Percent}
        label="Down Payment"
        value={data.downPaymentPercent}
        min={0}
        max={50}
        step={1}
        format={(v) => `${v}% (${formatCurrency(data.homePrice * (v / 100))})`}
        onChange={(v) => updateData({ downPaymentPercent: v })}
        hint={getDownPaymentHint()}
        tooltip="The upfront cash you pay toward the home. More down means a smaller loan and lower monthly payments."
      />

      <SliderField
        icon={Percent}
        label="Interest Rate"
        value={data.interestRate}
        min={3}
        max={10}
        step={0.1}
        format={(v) => `${v.toFixed(1)}%`}
        onChange={(v) => updateData({ interestRate: v })}
        hint={getInterestHint()}
        tooltip="The annual rate your lender charges. Your actual rate depends on credit score, loan type, and market conditions."
      />

      {/* Loan Term */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Calendar className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">Loan Term</span>
          <Tooltip text="How long you'll take to repay. Shorter terms have higher payments but much less interest overall." />
        </div>
        <div className="flex gap-2">
          {([15, 20, 30] as const).map((term) => (
            <button
              key={term}
              onClick={() => {
                updateData({ loanTerm: term });
                saveLoanTerm(term);
              }}
              disabled={isSaving}
              className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all ${
                data.loanTerm === term
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {term} years
            </button>
          ))}
        </div>
      </div>

      {/* Additional Costs */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Wrench className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">
            Additional Monthly Costs
          </span>
        </div>
        {[
          {
            label: "Utilities",
            key: "utilities" as const,
            typical: "$150-$300/mo is typical",
          },
          {
            label: "Maintenance",
            key: "maintenance" as const,
            typical: "$100-$250/mo is typical",
          },
          {
            label: "HOA Fees",
            key: "hoaFees" as const,
            typical: "$0 if no HOA",
          },
        ].map((cost) => (
          <div key={cost.key} className="mb-3 last:mb-0">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">{cost.label}</span>
              <div className="flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5">
                <span className="text-xs text-muted-foreground">$</span>
                <input
                  type="number"
                  value={data[cost.key]}
                  onChange={(e) =>
                    updateData({ [cost.key]: Number(e.target.value) || 0 })
                  }
                  className="w-16 bg-transparent text-right text-sm font-semibold text-foreground outline-none"
                  aria-label={cost.label}
                />
              </div>
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {cost.typical}
            </p>
          </div>
        ))}
      </div>

      {/* Live Summary */}
      <div className="rounded-2xl bg-primary/5 p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">
          Quick preview
        </p>
        <p className="text-2xl font-bold text-foreground">
          {formatCurrency(calculations.monthlyPITI)}
          <span className="text-sm font-normal text-muted-foreground">
            /mo estimated
          </span>
        </p>
      </div>

      {/* Continue */}
      <button
        onClick={() => setCurrentStep(2)}
        className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
      >
        See Payment Breakdown
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
