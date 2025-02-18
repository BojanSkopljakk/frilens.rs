"use client";

import { useState, useEffect } from "react";
import axios from "axios";

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
      setMessage("❌ New passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await axios.put("/api/profile", {
        name,
        oldPassword: oldPassword || undefined,
        newPassword: newPassword || undefined,
      });

      setMessage("✅ Profile updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      setMessage(error.response?.data?.error || "❌ An error occurred");
    }

    setIsLoading(false);
  }

  if (isLoading) {
    return <p className="text-center">🔄 Loading profile...</p>;
  }

  if (!user) {
    return (
      <p className="text-center text-red-500">
        ❌ Error loading profile. Please try again.
      </p>
    );
  }

  return (
    <main className="max-w-md mx-auto p-6 bg-base-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">👤 Profile</h2>

      {/* Removed the profile image */}
      <div className="mb-4">
        <p className="font-bold">{user.email}</p>
      </div>

      <form className="space-y-4" onSubmit={handleUpdateProfile}>
        <div>
          <label className="label">
            <span className="label-text">Name:</span>
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
                <span className="label-text">Old Password:</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">New Password:</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Confirm New Password:</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="Confirm new password"
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
            "Update Profile"
          )}
        </button>
      </form>

      {message && <p className="mt-2 text-green-600">{message}</p>}
    </main>
  );
}
