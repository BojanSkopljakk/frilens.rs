import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import PaidTaxes from "@/models/PaidTaxes";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const year = searchParams.get("year")
      ? parseInt(searchParams.get("year"), 10)
      : null;
    const quarter = searchParams.get("quarter")
      ? parseInt(searchParams.get("quarter"), 10)
      : null;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required userId parameter." },
        { status: 400 }
      );
    }

    await connectMongo();

    const query = { userId };
    if (year) query.year = year;
    if (quarter) query.quarter = quarter;

    const paidTaxes = await PaidTaxes.find(query).lean();

    // Convert _id to string for frontend compatibility
    const formattedData = paidTaxes.map((tax) => ({
      ...tax,
      _id: tax._id.toString(),
    }));

    return NextResponse.json({ paidTaxes: formattedData });
  } catch (error) {
    console.error("❌ Error fetching paid taxes:", error);
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

    await User.findByIdAndUpdate(new mongoose.Types.ObjectId(userId), {
      $push: { paidTaxes: newTaxPayment._id },
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
