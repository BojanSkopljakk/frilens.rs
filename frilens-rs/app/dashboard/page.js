import ButtonLogout from "@/components/ButtonLogout";
import PaymentForm from "@/components/PaymentForm";
import DeletePaymentButton from "@/components/DeletePaymentButton"; // ✅ Import the new client component
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Payment from "@/models/Payment";
import TaxCalculator from "@/components/TaxCalculator";
import PaidTaxes from "@/models/PaidTaxes";

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
    .lean(); // ✅ Converts MongoDB documents to plain objects

  if (!user) {
    console.log("User not found in the database.");
    return null;
  }

  // ✅ Convert `_id` fields to strings

  user._id = user._id.toString();
  user.payments = (user.payments || []).map((payment) => ({
    ...payment,
    _id: payment._id.toString(), // ✅ Convert `ObjectId` to string
    userId: payment.userId?.toString() || "", // ✅ Handle case where userId is undefined
    date: payment.date ? payment.date.toISOString() : "", // ✅ Safe Date Conversion
    createdAt: payment.createdAt ? payment.createdAt.toISOString() : "", // ✅ Safe Date Conversion
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

export default async function Dashboard() {
  const user = await getUser();
  console.log(user);

  return (
    <main className="bg-base-200 min-h-screen">
      {/*HEADER*/}
      <section className="bg-base-100">
        <div className="px-5 py-3 flex justify-end max-w-5xl mx-auto">
          <ButtonLogout />
        </div>
      </section>

      {/* Payments Section */}
      <section className="max-w-5xl mx-auto px-5 py-12 space-y-12">
        <PaymentForm />

        <div>
          <h1 className="font-extrabold text-xl mb-4">
            {user.payments.length} Uplate
          </h1>

          <div className="overflow-x-auto">
            <table className="table w-full bg-base-100 rounded-lg shadow-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">📌 Kompanija</th>
                  <th className="p-3 text-left">📅 Datum</th>
                  <th className="p-3 text-left">💰 Iznos</th>
                  <th className="p-3 text-left">💵 Valuta</th>
                  <th className="p-3 text-left">🗑️ Akcije</th>
                </tr>
              </thead>

              <tbody>
                {user.payments.map((payment) => (
                  <tr key={payment._id} className="border-b">
                    <td className="p-3 font-bold">{payment.company}</td>
                    <td className="p-3">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">{payment.amount}</td>
                    <td className="p-3">{payment.currency}</td>
                    <td className="p-3">
                      <DeletePaymentButton paymentId={payment._id} />{" "}
                      {/* ✅ Use the new client component */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* TAX CALCULATOR */}
      <section className="max-w-5xl mx-auto px-5 py-12 space-y-12">
        <TaxCalculator userId={user._id} payments={user.payments} />
      </section>
    </main>
  );
}
