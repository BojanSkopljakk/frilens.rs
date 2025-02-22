import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import PaidTaxes from "@/models/PaidTaxes";

export async function GET(req, { params }) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get("year"), 10);
    const quarter = parseInt(searchParams.get("quarter"), 10);

    await connectMongo();

    // Create query object
    const query = { userId };

    // Add optional filters
    if (year) query.year = year;
    if (quarter) query.quarter = quarter;

    // Fetch all paid taxes for this user, with optional filters
    const paidTaxes = await PaidTaxes.find(query).lean();

    return NextResponse.json({ paidTaxes });
  } catch (error) {
    console.error("❌ Error fetching paid taxes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
