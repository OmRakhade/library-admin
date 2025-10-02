// app/api/books/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, author, category, publication, publicationdate, copies } = body;

    if (!title || !author || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        category,
        publication: publication || null,
        publicationdate: publicationdate ? new Date(publicationdate) : null,
        copies: typeof copies === "number" && copies > 0 ? copies : 1,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
