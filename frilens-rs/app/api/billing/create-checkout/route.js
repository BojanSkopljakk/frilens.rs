import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import {
  lemonSqueezySetup,
  createCheckout,
} from "@lemonsqueezy/lemonsqueezy.js";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.successUrl) {
      console.error("❌ Missing success URL.");
      return NextResponse.json(
        { error: "Success URL is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Checking session...");
    const session = await auth();
    console.log("✅ Session:", session);

    if (!session || !session.user?.email) {
      console.error("❌ No session or email found.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    console.log("✅ MongoDB Connected");

    // ✅ Use email to find the user
    const user = await User.findOne({ email: session.user.email });
    console.log("✅ User:", user);

    if (!user) {
      console.error("❌ No user found in the database.");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    lemonSqueezySetup({
      apiKey: process.env.LEMON_SQUEEZY_API_KEY,
    });

    const checkoutLS = await createCheckout(
      process.env.LEMON_SQUEEZY_STORE_ID,
      process.env.LS_VARIANT_ID,
      {
        productOptions: {
          redirectUrl: body.successUrl,
        },
        checkoutData: {
          email: user.email,
          custom: {
            userId: user._id.toString(),
          },
        },
      }
    );

    console.log("🟢 LemonSqueezy Response:", checkoutLS);

    // ✅ Fix: Check if data and attributes exist before accessing
    if (
      checkoutLS.data &&
      checkoutLS.data.data &&
      checkoutLS.data.data.attributes &&
      checkoutLS.data.data.attributes.url
    ) {
      console.log("✅ Checkout URL:", checkoutLS.data.data.attributes.url);
      return NextResponse.json({ url: checkoutLS.data.data.attributes.url });
    } else {
      console.error(
        "❌ Unexpected LemonSqueezy Response Format:",
        checkoutLS.data
      );
      return NextResponse.json(
        { error: "Unexpected response from LemonSqueezy." },
        { status: 500 }
      );
    }
  } catch (e) {
    console.error("❌ Error creating LemonSqueezy checkout:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
