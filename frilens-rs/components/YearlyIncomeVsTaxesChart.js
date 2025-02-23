"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function YearlyIncomeVsTaxesChart({ userId }) {
  const [yearlyData, setYearlyData] = useState({
    labels: [],
    datasets: [],
  });
  const [isMounted, setIsMounted] = useState(false);

  // ✅ Fix Hydration Error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ Fetch Yearly Income and Taxes
  useEffect(() => {
    async function fetchYearlyData() {
      try {
        const response = await fetch(`/api/yearly-stats?userId=${userId}`);
        const data = await response.json();
        console.log("📊 Yearly Data:", data);

        // ✅ Handle Undefined Data Gracefully
        const years = Object.keys(data.yearlyIncome || {});
        const income = Object.values(data.yearlyIncome || {});
        const taxes = data.paidTaxes?.map((tax) => tax.totalTaxes) || [];

        setYearlyData({
          labels: years,
          datasets: [
            {
              label: "Income",
              data: income,
              borderColor: "#4caf50",
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Paid Taxes",
              data: taxes,
              borderColor: "#f44336",
              backgroundColor: "rgba(244, 67, 54, 0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error("❌ Failed to fetch yearly data:", error);
      }
    }

    if (userId) {
      fetchYearlyData();
    }
  }, [userId]);

  // ✅ Conditionally Render to Fix Hydration Error
  if (!isMounted) return null;

  // ✅ Chart.js Options
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
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-base-100 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-center mb-4">
        📈 Income vs. Paid Taxes (Yearly)
      </h3>
      <Line data={yearlyData} options={chartOptions} />
    </div>
  );
}
