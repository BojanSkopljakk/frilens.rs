"use client"; // ✅ Make sure this is included at the top

import { useState, useEffect } from "react";

export default function TaxCalculator({ payments }) {
  // ✅ Use default export
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState(1);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [totalIncomeRSD, setTotalIncomeRSD] = useState(0);
  const [taxOption1, setTaxOption1] = useState(0);
  const [taxOption2, setTaxOption2] = useState(0);

  // Fetch exchange rates
  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch("/api/exchange-rates");
        const data = await response.json();
        console.log("💰 Exchange Rates Fetched:", data); // ✅ Debug API response
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

  function calculateTaxes() {
    if (!exchangeRates) {
      console.error("❌ Exchange rates not loaded yet.");
      return;
    }

    const filteredPayments = filterPayments();
    let totalRSD = 0;

    // ✅ Get the RSD exchange rate
    const rsdRate = exchangeRates["RSD"];
    if (!rsdRate) {
      console.error("❌ Missing exchange rate for RSD");
      return;
    }

    filteredPayments.forEach((payment) => {
      const currencyRate = exchangeRates[payment.currency]; // ✅ Get rate to USD

      if (!currencyRate) {
        console.warn(`⚠️ No exchange rate found for ${payment.currency}`);
        return;
      }

      // ✅ Convert amount to USD, then to RSD
      const amountInRSD = (payment.amount / currencyRate) * rsdRate;

      console.log(
        `💱 Converting ${payment.amount} ${payment.currency} to RSD: ${amountInRSD}`
      );

      totalRSD += amountInRSD;
    });

    console.log("✅ Total Converted RSD:", totalRSD);

    setTotalIncomeRSD(totalRSD);

    // ✅ Example Tax Formula (Replace with actual logic)
    setTaxOption1(totalRSD * 0.1); // 10% Tax
    setTaxOption2(totalRSD * 0.15); // 15% Tax
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

      <button className="btn btn-primary w-full" onClick={calculateTaxes}>
        Calculate Taxes
      </button>

      {totalIncomeRSD > 0 && (
        <div className="mt-4">
          <p className="text-lg font-bold">
            Total Income (RSD): {totalIncomeRSD.toLocaleString()}
          </p>
          <p>💸 Tax Option 1 (10%): {taxOption1.toLocaleString()} RSD</p>
          <p>💸 Tax Option 2 (15%): {taxOption2.toLocaleString()} RSD</p>
        </div>
      )}
    </div>
  );
}
