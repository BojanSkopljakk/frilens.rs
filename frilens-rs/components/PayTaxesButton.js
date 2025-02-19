"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PayTaxesButton({
  userId,
  year,
  quarter,
  model,
  totalTax,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function checkIfPaid() {
      try {
        const response = await axios.get(
          `/api/paid-taxes?userId=${userId}&year=${year}&quarter=${quarter}`
        );
        if (response.data.paid) {
          setHasPaid(true);
        }
      } catch (error) {
        console.error("❌ Failed to check tax payment status:", error);
      }
    }
    checkIfPaid();
  }, [userId, year, quarter]);

  async function handlePayTaxes() {
    if (hasPaid) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      await axios.post("/api/paid-taxes", {
        userId,
        year,
        quarter,
        model,
        totalTax,
      });

      setHasPaid(true);
      alert("✅ Taxes successfully paid!");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "❌ An error occurred while paying taxes."
      );
    }

    setIsLoading(false);
  }

  return (
    <div className="mt-4">
      <button
        className={`btn btn-success w-full ${
          hasPaid ? "btn-disabled opacity-50" : ""
        }`}
        onClick={handlePayTaxes}
        disabled={hasPaid || isLoading}
      >
        {isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : hasPaid ? (
          "✅ Already Paid"
        ) : (
          "💵 Pay Taxes"
        )}
      </button>
      {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
    </div>
  );
}
