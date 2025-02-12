import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Payment from "@/models/Payment";

export async function POST(req) {
    try {
        // ✅ Parse JSON request body
        const body = await req.json();
        const { amount, currency, company, date } = body;

        // ✅ Validate required fields
        if (!amount || !currency || !company || !date) {
            return NextResponse.json(
                { error: "All fields (amount, currency, company, date) are required." },
                { status: 400 }
            );
        }

        // ✅ Validate currency
        const allowedCurrencies = ["USD", "EUR", "RSD"];
        if (!allowedCurrencies.includes(currency)) {
            return NextResponse.json(
                { error: "Invalid currency. Allowed values: USD, EUR, RSD." },
                { status: 400 }
            );
        }

        // ✅ Validate date format
        const paymentDate = new Date(date);
        if (isNaN(paymentDate.getTime())) {
            return NextResponse.json(
                { error: "Invalid date format." },
                { status: 400 }
            );
        }

        // ✅ Authenticate user
        const session = await auth();
        if (!session) {
            return NextResponse.json(
                { error: "Not authorized" },
                { status: 401 }
            );
        }

        // ✅ Connect to MongoDB
        await connectMongo();

        // ✅ Fetch user by email
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // ✅ Store the payment
        const payment = await Payment.create({
            userId: user._id,
            amount,
            currency,
            company,
            date: paymentDate
        });

        // ✅ Update the user's payments array
        user.payments.push(payment._id);
        await user.save();

        return NextResponse.json(
            { message: "Payment added successfully!", payment },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error processing payment:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
