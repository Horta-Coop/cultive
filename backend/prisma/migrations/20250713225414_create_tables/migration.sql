-- CreateEnum
CREATE TYPE "EUser" AS ENUM ('ADMIN', 'GERENTE', 'FAMILIA');

-- CreateEnum
CREATE TYPE "EHorta" AS ENUM ('Escolar', 'Comunitaria', 'Institucional', 'ONG');

-- CreateTable
CREATE TABLE "Teste" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "telefone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "tipo" "EUser" NOT NULL,
    "foto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Familia" (
    "id" TEXT NOT NULL,
    "nome_familia" TEXT NOT NULL,
    "representante" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "habilidades" TEXT NOT NULL,
    "qtd_membros" INTEGER NOT NULL,
    "observacoes" TEXT,
    "data_adesao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "on_boarding" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Familia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gerente" (
    "id" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "entidade_responsavel" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "observacoes" TEXT NOT NULL,
    "data_adesao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "on_boarding" BOOLEAN NOT NULL,

    CONSTRAINT "Gerente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "ativo" TEXT NOT NULL,
    "observacoes" TEXT,
    "data_adesao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "on_boarding" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Familia" ADD CONSTRAINT "Familia_id_fkey" FOREIGN KEY ("id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gerente" ADD CONSTRAINT "Gerente_id_fkey" FOREIGN KEY ("id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_id_fkey" FOREIGN KEY ("id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plantio" ADD CONSTRAINT "Plantio_hortaId_fkey" FOREIGN KEY ("hortaId") REFERENCES "Horta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colheita" ADD CONSTRAINT "Colheita_plantioId_fkey" FOREIGN KEY ("plantioId") REFERENCES "Plantio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colheita" ADD CONSTRAINT "Colheita_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "Familia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
