"use client";
import { useEffect, useState } from "react";
import {
  saveSale,
  getSales,
  deleteSale,
  updateSale,
  Sale,
} from "@/lib/storage";

export default function SalesPage() {
  const [date, setDate] = useState("");
  const [bouquet, setBouquet] = useState("Rose Bouquet");
  const [color, setColor] = useState("Pink");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    setSales(getSales());
  }, []);

  const total = quantity * price;

  function refreshSales() {
    setSales(getSales());
  }
const filteredSales = sales
  .filter(
    (sale) =>
      sale.bouquet.toLowerCase().includes(search.toLowerCase()) ||
      sale.color.toLowerCase().includes(search.toLowerCase()) ||
      sale.date.includes(search)
  )
  .sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.date.localeCompare(a.date);

      case "oldest":
        return a.date.localeCompare(b.date);

      case "highest":
        return b.total - a.total;

      case "lowest":
        return a.total - b.total;

      case "qty":
        return b.quantity - a.quantity;

      default:
        return 0;
    }
  });

function handleSave() {
  const sale: Sale = {
    id: editingId ?? Date.now(),
    date,
    bouquet,
    color,
    quantity,
    price,
    total,
  };

  if (editingId) {
    updateSale(sale);
    alert("✅ Sale Updated!");
    setEditingId(null);
  } else {
    saveSale(sale);
    alert("✅ Sale Saved!");
  }

  refreshSales();

  setDate("");
  setBouquet("Rose Bouquet");
  setColor("Pink");
  setQuantity(1);
  setPrice(0);
}

  function handleDelete(id: number) {
    if (!confirm("Delete this sale?")) return;

    deleteSale(id);
    refreshSales();
  }

  return (
    <main className="min-h-screen bg-pink-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-pink-600 mb-8">
          🌸 Bouquet Sales
        </h1>

        <div className="space-y-5">

          <input
            type="date"
            className="w-full border rounded-xl p-3"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <select
            className="w-full border rounded-xl p-3"
            value={bouquet}
            onChange={(e) => setBouquet(e.target.value)}
          >
            <option>Rose Bouquet</option>
            <option>Tulip Bouquet</option>
            <option>Sunflower Bouquet</option>
            <option>Money Bouquet</option>
            <option>Customized Bouquet</option>
          </select>

          <select
            className="w-full border rounded-xl p-3"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            <option>Pink</option>
            <option>White</option>
            <option>Red</option>
            <option>Blue</option>
            <option>Purple</option>
            <option>Yellow</option>
          </select>

          <input
            type="number"
            className="w-full border rounded-xl p-3"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <input
            type="number"
            className="w-full border rounded-xl p-3"
            placeholder="Selling Price (per bouquet)"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

        </div>

       <div className="bg-pink-100 rounded-2xl mt-8 p-6">
  <h2 className="text-xl font-bold">Total Sale</h2>

  <p className="text-4xl font-bold text-pink-600 mt-2">
    ₱{total.toLocaleString()}
  </p>
</div>

<button
  onClick={handleSave}
  className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl py-4 mt-8"
>
  {editingId ? "Update Sale" : "Save Sale"}
</button>

        <div className="mt-10">

         <h2 className="text-2xl font-bold mb-4">
  Sales History
</h2>

<input
  type="text"
  placeholder="🔍 Search by bouquet, color or date..."
  className="w-full border rounded-xl p-3 mb-4"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

<select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="w-full border rounded-xl p-3 mb-4"
>
  <option value="newest">📅 Newest First</option>
  <option value="oldest">📅 Oldest First</option>
  <option value="highest">💰 Highest Sale</option>
  <option value="lowest">💸 Lowest Sale</option>
  <option value="qty">🌸 Highest Quantity</option>
</select>





          <table className="w-full border border-gray-200">

            <thead className="bg-pink-100">

              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Bouquet</th>
                <th className="p-3 text-left">Color</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-center">Action</th>
              </tr>

            </thead>

            <tbody>
  {filteredSales.length === 0 && (
    <tr>
      <td
        colSpan={6}
        className="text-center p-6 text-gray-500"
      >
        No sales found.
      </td>
    </tr>
  )}

  {filteredSales.map((sale) => (
    <tr key={sale.id} className="border-t">
      <td className="p-3">{sale.date}</td>

      <td className="p-3">{sale.bouquet}</td>

      <td className="p-3">{sale.color}</td>

      <td className="p-3 text-center">
        {sale.quantity}
      </td>

      <td className="p-3 text-right">
        ₱{sale.total.toLocaleString()}
      </td>

      <td className="p-3 text-center">

  <button
    onClick={() => {
      setEditingId(sale.id);
      setDate(sale.date);
      setBouquet(sale.bouquet);
      setColor(sale.color);
      setQuantity(sale.quantity);
      setPrice(sale.price);
    }}
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg mr-2"
  >
    Edit
  </button>

  <button
    onClick={() => handleDelete(sale.id)}
    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
  >
    Delete
  </button>

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