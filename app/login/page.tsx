"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const result = await signIn("credentials", {
      username,
      password,
      redirect: true,
      callbackUrl: "/",
    });

    if (result?.error) {
      alert("Invalid username or password");
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
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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