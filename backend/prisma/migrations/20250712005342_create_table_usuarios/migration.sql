-- CreateEnum
CREATE TYPE "User" AS ENUM ('ADMIN', 'GERENTE', 'FAMILIA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "tipo" "User" NOT NULL,
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
    "observacoes" TEXT NOT NULL,
    "data_adesao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "on_boarding" BOOLEAN NOT NULL,

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
    "observacoes" TEXT NOT NULL,
    "data_adesao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "on_boarding" BOOLEAN NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Familia" ADD CONSTRAINT "Familia_id_fkey" FOREIGN KEY ("id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gerente" ADD CONSTRAINT "Gerente_id_fkey" FOREIGN KEY ("id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_id_fkey" FOREIGN KEY ("id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
