"use client";

import React from "react"

import { useState } from "react";
import { useMortgage } from "@/lib/mortgage-context";
import {
  Home,
  SlidersHorizontal,
  PieChart,
  ShieldCheck,
  Lightbulb,
  GitCompareArrows,
  TrendingUp,
  X,
  Menu,
  ChevronRight,
  Check,
} from "lucide-react";

const steps = [
  {
    id: 0,
    label: "Home",
    description: "Start your journey",
    icon: Home,
    phase: "Start",
  },
  {
    id: 1,
    label: "Mortgage Details",
    description: "Enter your financial info",
    icon: SlidersHorizontal,
    phase: "Inputs",
  },
  {
    id: 2,
    label: "Payment Breakdown",
    description: "See your monthly costs",
    icon: PieChart,
    phase: "Results",
  },
  {
    id: 3,
    label: "Affordability",
    description: "Check your debt-to-income",
    icon: ShieldCheck,
    phase: "Results",
  },
  {
    id: 4,
    label: "Buyer Tips",
    description: "Practical advice for you",
    icon: Lightbulb,
    phase: "Guidance",
  },
  {
    id: 5,
    label: "Loan Comparison",
    description: "Compare 15, 20, and 30 year",
    icon: GitCompareArrows,
    phase: "Guidance",
  },
  {
    id: 6,
    label: "Long-Term Costs",
    description: "Full picture over time",
    icon: TrendingUp,
    phase: "Guidance",
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentStep, setCurrentStep, completedSteps } = useMortgage();

  const phases = ["Start", "Inputs", "Results", "Guidance"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-card px-4 py-3 shadow-sm">
        <button
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Home className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            HomeReady
          </span>
        </div>
        <div className="w-10" />
      </header>

      {/* Progress bar */}
      {currentStep > 0 && (
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-lg">{children}</main>

      {/* Slide-over Menu */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close menu"
          />
          <nav
            className="fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto bg-card shadow-xl"
            role="navigation"
            aria-label="Step navigation"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Menu
                </p>
                <h2 className="text-lg font-bold text-foreground">
                  Home Buying Journey
                </h2>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-3 pb-6">
              {phases.map((phase) => {
                const phaseSteps = steps.filter((s) => s.phase === phase);
                return (
                  <div key={phase} className="mb-4">
                    <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {phase}
                    </p>
                    {phaseSteps.map((step) => {
                      const isActive = currentStep === step.id;
                      const isCompleted = completedSteps.has(step.id);
                      const Icon = step.icon;
                      return (
                        <button
                          key={step.id}
                          onClick={() => {
                            setCurrentStep(step.id);
                            setMenuOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : isCompleted
                                  ? "bg-success/15 text-success"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isCompleted && !isActive ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Icon className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}
                            >
                              {step.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                          {isActive && (
                            <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
