import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import StatsChart from "@/components/StatsChart";
import YearlyIncomeVsTaxesChart from "@/components/YearlyIncomeVsTaxesChart";
import { redirect } from "next/navigation";
import ButtonLogout from "@/components/ButtonLogout";

async function getUser() {
  const session = await auth();

  if (!session || !session.user?.email) {
    console.log("No valid session found.");
    return null;
  }

  await connectMongo();

  const user = await User.findOne({ email: session.user.email })
    .populate("payments")
    .populate("paidTaxes")
    .lean();

  if (!user) {
    console.log("User not found in the database.");
    return null;
  }

  // ✅ Convert `_id` fields to strings
  user._id = user._id.toString();
  user.payments = (user.payments || []).map((payment) => ({
    ...payment,
    _id: payment._id.toString(),
    userId: payment.userId?.toString() || "",
    date: payment.date ? payment.date.toISOString() : "",
    createdAt: payment.createdAt ? payment.createdAt.toISOString() : "",
  }));

  user.paidTaxes = (user.paidTaxes || []).map((tax) => ({
    ...tax,
    _id: tax._id.toString(),
    userId: tax.userId?.toString() || "",
    year: tax.year,
    quarter: tax.quarter,
    model: tax.model,
    totalTax: tax.totalTax,
    createdAt: tax.createdAt ? tax.createdAt.toISOString() : "",
  }));

  return user;
}

export default async function Stats() {
  const user = await getUser();
  console.log("Fetched User for Stats:", user);

  if (!user || !user.hasAccess) {
    redirect("/dashboard");
  }

  return (
    <main className="bg-base-200 min-h-screen">
      {/* HEADER */}
      <section className="bg-base-100 shadow-md">
        <div className="px-5 py-4 flex justify-between items-center max-w-5xl mx-auto">
          <a
            href="/"
            className="text-xl font-bold text-primary hover:text-primary-focus transition"
          >
            Frilens.rs
          </a>

          <div className="space-x-4 flex items-center">
            <a className="link link-hover" href="/dashboard">
              Prihodi
            </a>

            <a className="link link-hover" href="/profile">
              Profil
            </a>

            <ButtonLogout extraStyle="btn-outline btn-sm" />
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 py-12 space-y-12">
        <h2 className="text-3xl font-extrabold mb-6 text-center">
          📊 Income vs. Taxes Dashboard
        </h2>
        <StatsChart payments={user.payments} userId={user._id} />
        <YearlyIncomeVsTaxesChart userId={user._id} />
      </section>
    </main>
  );
}
