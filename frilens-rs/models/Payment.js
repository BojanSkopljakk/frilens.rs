import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amountPaid: { type: Number, required: true },
  quarter: { type: Number, required: true, enum: [1, 2, 3, 4] }, // Q1, Q2, Q3, Q4
  year: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
