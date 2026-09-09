"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Material = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
};

const STORAGE_KEY = "petalia_materials";

export default function MaterialsInventoryPage() {
  const [materials, setMaterials] = useState<Material[]>([]);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        setMaterials(JSON.parse(saved));
      } catch {
        setMaterials([]);
      }
    }
  }, []);

  function saveMaterials(updatedMaterials: Material[]) {
    setMaterials(updatedMaterials);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedMaterials)
    );
  }

  function addMaterial() {
    if (!name.trim()) {
      alert("Please enter a material name.");
      return;
    }

    const qty = Number(quantity);

    if (!Number.isFinite(qty) || qty < 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (!unit.trim()) {
      alert("Please enter a unit.");
      return;
    }

    const newMaterial: Material = {
      id: Date.now(),
      name: name.trim(),
      quantity: qty,
      unit: unit.trim(),
    };

    saveMaterials([...materials, newMaterial]);

    setName("");
    setQuantity("");
    setUnit("");
  }

  function editMaterial(material: Material) {
    const newName = prompt(
      "Material name:",
      material.name
    );

    if (newName === null) return;

    const newQuantity = prompt(
      "Quantity:",
      String(material.quantity)
    );

    if (newQuantity === null) return;

    const newUnit = prompt(
      "Unit:",
      material.unit
    );

    if (newUnit === null) return;

    const qty = Number(newQuantity);

    if (!newName.trim()) {
      alert("Material name cannot be empty.");
      return;
    }

    if (!Number.isFinite(qty) || qty < 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (!newUnit.trim()) {
      alert("Unit cannot be empty.");
      return;
    }

    const updatedMaterials = materials.map(
      (item) =>
        item.id === material.id
          ? {
              ...item,
              name: newName.trim(),
              quantity: qty,
              unit: newUnit.trim(),
            }
          : item
    );

    saveMaterials(updatedMaterials);
  }

  function deleteMaterial(materialId: number) {
    if (!confirm("Delete this material?")) return;

    const updatedMaterials = materials.filter(
      (material) => material.id !== materialId
    );

    saveMaterials(updatedMaterials);
  }

  return (
    <main className="min-h-screen bg-pink-50 p-4 md:p-8">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-pink-600">
              📦 Materials Inventory
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your flower shop materials and stock.
            </p>
          </div>

          <Link
            href="/petalia"
            className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-xl font-semibold text-center"
          >
            ← Back to Petalia
          </Link>

        </div>

        {/* ADD MATERIAL */}

        <div className="bg-white rounded-3xl shadow-md p-6 border border-pink-100 mb-6">

          <h2 className="text-xl font-bold text-gray-700 mb-4">
            ➕ Add Material
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Material name"
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300"
            />

            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300"
            />

            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Unit (pcs, meters, rolls...)"
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300"
            />

          </div>

          <button
            onClick={addMaterial}
            className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-5 py-3 font-semibold"
          >
            + Add Material
          </button>

        </div>

        {/* MATERIAL LIST */}

        <div className="bg-white rounded-3xl shadow-md border border-pink-100 overflow-hidden">

          <div className="p-6 border-b border-gray-100">

            <h2 className="text-xl font-bold text-gray-700">
              📋 Current Materials
            </h2>

            <p className="text-gray-500 mt-1">
              {materials.length} material
              {materials.length !== 1 ? "s" : ""} recorded
            </p>

          </div>

          {materials.length === 0 ? (

            <div className="p-10 text-center">

              <div className="text-5xl mb-3">
                📦
              </div>

              <p className="text-gray-500">
                No materials added yet.
              </p>

            </div>

          ) : (

            <div className="divide-y">

              {materials.map((material) => (

                <div
                  key={material.id}
                  className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >

                  <div>

                    <p className="text-lg font-bold text-gray-700">
                      🌸 {material.name}
                    </p>

                    <p className="text-gray-500 mt-1">
                      Stock:{" "}
                      <span className="font-bold text-pink-600">
                        {material.quantity}
                      </span>{" "}
                      {material.unit}
                    </p>

                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() => editMaterial(material)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteMaterial(material.id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </main>
  );
}