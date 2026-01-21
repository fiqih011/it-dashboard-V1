/*
  Warnings:

  - You are about to drop the column `display_id` on the `budget_plan_capex` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[budget_display_id]` on the table `budget_plan_capex` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transaction_display_id]` on the table `transaction_capex` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `budget_display_id` to the `budget_plan_capex` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_display_id` to the `transaction_capex` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "budget_plan_capex_display_id_key";

-- AlterTable
ALTER TABLE "budget_plan_capex" DROP COLUMN "display_id",
ADD COLUMN     "budget_display_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transaction_capex" ADD COLUMN     "transaction_display_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "budget_plan_capex_budget_display_id_key" ON "budget_plan_capex"("budget_display_id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_capex_transaction_display_id_key" ON "transaction_capex"("transaction_display_id");
