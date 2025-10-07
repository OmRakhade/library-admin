"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";

interface Book {
  id: number;
  title: string;
  author: string;
  copies: number;
}

export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [issuingId, setIssuingId] = useState<number | null>(null);
  const [issuedBooks, setIssuedBooks] = useState<Book[]>([]); // track issued books

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated" && session?.user.role === "admin")
      router.push("/dashboard");
  }, [status, session, router]);

  // Fetch books
  useEffect(() => {
    if (!session || session.user.role === "admin") return;

    async function fetchBooks() {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [session]);

  const handleLogout = async () => signOut({ callbackUrl: "/login" });

  const handleIssueBook = async (bookId: number) => {
    setIssuingId(bookId);
    try {
      const res = await fetch("/api/books/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Book issued successfully!");
        // Update the local state to reduce copies
        setBooks((prev) =>
          prev.map((b) =>
            b.id === bookId ? { ...b, copies: b.copies - 1 } : b
          )
        );

        // Add to issuedBooks
        const issuedBook = books.find((b) => b.id === bookId);
        if (issuedBook) setIssuedBooks((prev) => [...prev, issuedBook]);
      } else {
        alert(data.error || "Failed to issue book.");
      }
    } catch (error) {
      console.error(error);
      alert("Error issuing book.");
    } finally {
      setIssuingId(null);
    }
  };

  if (status === "loading" || loading) return <Loader />;

  if (!session || session.user.role === "admin") {
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

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-50 via-yellow-50 to-pink-50 p-6">
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-extrabold text-gray-800">User Dashboard</h1>

        {/* Search and Cart */}
        <div className="flex items-center w-full max-w-md gap-2">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Cart Button */}
          <button
            onClick={() => router.push("/user/issuedBooks")}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-full shadow flex items-center justify-center transition"
            title="View Issued Books"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13L17 13M7 13h10M9 21a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
          </button>
        </div>


        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-700">
            Hello, {session.user.name}
          </span>
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition hover:scale-105"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Book List */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold mb-2 text-gray-800">{book.title}</h2>
              <p className="text-gray-600 mb-1">Author: {book.author}</p>
              <p className="text-gray-600 mb-3">
                Available Copies: <span className="font-semibold">{book.copies}</span>
              </p>
            </div>
            <button
              onClick={() => handleIssueBook(book.id)}
              disabled={book.copies === 0 || issuingId === book.id}
              className={`mt-3 px-4 py-2 rounded-full shadow text-white transition transform hover:scale-105 ${book.copies === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : issuingId === book.id
                    ? "bg-yellow-500 cursor-wait"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {issuingId === book.id
                ? "Issuing..."
                : book.copies === 0
                  ? "Not Available"
                  : "Issue Book"}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
