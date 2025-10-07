"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  publication?: string;
  publicationdate?: string | null;
  copies: number;
  createdAt: string;
}

export default function BooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    publication: "",
    publicationdate: "",
    copies: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch books
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/books");
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    if ((session as any).user?.role !== "admin") return;
    fetchBooks();
  }, [session, fetchBooks]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Add book
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.category) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        alert(err.error || "Failed to add book");
        return;
      }
      const newBook = await res.json();
      setBooks(prev => [newBook, ...prev]);
      setForm({ title: "", author: "", category: "", publication: "", publicationdate: "", copies: 1 });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete book
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({ error: res.statusText }));
        alert(payload.error || "Failed to delete book");
        return;
      }
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (session && (session as any).user?.role !== "admin") return <p>Access denied</p>;

  // Filter books
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 p-8">
      {/* Header with back button left and title right */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-lg shadow-lg rounded-xl text-gray-800 hover:bg-white transition-all"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-sm ml-auto">
          📚 Books Management
        </h1>
      </div>

      {/* Add Book Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-gray-200 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Add New Book</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <input type="text" placeholder="Title" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full" />
            <input type="text" placeholder="Author" value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full" />
            <input type="text" placeholder="Category" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <input type="text" placeholder="Publisher" value={form.publication}
              onChange={(e) => setForm({ ...form, publication: e.target.value })}
              className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full" />
            <input type="date" value={form.publicationdate}
              onChange={(e) => setForm({ ...form, publicationdate: e.target.value })}
              className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full" />
            <input type="number" min={1} placeholder="Copies" value={form.copies}
              onChange={(e) => setForm({ ...form, copies: parseInt(e.target.value) || 1 })}
              className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full" />
          </div>

          <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all">
            {submitting ? "Adding..." : "Add Book"}
          </motion.button>
        </form>
      </motion.div>


      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title, author, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      
      {/* Book List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📖 Book List</h2>
        {loading ? <p className="text-gray-600">Loading books...</p> :
          filteredBooks.length === 0 ? <p className="text-gray-500 italic">No books match your search.</p> : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
              <table className="w-full text-left text-gray-700">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Author</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Publisher</th>
                    <th className="px-4 py-3">Publication Date</th>
                    <th className="px-4 py-3">Copies</th>
                    <th className="px-4 py-3">Created At</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book, index) => (
                    <tr key={`${book.id}-${index}`} className={`transition-colors ${index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}`}>
                      <td className="px-4 py-3">{book.title}</td>
                      <td className="px-4 py-3">{book.author}</td>
                      <td className="px-4 py-3">{book.category}</td>
                      <td className="px-4 py-3">{book.publication || "-"}</td>
                      <td className="px-4 py-3">{book.publicationdate ? new Date(book.publicationdate).toLocaleDateString() : "-"}</td>
                      <td className="px-4 py-3">{book.copies}</td>
                      <td className="px-4 py-3">{new Date(book.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(book.id)}
                          disabled={deletingId === book.id}
                          className={`px-3 py-1 text-sm rounded-lg transition ${deletingId === book.id ? "bg-gray-400 cursor-not-allowed text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}
                        >
                          {deletingId === book.id ? "Deleting..." : "🗑️ Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </motion.div>
    </div>
  );
}
