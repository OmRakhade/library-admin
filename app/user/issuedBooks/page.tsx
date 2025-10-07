"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";

interface IssuedBook {
  id: number;
  book: {
    title: string;
    author: string;
  };
  issuedAt: string;
}

export default function IssuedBooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;

    async function fetchIssuedBooks() {
      try {
        const res = await fetch("/api/books/issued");
        const data = await res.json();
        setIssuedBooks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchIssuedBooks();
  }, [session]);

  const handleLogout = async () => signOut({ callbackUrl: "/login" });

  if (status === "loading" || loading) return <Loader />;

  if (!session) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">Access Denied</p>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition transform hover:scale-105"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-50 via-pink-50 to-yellow-50 p-6">
   <header className="flex justify-between items-center mb-10">
  {/* Back Button */}
  <button
    onClick={() => router.push("/user/dashboard")}
    className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-lg shadow-lg rounded-xl text-gray-800 hover:bg-white transition-all"
  >
    ← Back
  </button>

  <h1 className="text-4xl font-extrabold text-gray-800 text-center flex-1">
    Your Issued Books
  </h1>


</header>


      {issuedBooks.length === 0 ? (
        <p className="text-gray-500 text-center text-lg mt-10">
          You haven’t issued any books yet.
        </p>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issuedBooks.map((issued) => (
            <div
              key={issued.id}
              className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition hover:-translate-y-1"
            >
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                {issued.book.title}
              </h2>
              <p className="text-gray-600 mb-1">Author: {issued.book.author}</p>
              <p className="text-gray-500 text-sm">
                Issued At: {new Date(issued.issuedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
