"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Profile = {
  role: "treasurer" | "auditor" | "viewer";
  system_access: "classfund" | "petalia" | "both";
};

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role, system_access")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        console.error("Profile error:", error);
        await supabase.auth.signOut();
        router.replace("/login");
        return;
      }

      setProfile(data);
      setLoading(false);
    }

    checkUser();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading || !profile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-pink-50">
        <p className="text-pink-600 font-semibold">
          Loading...
        </p>
      </main>
    );
  }

  const canAccessPetalia =
    profile.system_access === "petalia" ||
    profile.system_access === "both";

  const canAccessClassFund =
    profile.system_access === "classfund" ||
    profile.system_access === "both";

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-sky-100 p-4 md:p-8">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-pink-500">
                
                🌸 The Studio Petalia
              </h1>

              <p className="text-gray-500 mt-2">
                Business Hub
              </p>

              <div className="mt-3 inline-block bg-gray-100 px-4 py-2 rounded-xl text-sm font-semibold capitalize">
                Role: {profile.role}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-semibold"
            >
              🚪 Logout
            </button>

          </div>

          {/* BUSINESS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-10">

            {/* PETALIA */}
            {canAccessPetalia && (
              <div className="bg-pink-50 rounded-2xl p-6 md:p-8 shadow-lg border border-pink-200">

                <div className="text-5xl md:text-6xl">
                  🌸
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mt-4">
                  Petalia
                </h2>

                <p className="mt-2 text-gray-600">
                  Flower Shop Management
                </p>

                <Link
                  href="/petalia"
                  className="block w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-center font-semibold"
                >
                  Open Business
                </Link>

              </div>
            )}

            {/* CLASSFUND */}
            {canAccessClassFund && (
              <div className="bg-green-50 rounded-2xl p-6 md:p-8 shadow-lg border border-green-200">

                <div className="text-5xl md:text-6xl">
                  💰
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mt-4">
                  ClassFund
                </h2>

                <p className="mt-2 text-gray-600">
                  Class Treasurer Financial Management
                </p>

                <Link
                  href="/classfund"
                  className="block w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-center font-semibold"
                >
                  Open ClassFund
                </Link>

              </div>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}