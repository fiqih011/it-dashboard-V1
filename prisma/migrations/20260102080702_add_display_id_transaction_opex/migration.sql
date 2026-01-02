/*
  Warnings:

  - A unique constraint covering the columns `[display_id]` on the table `transaction_opex` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `display_id` to the `transaction_opex` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction_opex" ADD COLUMN     "display_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transaction_opex_display_id_key" ON "transaction_opex"("display_id");
