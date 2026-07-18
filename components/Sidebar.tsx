"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getInventory } from "@/lib/storage";


  export default function Sidebar() {

  const { data: session } = useSession();
const pathname = usePathname();
const [profileName, setProfileName] = useState("Administrator");
const [profileRole, setProfileRole] = useState("Administrator");
const [profilePhoto, setProfilePhoto] = useState("");
const [lowStockCount, setLowStockCount] = useState(0);


  useEffect(() => {

  function loadData() {

    setProfilePhoto(
      localStorage.getItem("profilePhoto") || ""
    );

    setProfileName(
      localStorage.getItem("profileName") || "Administrator"
    );

    setProfileRole(
      localStorage.getItem("profileRole") || "Administrator"
    );

    const inventory = getInventory();

    setLowStockCount(
      inventory.filter(
        (item) => Number(item.stock) <= 5
      ).length
    );

  }

  loadData();

  const interval = setInterval(loadData, 1000);

  return () => {
    clearInterval(interval);
  };

}, 
[]);

  return (
    <aside className="w-72 min-h-screen bg-white shadow-xl p-6">

      <h1 className="text-3xl font-bold text-pink-600 mb-10">
        🌸 Petalia
      </h1>
<div className="bg-pink-50 rounded-2xl p-4 mb-8">

 {profilePhoto ? (
  <img
    src={profilePhoto}
    className="w-20 h-20 rounded-full object-cover mb-3"
  />
) : (
  <div className="text-4xl mb-2">
    👤
  </div>
)}
<h2 className="font-bold text-gray-700">
  {profileName}
</h2>
<p className="text-sm text-gray-500">
  {profileRole}
</p>

  <p className="text-sm text-gray-500">
    {session?.user?.email}
  </p>

</div>
      <nav className="space-y-4">

        
        <Link
  href="/petalia/profile"
className={`block p-3 rounded-xl ${
  pathname === "/petalia/profile"
    ? "bg-pink-200 text-pink-700"
    : "hover:bg-pink-100"
}`}
>
  👤 Profile
</Link>

        <Link
          href="/petalia/sales"
          className="block p-3 rounded-xl hover:bg-pink-100"
        >
          🌸 Sales
        </Link>

        <Link
          href="/petalia/expenses"
          className="block p-3 rounded-xl hover:bg-pink-100"
        >
          💸 Expenses
        </Link>

       <Link
  href="/petalia/inventory"
  className="block p-3 rounded-xl hover:bg-pink-100 flex justify-between items-center"
>
  <span>📦 Inventory</span>

  {lowStockCount > 0 && (
    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
      {lowStockCount}
    </span>
  )}
</Link>

<Link
  href="/petalia/bouquets"
  className="block p-3 rounded-xl hover:bg-pink-100"
>
  💐 Bouquet Catalog
</Link>
        <Link
          href="/petalia/reports"
          className="block p-3 rounded-xl hover:bg-pink-100"
        >
          📄 Reports
        </Link>

        <Link
          href="/petalia/settings"
          className="block p-3 rounded-xl hover:bg-pink-100"
        >
          ⚙️ Settings
        </Link>

      </nav>


      <button
        onClick={() => signOut({callbackUrl:"/login"})}
        className="mt-10 w-full bg-red-500 text-white p-3 rounded-xl"
      >
        🚪 Logout
      </button>


    </aside>
  );
}