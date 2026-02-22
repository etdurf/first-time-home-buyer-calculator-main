"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface MortgageData {
  homePrice: number;
  annualIncome: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: 15 | 20 | 30;
  utilities: number;
  maintenance: number;
  hoaFees: number;
  monthlyDebts: number;
}

const defaultData: MortgageData = {
  homePrice: 350000,
  annualIncome: 75000,
  downPaymentPercent: 10,
  interestRate: 6.5,
  loanTerm: 30,
  utilities: 200,
  maintenance: 150,
  hoaFees: 0,
  monthlyDebts: 0,
};

interface MortgageCalculations {
  loanAmount: number;
  downPayment: number;
  monthlyPrincipalInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  monthlyPITI: number;
  totalMonthlyHousingCost: number;
  monthlyIncome: number;
  housingDTI: number;
  totalDTI: number;
  totalInterest: number;
  totalCost: number;
  principalPayment: number;
  interestPayment: number;
}

function calculateMortgage(data: MortgageData): MortgageCalculations {
  const downPayment = data.homePrice * (data.downPaymentPercent / 100);
  const loanAmount = data.homePrice - downPayment;
  const monthlyRate = data.interestRate / 100 / 12;
  const numPayments = data.loanTerm * 12;

  let monthlyPrincipalInterest = 0;
  if (monthlyRate > 0) {
    monthlyPrincipalInterest =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  } else {
    monthlyPrincipalInterest = loanAmount / numPayments;
  }

  const monthlyPropertyTax = (data.homePrice * 0.012) / 12;
  const monthlyInsurance = (data.homePrice * 0.0015) / 12;
  const monthlyPMI = data.downPaymentPercent < 20 ? (loanAmount * 0.005) / 12 : 0;

  const interestPayment = loanAmount * monthlyRate;
  const principalPayment = monthlyPrincipalInterest - interestPayment;

  const monthlyPITI =
    monthlyPrincipalInterest +
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyPMI;

  const totalMonthlyHousingCost =
    monthlyPITI + data.utilities + data.maintenance + data.hoaFees;

  const monthlyIncome = data.annualIncome / 12;
  const housingDTI = (monthlyPITI / monthlyIncome) * 100;
  const totalDTI =
    ((totalMonthlyHousingCost + data.monthlyDebts) / monthlyIncome) * 100;

  const totalInterest =
    monthlyPrincipalInterest * numPayments - loanAmount;
  const totalCost =
    downPayment +
    monthlyPrincipalInterest * numPayments +
    monthlyPropertyTax * numPayments +
    monthlyInsurance * numPayments +
    monthlyPMI * numPayments;

  return {
    loanAmount,
    downPayment,
    monthlyPrincipalInterest,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyPMI,
    monthlyPITI,
    totalMonthlyHousingCost,
    monthlyIncome,
    housingDTI,
    totalDTI,
    totalInterest,
    totalCost,
    principalPayment,
    interestPayment,
  };
}

interface MortgageContextValue {
  data: MortgageData;
  calculations: MortgageCalculations;
  updateData: (updates: Partial<MortgageData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedSteps: Set<number>;
}

const MortgageContext = createContext<MortgageContextValue | null>(null);

export function MortgageProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<MortgageData>(defaultData);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set()
  );

  const updateData = useCallback((updates: Partial<MortgageData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSetCurrentStep = useCallback(
    (step: number) => {
      setCompletedSteps((prev) => {
        const next = new Set(prev);
        for (let i = 0; i < step; i++) {
          next.add(i);
        }
        return next;
      });
      setCurrentStep(step);
    },
    []
  );

  const calculations = calculateMortgage(data);

  return (
    <MortgageContext.Provider
      value={{
        data,
        calculations,
        updateData,
        currentStep,
        setCurrentStep: handleSetCurrentStep,
        completedSteps,
      }}
    >
      {children}
    </MortgageContext.Provider>
  );
}

export function useMortgage() {
  const context = useContext(MortgageContext);
  if (!context) {
    throw new Error("useMortgage must be used within a MortgageProvider");
  }
  return context;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
