import ButtonLogout from "@/components/ButtonLogout";
import PaymentForm from "@/components/PaymentForm";
import DeletePaymentButton from "@/components/DeletePaymentButton"; // ✅ Import the new client component
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Payment from "@/models/Payment";
import TaxCalculator from "@/components/TaxCalculator";
import PaidTaxes from "@/models/PaidTaxes";
import ButtonCheckout from "@/components/ButtonCheckout";

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

  // Convert `_id` fields to strings
  user._id = user._id.toString();
  user.payments = (user.payments || []).map((payment) => {
    const paymentDate = new Date(payment.date);
    const paymentYear = paymentDate.getFullYear();
    const paymentQuarter = Math.ceil((paymentDate.getMonth() + 1) / 3);

    // Check if taxes are paid for this quarter
    const isTaxPaid = user.paidTaxes.some(
      (tax) => tax.year === paymentYear && tax.quarter === paymentQuarter
    );

    return {
      ...payment,
      _id: payment._id.toString(),
      userId: payment.userId?.toString() || "",
      date: payment.date ? payment.date.toISOString() : "",
      createdAt: payment.createdAt ? payment.createdAt.toISOString() : "",
      isTaxPaid,
    };
  });

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
      <section className="bg-base-100 shadow-md">
        <div className="px-5 py-4 flex justify-between items-center max-w-5xl mx-auto">
          <a
            href="/"
            className="text-xl font-bold text-primary hover:text-primary-focus transition"
          >
            Frilens.rs
          </a>

          <div className="space-x-4 flex items-center">
            <a
              className="link link-hover text-sm font-medium text-gray-600 hover:text-primary transition"
              href="/profile"
            >
              Profil
            </a>

            {user.hasAccess && (
              <a
                className="link link-hover text-sm font-medium text-gray-600 hover:text-primary transition"
                href="/stats"
              >
                Statistika
              </a>
            )}

            {!user.hasAccess && (
              <ButtonCheckout extraStyle="btn-primary btn-sm" />
            )}

            <ButtonLogout extraStyle="btn-outline btn-sm" />
          </div>
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
                      {payment.isTaxPaid ? (
                        <button
                          className="btn btn-disabled cursor-not-allowed opacity-50"
                          title="Ne može se obrisati. Porez je plaćen za ovaj kvartal."
                        >
                          🔒 Ne može se obrisati
                        </button>
                      ) : (
                        <DeletePaymentButton paymentId={payment._id} />
                      )}
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
