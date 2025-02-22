import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Payment from "@/models/Payment";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const year = parseInt(searchParams.get("year"), 10);
    const quarter = parseInt(searchParams.get("quarter"), 10);

    if (!userId || !year || !quarter) {
      return NextResponse.json(
        { error: "Missing required parameters." },
        { status: 400 }
      );
    }

    await connectMongo();

    // Fetch payments and filter by userId, year, and quarter
    const payments = await Payment.find({ userId }).lean();

    const totalIncome = payments.reduce((sum, payment) => {
      const paymentDate = new Date(payment.date);
      const paymentYear = paymentDate.getFullYear();
      const paymentQuarter = Math.ceil((paymentDate.getMonth() + 1) / 3);

      if (paymentYear === year && paymentQuarter === quarter) {
        return sum + payment.amount;
      }
      return sum;
    }, 0);

    return NextResponse.json({ totalIncome });
  } catch (error) {
    console.error("❌ Error calculating income:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
