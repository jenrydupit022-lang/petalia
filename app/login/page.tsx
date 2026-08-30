"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      console.error("Supabase Login Error:", error);

      alert(
        `Login failed.\n\nSupabase error:\n${error.message}`
      );

      return;
    }

    // After login, go to the main Business Hub
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-pink-600 mb-2 text-center">
          🌸 Petalia Admin Login
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Sign in to continue
        </p>

        <input
          type="email"
          className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-pink-300"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          type="password"
          className="w-full border p-3 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-pink-300"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white py-3 rounded-xl font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}