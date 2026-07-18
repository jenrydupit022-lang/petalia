"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function BouquetCostPage() {

 const { id } = useParams();

const [image, setImage] = useState("");

const [materials, setMaterials] = useState<
{
  name:string;
  qty:number;
  cost:number;
}[]
>([]);

const [materialName, setMaterialName] = useState("");
const [materialQty, setMaterialQty] = useState(1);
const [materialCost, setMaterialCost] = useState(0);
const [editIndex, setEditIndex] = useState<number | null>(null);





 

const [bouquet, setBouquet] = useState<{
    
  id: number;
  name: string;
  image: string;
  materials: any[];
  totalCost: number;
  suggestedPrice: number;
} | null>(null);

  useEffect(() => {

  const stored = JSON.parse(
    localStorage.getItem("bouquets") || "[]"
  );


  const found = stored.find(
    (b:any) => b.id === Number(id)
  );


  setBouquet(found);


  if(found?.materials){

    setMaterials(found.materials);

  }


  if(found?.image){

    setImage(found.image);

  }


}, [id]);






const totalCost = materials.reduce(
  (total, item) =>
    total + (item.qty * item.cost),
  0
);


const suggestedPrice = Math.ceil(
  totalCost * 1.5
);



function addMaterial() {

  if (!materialName.trim()) return;


    

  if (!materialName.trim()) return;


  const newMaterials = [
    ...materials,
    {
      name: materialName,
      qty: materialQty,
      cost: materialCost,
    },
  ];


  setMaterials(newMaterials);


  const stored = JSON.parse(
    localStorage.getItem("bouquets") || "[]"
  );


  const updated = stored.map((b:any)=>{

    if(b.id === Number(id)){

      return {
  ...b,
  materials: newMaterials,
  totalCost: newMaterials.reduce(
    (total:any, item:any) =>
      total + (item.qty * item.cost),
    0
  ),
  suggestedPrice: Math.ceil(
    newMaterials.reduce(
      (total:any, item:any) =>
        total + (item.qty * item.cost),
      0
    ) * 1.5
  ),
};

    }

    return b;

  });


  localStorage.setItem(
    "bouquets",
    JSON.stringify(updated)
  );


  setMaterialName("");
  setMaterialQty(1);
  setMaterialCost(0);

}
function editMaterial(index:number){

  const material = materials[index];

  setMaterialName(material.name);
  setMaterialQty(material.qty);
  setMaterialCost(material.cost);

  setEditIndex(index);

}


