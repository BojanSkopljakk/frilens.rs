import mongoose from "mongoose";

const PaidTaxesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  year: { type: Number, required: true },
  quarter: { type: Number, required: true, enum: [1, 2, 3, 4] },
  model: { type: String, required: true, enum: ["A", "B"] },
  totalTax: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PaidTaxes ||
  mongoose.model("PaidTaxes", PaidTaxesSchema);
