"use client";

import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StatsChart({ payments, userId }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState(1);
  const [paidTaxes, setPaidTaxes] = useState([]);
  const [exchangeRates, setExchangeRates] = useState(null);

  // ✅ Fetch Exchange Rates
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

  // ✅ Fetch Paid Taxes
  useEffect(() => {
    async function fetchPaidTaxes() {
      try {
        const response = await fetch(
          `/api/paid-taxes?userId=${userId}&year=${year}&quarter=${quarter}`
        );
        const data = await response.json();
        console.log("📊 Paid Taxes Data:", data);
        setPaidTaxes(data.paidTaxes);
      } catch (error) {
        console.error("❌ Failed to fetch paid taxes:", error);
      }
    }

    if (userId) {
      fetchPaidTaxes();
    }
  }, [userId, year, quarter]);

  // ✅ Calculate Total Income in RSD
  function calculateTotalIncome() {
    if (!exchangeRates) {
      console.error("❌ Exchange rates not loaded yet.");
      return 0;
    }

    const filteredPayments = payments.filter((payment) => {
      const paymentDate = new Date(payment.date);
      const paymentYear = paymentDate.getFullYear();
      const paymentQuarter = Math.ceil((paymentDate.getMonth() + 1) / 3);
      return paymentYear === year && paymentQuarter === quarter;
    });

    let totalRSD = 0;

    // ✅ Get the RSD exchange rate
    const rsdRate = exchangeRates["RSD"];
    if (!rsdRate) {
      console.error("❌ Missing exchange rate for RSD");
      return 0;
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

    console.log("✅ Total Income in RSD:", totalRSD);

    return totalRSD;
  }

  // ✅ Calculate Total Income and Total Taxes
  const totalIncome = calculateTotalIncome();
  const totalTaxes = paidTaxes
    .filter((tax) => tax.year === year && tax.quarter === quarter)
    .reduce((sum, tax) => sum + tax.totalTax, 0);

  const chartData = {
    labels: ["Income", "Paid Taxes"],
    datasets: [
      {
        label: "RSD",
        data: [totalIncome, totalTaxes],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${context.raw.toLocaleString()} RSD`,
        },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-base-100 rounded-lg shadow-lg">
      <div className="max-w-lg mx-auto mb-10 space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Select Year:</span>
          </label>
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
        </div>

        <div>
          <label className="label">
            <span className="label-text">Select Quarter:</span>
          </label>
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
        </div>
      </div>

      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}
