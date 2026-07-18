"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const result = await signIn("credentials", {
  email,
  password,
  redirect: false,
});

if (result?.error) {
  alert("Invalid email or password");
} else {
  window.location.href = "/";
}
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-pink-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-3xl shadow-xl w-96"
      >
        <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">
          🌸 Petalia Admin Login
        </h1>

        <input
  className="w-full border p-3 rounded-xl mb-4"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
        <input
          type="password"
          className="w-full border p-3 rounded-xl mb-6"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl"
        >
          Login
        </button>
      </form>
    </main>
  );
}