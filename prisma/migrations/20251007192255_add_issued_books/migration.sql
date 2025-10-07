-- CreateTable
CREATE TABLE "IssuedBook" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "IssuedBook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IssuedBook_userId_bookId_returned_key" ON "IssuedBook"("userId", "bookId", "returned");

-- AddForeignKey
ALTER TABLE "IssuedBook" ADD CONSTRAINT "IssuedBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssuedBook" ADD CONSTRAINT "IssuedBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
