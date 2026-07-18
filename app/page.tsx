"use client";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
export default function Home() {const { status } = useSession();
const router = useRouter();

useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/login");
  }
}, [status, router]);

if (status === "loading") {
  return <p>Loading...</p>;
}
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-sky-100 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-[900px]">
<div className="flex justify-between items-center">
  <div>
    <h1 className="text-5xl font-bold text-pink-500">
      🌸 The Studio Petalia
    </h1>

    <p className="text-gray-500 mt-2">
      Business Hub
    </p>
  </div>

  <button
    onClick={() => signOut({ callbackUrl: "/login" })}
    className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl"
  >
    Logout
  </button>
</div>

        <div className="grid grid-cols-2 gap-8 mt-12">

          <div className="bg-pink-50 rounded-2xl p-8 shadow-lg border border-pink-200">

            <div className="text-6xl">
              🌸
            </div>

            <h2 className="text-3xl font-bold mt-4">
              Petalia
            </h2>

            <p className="mt-2 text-gray-600">
              Flower Shop Management
            </p>

            <Link
  href="/petalia"
  className="block w-full mt-8 bg-pink-500 text-white py-3 rounded-xl hover:bg-pink-600 text-center"
>
  Open Business
</Link>

          </div>

          <div className="bg-sky-50 rounded-2xl p-8 shadow-lg border border-sky-200">

            <div className="text-6xl">
              🍱
            </div>

            <h2 className="text-3xl font-bold mt-4">
              BaonBuddy
            </h2>

            <p className="mt-2 text-gray-600">
              Food Business Management
            </p>

            <button className="w-full mt-8 bg-sky-500 text-white py-3 rounded-xl hover:bg-sky-600">
              Open Business
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}