import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Payment from "@/models/Payment";

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    await connectMongo();

    const { id } = params; // Extract payment ID from URL
    const payment = await Payment.findById(id);

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // ✅ Delete payment from MongoDB
    await Payment.findByIdAndDelete(id);

    // ✅ Remove the payment from the user's `payments` array
    await User.findByIdAndUpdate(payment.userId, {
      $pull: { payments: id },
    });

    return NextResponse.json(
      { message: "Payment deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
