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
const [menuOpen, setMenuOpen] = useState(false);


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
    <>{menuOpen && (
  <div
    className="fixed inset-0 bg-transparent z-30"
    onClick={() => setMenuOpen(false)}
  />
)}

<div className="md:hidden fixed top-4 left-4 z-50">
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="bg-pink-500 text-white p-3 rounded-xl shadow-lg"
  >
    {menuOpen ? "✕" : "☰"}
  </button>
</div>
    <aside
  className={`
    fixed md:static
    top-0 left-0
    h-screen
    w-72
    overflow-y-auto
    bg-white/95 backdrop-blur-xl
    shadow-xl
    p-4 md:p-6
    z-40
    transition-transform duration-300
    ${menuOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
>

     <h1 className="text-2xl md:text-3xl font-bold text-pink-600 mb-6 md:mb-10">
        🌸 Petalia
      </h1>
<div className="bg-pink-50 rounded-2xl p-4 mb-8">

 {profilePhoto ? (
  <img
    src={profilePhoto}
   className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover mb-3"
  />
) : (
  <div className="text-3xl md:text-4xl mb-2">
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
      <nav className="space-y-2 md:space-y-4">

        
        <Link
  href="/petalia/profile"
className={`block p-2 md:p-3 rounded-xl ${
  pathname === "/petalia/profile"
    ? "bg-pink-200 text-pink-700"
    : "hover:bg-pink-100"
}`}
>
  👤 Profile
</Link>

        <Link
  href="/petalia/sales"
  onClick={() => setMenuOpen(false)}
  className={`block p-2 md:p-3 rounded-xl ${
  pathname === "/petalia/sales"
    ? "bg-pink-200 text-pink-700"
    : "hover:bg-pink-100"
}`}
>
  🌸 Sales
</Link>

        <Link
  href="/petalia/expenses"
  onClick={() => setMenuOpen(false)}
  className={`block p-2 md:p-3 rounded-xl ${
    pathname === "/petalia/expenses"
      ? "bg-pink-200 text-pink-700"
      : "hover:bg-pink-100"
  }`}
>
  💸 Expenses
</Link>
<Link
  href="/petalia/materials"
  onClick={() => setMenuOpen(false)}
  className={`block p-2 md:p-3 rounded-xl ${
    pathname === "/petalia/materials"
      ? "bg-pink-200 text-pink-700"
      : "hover:bg-pink-100"
  }`}
>
  🧰 Materials Inventory
</Link>
      <Link
  href="/petalia/inventory"
  onClick={() => setMenuOpen(false)}
className={`block p-2 md:p-3 rounded-xl flex justify-between items-center ${
  pathname === "/petalia/inventory"
    ? "bg-pink-200 text-pink-700"
    : "hover:bg-pink-100"
}`}
>
  <span>📦 Event Inventory</span>

  {lowStockCount > 0 && (
    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
      {lowStockCount}
    </span>
  )}
</Link>

<Link
  href="/petalia/bouquets"
  onClick={() => setMenuOpen(false)}
  className={`block p-2 md:p-3 rounded-xl ${
    pathname === "/petalia/bouquets"
      ? "bg-pink-200 text-pink-700"
      : "hover:bg-pink-100"
  }`}
>
  💐 Bouquet Catalog
</Link>
        <Link
  href="/petalia/reports"
  onClick={() => setMenuOpen(false)}
  className={`block p-2 md:p-3 rounded-xl ${
    pathname === "/petalia/reports"
      ? "bg-pink-200 text-pink-700"
      : "hover:bg-pink-100"
  }`}
>
  📄 Reports
</Link>

        <Link
  href="/petalia/settings"
  onClick={() => setMenuOpen(false)}
  className={`block p-2 md:p-3 rounded-xl ${
    pathname === "/petalia/settings"
      ? "bg-pink-200 text-pink-700"
      : "hover:bg-pink-100"
  }`}
>
  ⚙️ Settings
</Link>
      

      </nav>


      <button
        onClick={() => {
  setMenuOpen(false);
  signOut({ callbackUrl: "/login" });
}}
        className="mt-6 md:mt-10 w-full bg-red-500 text-white p-3 rounded-xl"
      >
        🚪 Logout
      </button>


    </aside>
    </>
  );
}