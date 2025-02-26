"use client";
import { useState } from "react";

const DeletePaymentButton = ({ paymentId }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this payment?")) return;

    setIsDeleting(true);
    try {
      await fetch(`/api/payments/${paymentId}`, { method: "DELETE" });
      window.location.reload(); // ✅ Refresh page after deletion
    } catch (error) {
      console.error("Error deleting payment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="btn btn-sm btn-error"
      disabled={isDeleting}
    >
      {isDeleting ? "Brisanje..." : "🗑️ Obriši"}
    </button>
  );
};

export default DeletePaymentButton;
