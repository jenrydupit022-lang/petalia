"use client";

import { useState } from "react";

type Bouquet = {
  name: string;
  cost: number;
  price: number;
};

export default function CatalogPage() {
  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");

  function addBouquet() {
    if (!name || !cost || !price) return;

    setBouquets([
      ...bouquets,
      {
        name,
        cost: Number(cost),
        price: Number(price),
      },
    ]);

    setName("");
    setCost("");
    setPrice("");
  }

  return (
    <main className="min-h-screen bg-pink-50 p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-pink-600">
          🌸 Bouquet Catalog
        </h1>

        <div className="bg-white rounded-2xl shadow p-6 mt-8">

          <input
            className="border p-3 rounded-xl w-full mb-4"
            placeholder="Bouquet Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            className="border p-3 rounded-xl w-full mb-4"
            placeholder="Cost"
            type="number"
            value={cost}
            onChange={(e)=>setCost(e.target.value)}
          />

          <input
            className="border p-3 rounded-xl w-full mb-4"
            placeholder="Selling Price"
            type="number"
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
          />

          <button
            onClick={addBouquet}
            className="bg-pink-500 text-white px-6 py-3 rounded-xl hover:bg-pink-600"
          >
            Add Bouquet
          </button>

        </div>

        <div className="bg-white rounded-2xl shadow p-6 mt-8">

          <h2 className="text-2xl font-bold mb-4">
            Bouquet List
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Bouquet
                </th>

                <th className="text-left">
                  Cost
                </th>

                <th className="text-left">
                  Selling Price
                </th>

                <th className="text-left">
                  Profit
                </th>

              </tr>

            </thead>

            <tbody>

              {bouquets.map((b,index)=>(

                <tr key={index} className="border-b">

                  <td className="py-3">{b.name}</td>

                  <td>₱{b.cost}</td>

                  <td>₱{b.price}</td>

                  <td className="font-bold text-green-600">
                    ₱{b.price-b.cost}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}