function deleteMaterial(index:number){

  const newMaterials = materials.filter(
    (_, i)=> i !== index
  );

  setMaterials(newMaterials);

  const stored = JSON.parse(
    localStorage.getItem("bouquets") || "[]"
  );

  const updated = stored.map((b:any)=>{

    if(b.id === Number(id)){

      const total = newMaterials.reduce(
        (sum:any,item:any)=>
          sum + (item.qty * item.cost),
        0
      );

      return {
        ...b,
        materials:newMaterials,
        totalCost:total,
        suggestedPrice:Math.ceil(total * 1.5)
      };

    }

    return b;

  });

  localStorage.setItem(
    "bouquets",
    JSON.stringify(updated)
  );

}

 
  return (
    <main className="min-h-screen bg-pink-50 p-8">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-pink-600 mb-8">
          💐 Bouquet Costing
        </h1>

        <h2 className="text-2xl font-bold text-gray-700 mb-8">
  {bouquet?.name}
</h2>

        <div className="border-2 border-dashed rounded-3xl p-6 text-center">

{image ? (
  <img
    src={image}
    alt={bouquet?.name || "Bouquet"}
    className="w-full h-80 object-cover rounded-2xl"
    onError={() => setImage("")}
  />
) : (
  <div className="h-80 flex items-center justify-center text-6xl">
    📷
  </div>
)}
  
  

  <div className="mt-6 bg-pink-50 rounded-2xl p-6">

  <h2 className="text-2xl font-bold mb-4">
    🌸 Quick Materials
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

    <button
      onClick={() => setMaterialName("Flower")}
      className="bg-white border p-3 rounded-xl hover:bg-pink-100"
    >
      🌹 Flower
    </button>

    <button
      onClick={() => setMaterialName("Wrapper")}
      className="bg-white border p-3 rounded-xl hover:bg-pink-100"
    >
      🎀 Wrapper
    </button>

    <button
      onClick={() => setMaterialName("Ribbon")}
      className="bg-white border p-3 rounded-xl hover:bg-pink-100"
    >
      🎗 Ribbon
    </button>

    <button
      onClick={() => setMaterialName("Filler")}
      className="bg-white border p-3 rounded-xl hover:bg-pink-100"
    >
      🌿 Filler
    </button>

  </div>

</div>  {/* <-- idagdag ito pre */}


<div className="mt-8 bg-green-50 rounded-2xl p-6">

  <h2 className="text-2xl font-bold mb-4">
    💰 Cost Summary
  </h2>


  <p className="text-lg">
    Total Cost:
    <span className="font-bold">
      ₱{totalCost}
    </span>
  </p>


  <p className="text-lg mt-2">
    Suggested Selling Price:
    <span className="font-bold text-green-600">
      ₱{suggestedPrice}
    </span>
  </p>


  <p className="text-lg mt-2">
    Estimated Profit:
    <span className="font-bold text-pink-600">
      ₱{suggestedPrice - totalCost}
    </span>
  </p>


</div>
  <input
    type="file"
    accept="image/*"
    className="mt-5"
    onChange={(e) => {

      const file = e.target.files?.[0];

      if (!file) return;

      const reader = new FileReader();

     reader.onload = () => {

  const img = reader.result as string;

  setImage(img);


  const stored = JSON.parse(
    localStorage.getItem("bouquets") || "[]"
  );


  const updated = stored.map((b:any)=>{

    if(b.id === Number(id)){

   return {
  ...b,
  image: img,
};

    }

    return b;

  });


  localStorage.setItem(
    "bouquets",
    JSON.stringify(updated)
  );

};

      reader.readAsDataURL(file);

    }}
  />

</div>

        <Link
  href="/petalia/bouquets"
  className="inline-block mt-8 bg-gray-500 text-white px-6 py-3 rounded-xl"
>
  ← Back
</Link>
<div className="mt-8 bg-pink-50 rounded-2xl p-6">

  <h2 className="text-2xl font-bold mb-5">
    🌹 Materials
  </h2>

  <input
    placeholder="Material Name"
    value={materialName}
    onChange={(e)=>setMaterialName(e.target.value)}
    className="w-full border rounded-xl p-3 mb-3"
  />

  <input
    type="number"
    placeholder="Quantity"
    value={materialQty}
    onChange={(e)=>setMaterialQty(Number(e.target.value))}
    className="w-full border rounded-xl p-3 mb-3"
  />

  <input
    type="number"
    placeholder="Cost per Item"
    value={materialCost}
    onChange={(e)=>setMaterialCost(Number(e.target.value))}
    className="w-full border rounded-xl p-3 mb-3"
  />
<button
  onClick={() => {

   if(editIndex !== null){

  const updatedMaterials = [...materials];


  updatedMaterials[editIndex] = {
    name: materialName,
    qty: materialQty,
    cost: materialCost,
  };


  const total = updatedMaterials.reduce(
    (sum, item)=>
      sum + (item.qty * item.cost),
    0
  );


  setMaterials(updatedMaterials);


  const stored = JSON.parse(
    localStorage.getItem("bouquets") || "[]"
  );


  const updated = stored.map((b:any)=>{

    if(b.id === Number(id)){

      return {
        ...b,
        materials: updatedMaterials,
        totalCost: total,
        suggestedPrice: Math.ceil(total * 1.5)
      };

    }

    return b;

  });


  localStorage.setItem(
    "bouquets",
    JSON.stringify(updated)
  );


  setEditIndex(null);

} else {

      addMaterial();

    }


    setMaterialName("");
    setMaterialQty(1);
    setMaterialCost(0);

  }}

  className="bg-green-500 text-white px-5 py-3 rounded-xl"
>
  {editIndex !== null ? "💾 Save Changes" : "➕ Add Material"}
</button>
<button
  onClick={()=>{
    setEditIndex(null);
    setMaterialName("");
    setMaterialQty(1);
    setMaterialCost(0);
  }}
  className="bg-gray-400 text-white px-5 py-3 rounded-xl ml-3"
>
  ❌ Cancel
</button>
  <div className="mt-8">

  <h3 className="text-xl font-bold mb-4">
    📋 Material List
  </h3>

  {materials.map((material, index) => (

<div
  key={index}
  className="bg-white rounded-xl p-4 mb-3 border flex justify-between items-center"
>

  <div>
    <p className="font-bold">
      {material.name}
    </p>

    <p>
      Qty: {material.qty}
    </p>

    <p>
      ₱{material.qty * material.cost}
    </p>
  </div>

<button
  onClick={() => editMaterial(index)}
  className="bg-blue-500 text-white px-4 py-2 rounded-xl mr-2"
>
  ✏️ Edit
</button>
  <button
    onClick={() => deleteMaterial(index)}
    className="bg-red-500 text-white px-4 py-2 rounded-xl"
  >
    🗑 Delete
  </button>


</div>

))}

      
</div>

</div>
      </div>

    </main>
  );
}