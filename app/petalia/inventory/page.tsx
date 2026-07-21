"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function InventoryPage() {
  const [items, setItems] =useState<any[]>([]);

  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    function loadInventory() {
      const stored = JSON.parse(
        localStorage.getItem("inventory") || "[]"
      );

      setItems(stored);
    }

    loadInventory();

    window.addEventListener("storage", loadInventory);

    return () => {
      window.removeEventListener("storage", loadInventory);
    };
  }, []);

  function saveInventory(data: any[]) {
    setItems(data);

    localStorage.setItem(
      "inventory",
      JSON.stringify(data)
    );

    window.dispatchEvent(
      new Event("inventoryUpdated")
    );
  }

  function addItem() {
    if (!name.trim()) return;

    const newItem = {
      id: Date.now(),
      item: name,
      stock: qty,
    };

    saveInventory([
      ...items,
      newItem,
    ]);

    setName("");
    setQty(1);
  }

  function deleteItem(id: number) {
    const updated = items.filter(
      (item) => item.id !== id
    );

    saveInventory(updated);
  }

  return (
    <main className="min-h-screen bg-pink-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-pink-600 mb-8">
          📦 Material Inventory
        </h1>

        <div className="bg-pink-50 rounded-2xl p-6">

          <input
            placeholder="Material Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-xl p-3 mb-3"
          />

          <input
            type="number"
            placeholder="Quantity"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-full border rounded-xl p-3 mb-3"
          />

          <button
            onClick={addItem}
            className="bg-green-500 text-white px-5 py-3 rounded-xl"
          >
            ➕ Add Stock
          </button>

        </div>

        <div className="mt-8">

          <h2 className="text-2xl font-bold mb-4">
            📋 Stock List
          </h2>

          {items.map((item) => (

            <div
              key={item.id}
              className="bg-white border rounded-xl p-4 mb-3 flex justify-between items-center"
            >

              <div>

                <h3 className="font-bold text-lg">
                  {item.item}
                </h3>

                <p>
                  Quantity: {item.stock}
                </p>

                {item.stock <= 5 && (
                  <p className="text-red-500 font-bold">
                    ⚠️ Low Stock
                  </p>
                )}

              </div>

              <button
                onClick={() => deleteItem(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                🗑 Delete
              </button>

            </div>

          ))}

        </div>

        <Link
          href="/petalia/bouquets"
          className="inline-block mt-8 bg-gray-500 text-white px-6 py-3 rounded-xl"
        >
          ← Back
        </Link>

      </div>
    </main>
  );
}