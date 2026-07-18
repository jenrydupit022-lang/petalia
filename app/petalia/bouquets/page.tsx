"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BouquetPage() {
    const [showForm, setShowForm] = useState(false);
    function saveBouquet() {
  if (!bouquetName.trim()) {
    alert("Enter bouquet name.");
    return;
  }

  const newBouquet = {
  id: Date.now(),
  name: bouquetName,

  image: "",

  materials: [],

  totalCost: 0,

  suggestedPrice: 0,
};

  const updated = [...bouquets, newBouquet];

setBouquets(updated);

localStorage.setItem(
  "bouquets",
  JSON.stringify(updated)
);

  setBouquetName("");
  setShowForm(false);
}
const [bouquetName, setBouquetName] = useState("");
const [bouquets, setBouquets] = useState<
  {
    id: number;
    name: string;
    image: string;
    materials: any[];
    totalCost: number;
    suggestedPrice: number;
  }[]
>([]);
useEffect(() => {
  const stored = localStorage.getItem("bouquets");

  if (stored) {
    setBouquets(JSON.parse(stored));
  }
}, []);
    
  return (
    <main className="min-h-screen bg-pink-50 p-8">

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold text-pink-600">
            💐 Bouquet Catalog
          </h1>

         <button
  onClick={() => setShowForm(true)}
  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl"
>
  ➕ Add Bouquet
</button>

        </div>
{showForm && (
  <div className="bg-pink-50 rounded-3xl p-6 mb-8">

    <h2 className="text-2xl font-bold mb-5">
      🌸 New Bouquet
    </h2>

    <input
      type="text"
      placeholder="Bouquet Name"
      value={bouquetName}
      onChange={(e) => setBouquetName(e.target.value)}
      className="w-full border rounded-xl p-3 mb-4"
    />

    <button
  onClick={saveBouquet}
  className="bg-green-500 text-white px-6 py-3 rounded-xl"
>
  Save Bouquet
</button>

  </div>
)}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

  {bouquets.map((bouquet) => (

    <div
      key={bouquet.id}
      className="bg-pink-50 rounded-3xl p-6 text-center border"
    >

      <div className="h-52 bg-white rounded-2xl flex items-center justify-center text-6xl">
        🌹
      </div>

      <h2 className="text-2xl font-bold mt-4">
        {bouquet.name}
      </h2>

      <Link
  href={`/petalia/bouquets/${bouquet.id}`}
  className="inline-block mt-4 bg-pink-500 text-white px-5 py-2 rounded-xl"
>
  View Costing
</Link>

    </div>

  ))}

</div>

        <Link
          href="/petalia"
          className="inline-block mt-10 bg-gray-500 text-white px-6 py-3 rounded-xl"
        >
          ← Back
        </Link>

      </div>

    </main>
  );
}