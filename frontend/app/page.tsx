"use client";

import { MortgageProvider, useMortgage } from "@/lib/mortgage-context";
import { AppShell } from "@/components/app-shell";
import { HomePage } from "@/components/home-page";
import { MortgageDetails } from "@/components/mortgage-details";
import { PaymentBreakdown } from "@/components/payment-breakdown";
import { AffordabilityAssessment } from "@/components/affordability-assessment";
import { BuyerTips } from "@/components/buyer-tips";
import { LoanComparison } from "@/components/loan-comparison";
import { LongTermCost } from "@/components/long-term-cost";

function StepRouter() {
  const { currentStep } = useMortgage();

  switch (currentStep) {
    case 0:
      return <HomePage />;
    case 1:
      return <MortgageDetails />;
    case 2:
      return <PaymentBreakdown />;
    case 3:
      return <AffordabilityAssessment />;
    case 4:
      return <BuyerTips />;
    case 5:
      return <LoanComparison />;
    case 6:
      return <LongTermCost />;
    default:
      return <HomePage />;
  }
}

export default function Page() {
  return (
    <MortgageProvider>
      <AppShell>
        <StepRouter />
      </AppShell>
    </MortgageProvider>
  );
}
