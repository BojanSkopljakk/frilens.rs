import { NextResponse } from "next/server";

export async function GET() {
  try {
    const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
    if (!API_KEY) {
      console.error("❌ Missing Exchange Rate API Key");
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`
    );
    const data = await response.json();

    if (!data.conversion_rates) {
      console.error("❌ Exchange Rate API Error:", data);
      return NextResponse.json(
        { error: "Failed to fetch exchange rates" },
        { status: 500 }
      );
    }

    console.log("✅ Exchange Rates Fetched:", data.conversion_rates);

    return NextResponse.json({
      USD: data.conversion_rates.USD || 1,
      EUR: data.conversion_rates.EUR || 1,
      RSD: data.conversion_rates.RSD || 117.5, // ✅ Default RSD rate
    });
  } catch (error) {
    console.error("❌ Exchange rate error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
