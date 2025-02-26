"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ButtonLogout from "@/components/ButtonLogout";
import ButtonCheckout from "@/components/ButtonCheckout";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        console.log("🔄 Fetching user profile...");
        const response = await axios.get("/api/profile");
        console.log("✅ User data received:", response.data);

        setUser(response.data);
        setName(response.data.name);
        setIsGoogleUser(response.data.isGoogleUser);
      } catch (error) {
        console.error(
          "❌ Failed to fetch user:",
          error.response?.data || error
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (newPassword && newPassword !== confirmNewPassword) {
      setMessage("❌ Šifre nisu iste");
      setIsLoading(false);
      return;
    }

    try {
      await axios.put("/api/profile", {
        name,
        oldPassword: oldPassword || undefined,
        newPassword: newPassword || undefined,
      });

      setMessage("✅ Profil uspešno ažuriran");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      setMessage(error.response?.data?.error || "❌ An error occurred");
    }

    setIsLoading(false);
  }

  if (isLoading) {
    return <p className="text-center">🔄 Profil se učitava</p>;
  }

  if (!user) {
    return (
      <p className="text-center text-red-500">
        ❌ Error loading profile. Please try again.
      </p>
    );
  }

  return (
    <main>
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

            {user.hasAccess && (
              <a className="link link-hover" href="/stats">
                Statistika
              </a>
            )}

            <ButtonLogout extraStyle="btn-outline btn-sm" />
          </div>
        </div>
      </section>

      {/* PROFILE CONTENT */}
      <section className="max-w-md mx-auto p-6 bg-base-100 rounded-lg shadow-lg mt-8">
        <h2 className="text-2xl font-bold mb-4">👤 Profil</h2>

        <div className="mb-4">
          <p className="font-bold">{user.email}</p>
        </div>

        <form className="space-y-4" onSubmit={handleUpdateProfile}>
          <div>
            <label className="label">
              <span className="label-text">Ime:</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {!isGoogleUser && (
            <>
              <div>
                <label className="label">
                  <span className="label-text">Stara šifra:</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Unesi staru šifru"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Nova šifra:</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Unesi novu šifru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Potvrdi novu šifru:</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Potvrdi novu šifru"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
            </>
          )}

          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Ažuriraj profil"
            )}
          </button>
        </form>

        {message && <p className="mt-2 text-green-600">{message}</p>}
      </section>
    </main>
  );
}
