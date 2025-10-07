import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { bookId } = await req.json();

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });
    if (book.copies <= 0) return NextResponse.json({ error: "No copies available" }, { status: 400 });

    // Create issued book entry
    const issuedBook = await prisma.issuedBook.create({
      data: {
        userId: session.user.id,
        bookId,
      },
    });

    // Reduce book copies
    await prisma.book.update({
      where: { id: bookId },
      data: {
        copies: book.copies - 1,
        available: book.copies - 1 > 0,
      },
    });

    return NextResponse.json({ message: "Book issued", issuedBook });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
