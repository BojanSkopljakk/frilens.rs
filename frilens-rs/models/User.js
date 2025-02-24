import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, // Only set if user signs up via email
    image: { type: String }, // Profile image for Google users
    emailVerified: { type: Date, default: null },
    totalIncome: { type: Number, default: 0 }, // Sum of all payments
    paidTaxes: [{ type: mongoose.Schema.Types.ObjectId, ref: "PaidTaxes" }],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }], // Store payment IDs
    hasAccess: { type: Boolean, default: false },
    customerId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
