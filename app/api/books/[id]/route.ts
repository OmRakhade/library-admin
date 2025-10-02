// app/api/books/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const idStr = params?.id;
  const id = parseInt(idStr, 10);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid book id" }, { status: 400 });
  }

  try {
  await prisma.book.delete({ where: { id } });
  return new Response(JSON.stringify({ message: "Book deleted" }), { status: 200 });
} catch (error: any) {
  if (error.code === "P2025") { // TypeScript may warn, but works at runtime
    return new Response(JSON.stringify({ error: "Book not found" }), { status: 404 });
  }
  return new Response(JSON.stringify({ error: "Failed to delete book" }), { status: 500 });
}

}
