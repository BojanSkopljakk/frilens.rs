import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import PaidTaxes from "@/models/PaidTaxes";

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

    const existingRecord = await PaidTaxes.findOne({ userId, year, quarter });

    return NextResponse.json({ paid: !!existingRecord });
  } catch (error) {
    console.error("❌ Error checking tax payment status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, year, quarter, model, totalTax } = body;

    if (!userId || !year || !quarter || !model || !totalTax) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    await connectMongo();

    const existingRecord = await PaidTaxes.findOne({ userId, year, quarter });

    if (existingRecord) {
      return NextResponse.json(
        { error: "You have already paid taxes for this quarter." },
        { status: 400 }
      );
    }

    const newTaxPayment = await PaidTaxes.create({
      userId,
      year,
      quarter,
      model,
      totalTax,
    });

    return NextResponse.json(
      { message: "Taxes successfully paid!", newTaxPayment },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error processing tax payment:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
