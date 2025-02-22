import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import StatsChart from "@/components/StatsChart";
import Payment from "@/models/Payment";

async function getUser() {
  const session = await auth();

  if (!session || !session.user?.email) {
    console.log("No valid session found.");
    return null;
  }

  await connectMongo();

  const user = await User.findOne({ email: session.user.email })
    .populate("payments")
    .lean(); // ✅ Converts MongoDB documents to plain objects

  if (!user) {
    console.log("User not found in the database.");
    return null;
  }

  // ✅ Convert `_id` fields to strings
  user._id = user._id.toString();
  user.payments = user.payments.map((payment) => ({
    ...payment,
    _id: payment._id.toString(),
    userId: payment.userId.toString(),
    date: payment.date.toISOString(),
    createdAt: payment.createdAt.toISOString(),
  }));

  return user;
}

export default async function Stats() {
  const user = await getUser();
  console.log("Fetched User for Stats:", user);

  return (
    <main className="bg-base-200 min-h-screen">
      <section className="max-w-5xl mx-auto px-5 py-12 space-y-12">
        <h2 className="text-3xl font-extrabold mb-6 text-center">
          📊 Income vs. Taxes Dashboard
        </h2>
        <StatsChart payments={user.payments} userId={user._id} />
      </section>
    </main>
  );
}
