"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "@/components/loader"; // custom loader

interface Book {
  id: number;
  title: string;
  author: string;
}

interface Developer {
  name: string;
  role: string;
  avatar?: string; // optional URL
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // new state

  const developers: Developer[] = [
    { name: "Alice Johnson", role: "Frontend Developer" },
    { name: "Bob Smith", role: "Backend Developer" },
    { name: "Charlie Lee", role: "UI/UX Designer" },
    { name: "Dana White", role: "Full Stack Developer" },
    { name: "Ethan Brown", role: "Database Admin" },
    { name: "Fiona Green", role: "Project Manager" },
  ];

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user.role !== "admin") {
      alert("Access Denied");
      router.push("/login");
    }
  }, [status, session, router]);

  // Fetch books
  useEffect(() => {
    if (!session || session.user.role !== "admin") return;

    async function fetchBooks() {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoadingBooks(false);
      }
    }
    fetchBooks();
  }, [session]);

  // Show loader while checking session
  if (status === "loading" || isLoggingOut) return <Loader />;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Library Admin Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-700">
            Hello, {session?.user.name}
          </span>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`px-5 py-2 rounded-full shadow-lg transition transform ${
              isLoggingOut
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 hover:scale-105 text-white"
            }`}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Books Card */}
        <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Books</h2>
          <p className="text-gray-700">
            Total Books:{" "}
            <span className="font-semibold text-blue-600">{books.length}</span>
          </p>
          <Link
            href="/books"
            className="mt-5 inline-block bg-pink-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow transition transform hover:scale-105"
          >
            Manage Books
          </Link>
        </div>

        {/* Admins Card */}
        <div className="p-6 bg-white rounded-2xl shadow-lg transition transform hover:-translate-y-2">
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Admins</h2>
          <p className="text-gray-700">
            Total Admins: <span className="font-semibold text-green-600">1</span>
          </p>
          <button
            disabled
            className="mt-5 w-full bg-gray-400 text-white px-5 py-2 rounded-full shadow cursor-not-allowed opacity-50"
          >
            Manage Admins
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 border-t pt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Meet the Development Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xl font-bold mb-3">
                {dev.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="font-semibold text-gray-800">{dev.name}</h3>
              <p className="text-gray-500 text-sm">{dev.role}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm text-center mt-8">
          &copy; {new Date().getFullYear()} Library Management System
        </p>
      </div>
    </div>
  );
}
