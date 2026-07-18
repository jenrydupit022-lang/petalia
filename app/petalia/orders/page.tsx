"use client";

import { useState } from "react";

export default function OrdersPage() {
  const [price, setPrice] = useState(0);
  const [cost, setCost] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const total = price * quantity;
  const profit = (price - cost) * quantity;

  return (
    <main className="min-h-screen bg-pink-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-pink-600">
          🌸 Add Flower Order
        </h1>

        <div className="mt-8 space-y-5">

          <input
            className="w-full border rounded-xl p-3"
            placeholder="Customer Name"
          />

          <input
            className="w-full border rounded-xl p-3"
            placeholder="Product Name"
          />

          <input
            type="number"
            className="w-full border rounded-xl p-3"
            placeholder="Selling Price"
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <input
            type="number"
            className="w-full border rounded-xl p-3"
            placeholder="Cost"
            onChange={(e) => setCost(Number(e.target.value))}
          />

          <input
            type="number"
            className="w-full border rounded-xl p-3"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

        </div>

        <div className="mt-10 bg-pink-100 rounded-2xl p-6">

          <h2 className="text-2xl font-bold">
            Total Sales
          </h2>

          <p className="text-3xl mt-2 font-bold">
            ₱{total.toLocaleString()}
          </p>

          <h2 className="text-2xl font-bold mt-6">
            Estimated Profit
          </h2>

          <p className="text-3xl text-green-600 mt-2 font-bold">
            ₱{profit.toLocaleString()}
          </p>

        </div>

        <button className="mt-8 w-full bg-pink-500 text-white py-4 rounded-xl hover:bg-pink-600">
          Save Order
        </button>

      </div>
    </main>
  );
}