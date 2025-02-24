import { NextResponse } from "next/server";
import { headers } from "next/headers";
import connectMongo from "@/libs/mongoose";
import crypto from "crypto";
import User from "@/models/User";

export async function POST(req) {
  try {
    // Verify webhook is coming from LemonSqueezy
    const body = await req.text();

    const hmac = crypto.createHmac(
      "sha256",
      process.env.LEMON_SQUEEZY_WEBHOOK_SIGNATURE
    );
    const digest = Buffer.from(hmac.update(body).digest("hex"), "utf8");

    // ✅ Fix: Await headers before using it
    const requestHeaders = await headers();
    const signature = Buffer.from(requestHeaders.get("x-signature"), "utf8");

    if (!crypto.timingSafeEqual(digest, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(body);
    const eventName = payload.meta.event_name;
    const email = payload.data.attributes.user_email; // Adjusted to use email

    if (!email) {
      console.error("❌ No email found in the payload.");
      return NextResponse.json(
        { error: "No email found in the payload." },
        { status: 400 }
      );
    }

    await connectMongo();
    const user = await User.findOne({ email });

    if (!user) {
      console.error("❌ No user found with this email.");
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (eventName === "order_created") {
      user.hasAccess = true;
      user.customerId = payload.data.attributes.customer_id;
      await user.save();
    } else if (
      eventName === "subscription_expired" ||
      eventName === "subscription_payment_failed"
    ) {
      user.hasAccess = false;
      await user.save();
    }
  } catch (e) {
    console.error("LemonSqueezy error: ", e?.message);
  }

  return NextResponse.json({});
}
