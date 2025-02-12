"use client";
import { useState } from "react";
import axios from "axios";

const PaymentForm = () => {
    const [company, setCompany] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isLoading) return;
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.post("/api/payments", {
                company,
                currency,
                amount: Number(amount),
                date
            });

            setSuccess("Uplata uspešno dodata!");
            setCompany("");
            setCurrency("USD");
            setAmount("");
            setDate("");

            setTimeout(() => setSuccess(""), 3000); // Hide success message after 3 seconds
        } catch (error) {
            setError("Greška prilikom dodavanja uplate. Pokušajte ponovo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="bg-base-100 p-8 rounded-3xl space-y-6 w-72" onSubmit={handleSubmit}>
            <p className="font-bold text-lg">Nova uplata</p>

            {/* Error & Success Messages */}
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <label className="form-control w-full">
                {/* Company Name */}
                <div className="label">
                    <span className="label-text">Ime kompanije</span>
                </div>
                <input
                    required
                    type="text"
                    placeholder="Frilens DOO"
                    className="input input-bordered w-full max-w-xs"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                />

                {/* Currency Dropdown */}
                <div className="label">
                    <span className="label-text">Valuta</span>
                </div>
                <select
                    className="select select-bordered w-full max-w-xs"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="RSD">RSD</option>
                </select>

                {/* Amount */}
                <div className="label">
                    <span className="label-text">Iznos</span>
                </div>
                <input
                    required
                    type="number"
                    placeholder="3000"
                    className="input input-bordered w-full max-w-xs"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                {/* Date Picker */}
                <div className="label">
                    <span className="label-text">Datum</span>
                </div>
                <input
                    required
                    type="date"
                    className="input input-bordered w-full max-w-xs"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </label>

            {/* Submit Button */}
            <button className="btn btn-primary w-full" type="submit" disabled={isLoading}>
                {isLoading && <span className="loading loading-spinner loading-xs"></span>}
                {isLoading ? "Dodavanje..." : "Kreiraj uplatu"}
            </button>
        </form>
    );
};

export default PaymentForm;
