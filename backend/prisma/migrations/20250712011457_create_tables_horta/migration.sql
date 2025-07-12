/*
  Warnings:

  - Added the required column `updatedAt` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Familia` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tipo` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EUser" AS ENUM ('ADMIN', 'GERENTE', 'FAMILIA');

-- CreateEnum
CREATE TYPE "EHorta" AS ENUM ('Escolar', 'Comunitaria', 'Institucional', 'ONG');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "observacoes" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Familia" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "observacoes" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "EUser" NOT NULL;

-- DropEnum
DROP TYPE "User";

-- CreateTable
CREATE TABLE "Horta" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cordenadas_gps" TEXT NOT NULL,
    "area_cultivada" DECIMAL(65,30) NOT NULL,
    "tipo_solo" TEXT NOT NULL,
    "tipo_horta" "EHorta" NOT NULL,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Horta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plantio" (
    "id" TEXT NOT NULL,
    "cultura" TEXT NOT NULL,
    "tipo_plantacao" TEXT NOT NULL,
    "data_plantio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previsao_colheita" TIMESTAMP(3) NOT NULL,
    "tipo_manejo" TEXT NOT NULL,
    "hortaId" TEXT NOT NULL,
    "quantidade_plantada" DECIMAL(65,30) NOT NULL,
    "unidade" TEXT NOT NULL,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plantio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Colheita" (
    "id" TEXT NOT NULL,
    "cultura" TEXT NOT NULL,
    "plantioId" TEXT NOT NULL,
    "data_colheita" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantidade_colhida" DECIMAL(65,30) NOT NULL,
    "unidade" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "familiaId" TEXT NOT NULL,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Colheita_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Plantio" ADD CONSTRAINT "Plantio_hortaId_fkey" FOREIGN KEY ("hortaId") REFERENCES "Horta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colheita" ADD CONSTRAINT "Colheita_plantioId_fkey" FOREIGN KEY ("plantioId") REFERENCES "Plantio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colheita" ADD CONSTRAINT "Colheita_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "Familia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
