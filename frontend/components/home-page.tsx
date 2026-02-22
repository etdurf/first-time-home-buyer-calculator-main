"use client";

import { useMortgage } from "@/lib/mortgage-context";
import {
  Calculator,
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  Lock,
} from "lucide-react";

export function HomePage() {
  const { setCurrentStep } = useMortgage();

  return (
    <div className="flex flex-col pb-10">
      {/* Hero */}
      <section className="px-5 pb-8 pt-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">
            Takes about 2 minutes
          </span>
        </div>
        <h1 className="mb-3 text-balance text-3xl font-bold leading-tight tracking-tight text-foreground">
          See if buying a home is possible this year
        </h1>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground">
          Understand what you can realistically afford — without pressure,
          confusion, or sales pitches.
        </p>
      </section>

      {/* What to expect */}
      <section className="px-5 pb-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            What to expect
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Just move a few sliders and get instant results. No account needed,
            no credit check, no personal data collected.
          </p>
          <div className="flex flex-col gap-3">
            {[
              {
                icon: Calculator,
                title: "Real-Time Calculations",
                desc: "Adjust home price, income, and terms to see monthly payments update instantly.",
              },
              {
                icon: TrendingUp,
                title: "Affordability Insights",
                desc: "Your debt-to-income ratio and personalized guidance on what you can realistically afford.",
              },
              {
                icon: Lightbulb,
                title: "First-Time Buyer Tips",
                desc: "Plain-language advice on saving, inspections, and loan options tailored to your situation.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-3.5 rounded-xl bg-muted/50 p-3.5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Use */}
      <section className="px-5 pb-8">
        <h2 className="mb-3 text-lg font-bold text-foreground">
          Why use this calculator?
        </h2>
        <div className="flex flex-col gap-2.5">
          {[
            "No pressure, no sales pitches — just honest calculations",
            "Compare different loan terms side by side",
            "See the long-term financial impact of your decisions",
            "Test different scenarios with easy-to-use sliders",
          ].map((text) => (
            <div key={text} className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <p className="text-sm leading-relaxed text-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5">
        <button
          onClick={() => setCurrentStep(1)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </button>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span className="text-xs">Private</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            <span className="text-xs">No data stored</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">~2 min</span>
          </div>
        </div>
      </section>
    </div>
  );
}
