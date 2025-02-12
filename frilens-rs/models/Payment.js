import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  currency: { 
    type: String, 
    enum: ["USD", "EUR", "RSD"], // ✅ Restricts currency to these values
    required: true 
  },
  company: { type: String, required: true },  // The company related to the payment
  date: { type: Date, required: true },       // Date of the payment
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
