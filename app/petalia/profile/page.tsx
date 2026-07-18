"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {

 const [name, setName] = useState("");
const [role, setRole] = useState("");
const [photo, setPhoto] = useState("");

  useEffect(() => {
    setName(
      localStorage.getItem("profileName") || "Administrator"
    );
    setPhoto(
  localStorage.getItem("profilePhoto") || ""
);
    setRole(
      localStorage.getItem("profileRole") || "Administrator"
    );
  }, []);


function saveProfile(){

  localStorage.setItem(
    "profileName",
    name
  );

  localStorage.setItem(
    "profileRole",
    role
  );

  localStorage.setItem(
    "profilePhoto",
    photo
  );

  window.dispatchEvent(
    new Event("profileUpdated")
  );

  alert("✅ Profile Saved!");

}
  return (
    <main className="min-h-screen bg-pink-50 p-8">

      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-pink-600 mb-8">
          👤 User Profile
        </h1>
        {photo && (
  <img
    src={photo}
    className="w-32 h-32 rounded-full object-cover mx-auto mb-5"
  />
)}

<input
  type="file"
  accept="image/*"
  onChange={(e)=>{

    const file = e.target.files?.[0];

    if(file){

      const reader = new FileReader();

      reader.onload = ()=>{
        setPhoto(reader.result as string);
      };

      reader.readAsDataURL(file);

    }

  }}
/>


      <label className="font-semibold">
  Name
</label>

<input
  className="w-full border rounded-xl p-3 mt-2 mb-5"
  value={name}
  onChange={(e)=>setName(e.target.value)}
/>


<label className="font-semibold">
  Role
</label>

<input
  className="w-full border rounded-xl p-3 mt-2 mb-5"
  value={role}
  onChange={(e)=>setRole(e.target.value)}
/>

<button
  onClick={saveProfile}
>
  Save Profile
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