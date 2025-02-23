import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Payment from "@/models/Payment";
import PaidTaxes from "@/models/PaidTaxes";
import mongoose from "mongoose"; // ✅ Import mongoose for ObjectId conversion

async function fetchExchangeRates() {
  const response = await fetch(`${process.env.BASE_URL}/api/exchange-rates`);
  const data = await response.json();
  return data;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required userId parameter." },
        { status: 400 }
      );
    }

    await connectMongo();

    // ✅ Convert userId to ObjectId
    const objectUserId = new mongoose.Types.ObjectId(userId);

    // ✅ Fetch Exchange Rates
    const exchangeRates = await fetchExchangeRates();
    console.log("💱 Exchange Rates:", exchangeRates);

    // ✅ Fetch and Convert Payments to RSD
    const payments = await Payment.find({ userId });
    const yearlyIncome = {};

    payments.forEach((payment) => {
      const paymentDate = new Date(payment.date);
      const year = paymentDate.getFullYear();
      const currencyRate = exchangeRates[payment.currency]; // Get rate to USD
      const rsdRate = exchangeRates["RSD"]; // Get RSD rate

      if (!currencyRate || !rsdRate) {
        console.warn(`⚠️ Missing exchange rate for ${payment.currency}`);
        return;
      }

      // ✅ Convert amount to USD, then to RSD
      const amountInRSD = (payment.amount / currencyRate) * rsdRate;

      if (yearlyIncome[year]) {
        yearlyIncome[year] += amountInRSD;
      } else {
        yearlyIncome[year] = amountInRSD;
      }
    });

    console.log("✅ Yearly Income:", yearlyIncome);

    // ✅ Fetch Paid Taxes and Group by Year
    const paidTaxes = await PaidTaxes.aggregate([
      {
        $match: {
          userId: objectUserId, // ✅ Use ObjectId here
        },
      },
      {
        $group: {
          _id: "$year",
          totalTaxes: { $sum: "$totalTax" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by Year Ascending
      },
    ]);

    console.log("💰 Paid Taxes Grouped by Year:", paidTaxes);

    return NextResponse.json({ yearlyIncome, paidTaxes });
  } catch (error) {
    console.error("❌ Error fetching yearly stats:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
