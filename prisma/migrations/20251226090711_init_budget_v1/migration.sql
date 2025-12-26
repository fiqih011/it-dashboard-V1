-- CreateTable
CREATE TABLE "budget_plan_opex" (
    "id" TEXT NOT NULL,
    "display_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "coa" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "budget_plan_amount" BIGINT NOT NULL,
    "budget_realisasi_amount" BIGINT NOT NULL,
    "budget_remaining_amount" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_plan_opex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_opex" (
    "id" TEXT NOT NULL,
    "budget_plan_opex_id" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "requester" TEXT NOT NULL,
    "pr_number" TEXT,
    "po_type" TEXT,
    "po_number" TEXT,
    "document_gr" TEXT,
    "description" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "amount" BIGINT NOT NULL,
    "submission_date" TIMESTAMP(3),
    "approved_date" TIMESTAMP(3),
    "delivery_date" TIMESTAMP(3),
    "o_c" TEXT,
    "cc_lob" TEXT,
    "coa" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_opex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_plan_capex" (
    "id" TEXT NOT NULL,
    "display_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "item_code" TEXT NOT NULL,
    "item_description" TEXT NOT NULL,
    "item_remark" TEXT,
    "budget_plan_amount" BIGINT NOT NULL,
    "budget_realisasi_amount" BIGINT NOT NULL,
    "budget_remaining_amount" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_plan_capex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_capex" (
    "id" TEXT NOT NULL,
    "budget_plan_capex_id" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "requester" TEXT NOT NULL,
    "no_capex" TEXT,
    "project_code" TEXT,
    "no_ui" TEXT,
    "pr_number" TEXT,
    "po_type" TEXT,
    "po_number" TEXT,
    "document_gr" TEXT,
    "description" TEXT NOT NULL,
    "asset_number" TEXT,
    "qty" INTEGER NOT NULL,
    "amount" BIGINT NOT NULL,
    "submission_date" TIMESTAMP(3),
    "approved_date" TIMESTAMP(3),
    "delivery_date" TIMESTAMP(3),
    "o_c" TEXT,
    "cc_lob" TEXT,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_capex_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "budget_plan_opex_display_id_key" ON "budget_plan_opex"("display_id");

-- CreateIndex
CREATE UNIQUE INDEX "budget_plan_capex_display_id_key" ON "budget_plan_capex"("display_id");

-- AddForeignKey
ALTER TABLE "transaction_opex" ADD CONSTRAINT "transaction_opex_budget_plan_opex_id_fkey" FOREIGN KEY ("budget_plan_opex_id") REFERENCES "budget_plan_opex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_capex" ADD CONSTRAINT "transaction_capex_budget_plan_capex_id_fkey" FOREIGN KEY ("budget_plan_capex_id") REFERENCES "budget_plan_capex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
