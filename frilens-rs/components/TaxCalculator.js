"use client";

import { useState, useEffect } from "react";
import PayTaxesButton from "./PayTaxesButton";

export default function TaxCalculator({ userId, payments }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState(1);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [totalIncomeRSD, setTotalIncomeRSD] = useState(0);
  const [modelAResult, setModelAResult] = useState(null);
  const [modelBResult, setModelBResult] = useState(null);
  const [hasHealthInsurance, setHasHealthInsurance] = useState(false);

  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch("/api/exchange-rates");
        const data = await response.json();
        console.log("💰 Exchange Rates Fetched:", data);
        setExchangeRates(data);
      } catch (error) {
        console.error("❌ Failed to fetch exchange rates:", error);
      }
    }
    fetchRates();
  }, []);

  function filterPayments() {
    return payments.filter((payment) => {
      const paymentDate = new Date(payment.date);
      const paymentYear = paymentDate.getFullYear();
      const paymentQuarter = Math.ceil((paymentDate.getMonth() + 1) / 3);
      return paymentYear === year && paymentQuarter === quarter;
    });
  }

  function calculateModelA(totalIncome) {
    const NON_TAXABLE_AMOUNT = 96000; // 96,000 RSD per quarter
    const MIN_HEALTH_INSURANCE = 4789; // Minimum health insurance per quarter

    // ✅ Step 1: Calculate Taxable Base
    const taxableIncome = Math.max(totalIncome - NON_TAXABLE_AMOUNT, 0);

    // ✅ Step 2: Calculate Taxes
    const incomeTax = taxableIncome * 0.2; // 20% tax rate
    const pioContribution = taxableIncome * 0.24; // 24% pension contribution

    // ✅ Step 3: Health Insurance Calculation
    let healthInsurance = 0;
    if (!hasHealthInsurance) {
      healthInsurance = Math.max(taxableIncome * 0.103, MIN_HEALTH_INSURANCE);
    }

    // ✅ Step 4: Total Taxes and Contributions
    const totalTax = incomeTax + pioContribution + healthInsurance;

    return {
      model: "A",
      totalIncome,
      taxableIncome: Math.round(taxableIncome),
      incomeTax: Math.round(incomeTax),
      pioContribution: Math.round(pioContribution),
      healthInsurance: Math.round(healthInsurance),
      totalTax: Math.round(totalTax),
    };
  }

  function calculateModelB(totalIncome) {
    const NON_TAXABLE_AMOUNT = 57900; // 57,900 RSD per quarter
    const PIO_MINIMUM = 25218; // Minimum PIO per quarter
    const MIN_HEALTH_INSURANCE = 4789; // Minimum health insurance per quarter

    // ✅ Step 1: Calculate Taxable Income
    const taxableIncome =
      totalIncome - (NON_TAXABLE_AMOUNT + totalIncome * 0.34);

    // ✅ Step 2: Income Tax (10% of taxable income)
    const incomeTax = taxableIncome * 0.1;

    // ✅ Step 3: PIO Contribution (Minimum 25,218 RSD or 24% of taxable income)
    const pioContribution = Math.max(taxableIncome * 0.24, PIO_MINIMUM);

    // ✅ Step 4: Health Insurance Calculation
    let healthInsurance = 0;
    if (!hasHealthInsurance) {
      healthInsurance = Math.max(taxableIncome * 0.103, MIN_HEALTH_INSURANCE);
    }

    // ✅ Step 5: Total Taxes and Contributions
    const totalTax = incomeTax + pioContribution + healthInsurance;

    return {
      model: "B",
      totalIncome,
      taxableIncome: Math.round(taxableIncome),
      incomeTax: Math.round(incomeTax),
      pioContribution: Math.round(pioContribution),
      healthInsurance: Math.round(healthInsurance),
      totalTax: Math.round(totalTax),
    };
  }

  function calculateTaxes() {
    if (!exchangeRates) {
      console.error("❌ Exchange rates not loaded yet.");
      return;
    }

    const filteredPayments = filterPayments();
    let totalRSD = 0;

    const rsdRate = exchangeRates["RSD"];
    if (!rsdRate) {
      console.error("❌ Missing exchange rate for RSD");
      return;
    }

    filteredPayments.forEach((payment) => {
      const currencyRate = exchangeRates[payment.currency];

      if (!currencyRate) {
        console.warn(`⚠️ No exchange rate found for ${payment.currency}`);
        return;
      }

      const amountInRSD = (payment.amount / currencyRate) * rsdRate;
      console.log(
        `💱 Converting ${payment.amount} ${payment.currency} to RSD: ${amountInRSD}`
      );
      totalRSD += amountInRSD;
    });

    console.log("✅ Total Converted RSD:", totalRSD);
    setTotalIncomeRSD(totalRSD);

    setModelAResult(calculateModelA(totalRSD));
    setModelBResult(calculateModelB(totalRSD));
  }

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="font-bold text-lg">📊 Calculate Taxes</h2>

      <label className="form-control w-full">
        <span className="label-text">Select Year:</span>
        <select
          className="select select-bordered w-full"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {[2023, 2024, 2025].map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </label>

      <label className="form-control w-full">
        <span className="label-text">Select Quarter:</span>
        <select
          className="select select-bordered w-full"
          value={quarter}
          onChange={(e) => setQuarter(Number(e.target.value))}
        >
          <option value={1}>Q1 (Jan - Mar)</option>
          <option value={2}>Q2 (Apr - Jun)</option>
          <option value={3}>Q3 (Jul - Sep)</option>
          <option value={4}>Q4 (Oct - Dec)</option>
        </select>
      </label>

      {/* ✅ Checkbox for Health Insurance */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          className="checkbox"
          checked={hasHealthInsurance}
          onChange={() => setHasHealthInsurance(!hasHealthInsurance)}
        />
        <span className="label-text">I already have health insurance</span>
      </label>

      <button className="btn btn-primary w-full" onClick={calculateTaxes}>
        Calculate Taxes
      </button>

      {totalIncomeRSD > 0 && (
        <div className="mt-4">
          <p className="text-lg font-bold">
            💰 Total Income (RSD): {totalIncomeRSD.toLocaleString()}
          </p>

          {modelAResult && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-bold text-md">📌 Model A</h3>
              <p>
                💸 Taxable Income: {modelAResult.taxableIncome.toLocaleString()}{" "}
                RSD
              </p>
              <p>
                🧾 Income Tax (20%): {modelAResult.incomeTax.toLocaleString()}{" "}
                RSD
              </p>
              <p>
                🏦 PIO Contribution (24%):{" "}
                {modelAResult.pioContribution.toLocaleString()} RSD
              </p>
              <p>
                🩺 Health Insurance:{" "}
                {modelAResult.healthInsurance.toLocaleString()} RSD
              </p>
              <p className="font-bold">
                💵 Total Tax: {modelAResult.totalTax.toLocaleString()} RSD
              </p>
              <PayTaxesButton
                userId={userId}
                year={year}
                quarter={quarter}
                model="A"
                totalTax={modelAResult.totalTax}
              />
            </div>
          )}

          {modelBResult && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-bold text-md">📌 Model B</h3>
              <p>
                💸 Taxable Income: {modelBResult.taxableIncome.toLocaleString()}{" "}
                RSD
              </p>
              <p>
                🧾 Income Tax (10%): {modelBResult.incomeTax.toLocaleString()}{" "}
                RSD
              </p>
              <p>
                🏦 PIO Contribution (24%):{" "}
                {modelBResult.pioContribution.toLocaleString()} RSD
              </p>
              <p>
                🩺 Health Insurance:{" "}
                {modelBResult.healthInsurance.toLocaleString()} RSD
              </p>
              <p className="font-bold">
                💵 Total Tax: {modelBResult.totalTax.toLocaleString()} RSD
              </p>
              <PayTaxesButton
                userId={userId}
                year={year}
                quarter={quarter}
                model="B"
                totalTax={modelAResult.totalTax}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
