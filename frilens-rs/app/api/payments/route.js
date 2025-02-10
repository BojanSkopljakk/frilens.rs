import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Payment from "@/models/Payment";

export async function POST(req) {
    try {
        // ✅ Parse JSON request body
        const body = await req.json();
        const { amountPaid, quarter, year } = body;

        // ✅ Validate input fields
        if (!amountPaid || !quarter || !year) {
            return NextResponse.json(
                { error: "All fields (amountPaid, quarter, year) are required." },
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
            amountPaid,
            quarter,
            year
        });

        // ✅ Update the user's payments array & total income
        user.payments.push(payment._id);
        user.totalIncome += amountPaid;
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
