"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SettingsPage() {

  const [businessName, setBusinessName] = useState("");
  const [websiteTitle, setWebsiteTitle] = useState("");

  useEffect(() => {
    setBusinessName(
      localStorage.getItem("businessName") || "The Studio Petalia"
    );

    setWebsiteTitle(
      localStorage.getItem("websiteTitle") || "Flower Shop Management Dashboard"
    );

  }, []);


  function saveSettings() {

    localStorage.setItem(
      "businessName",
      businessName
    );

    localStorage.setItem(
      "websiteTitle",
      websiteTitle
    );

    alert("✅ Settings Saved!");

  }


  return (
    <main className="min-h-screen bg-pink-50 p-8">

      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-pink-600 mb-8">
          ⚙️ Settings
        </h1>


        <label className="font-semibold">
          Business Name
        </label>

        <input
          className="w-full border rounded-xl p-3 mt-2 mb-5"
          value={businessName}
          onChange={(e)=>setBusinessName(e.target.value)}
        />


        <label className="font-semibold">
          Website Title
        </label>

        <input
          className="w-full border rounded-xl p-3 mt-2 mb-5"
          value={websiteTitle}
          onChange={(e)=>setWebsiteTitle(e.target.value)}
        />


        <button
          onClick={saveSettings}
          className="w-full bg-pink-500 text-white py-3 rounded-xl"
        >
          Save Changes
        </button>


        <Link
          href="/petalia"
          className="block text-center mt-5 bg-gray-500 text-white py-3 rounded-xl"
        >
          ← Back Dashboard
        </Link>

      </div>

    </main>
  );
}