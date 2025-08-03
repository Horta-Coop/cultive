
import prisma from "../utils/prisma.js";

async function main() {
  // Usuários
  const usuarios = await Promise.all([
    prisma.usuario.create({
      data: {
        nome: "Maria Gestora",
        username: "mariag",
        email: "maria.g@example.com",
        senhaHash: "hash123",
        role: "gestor",
      },
    }),
    prisma.usuario.create({
      data: {
        nome: "João Voluntário",
        username: "joaov",
        email: "joao.v@example.com",
        senhaHash: "hash123",
        role: "voluntario",
      },
    }),
    prisma.usuario.create({
      data: {
        nome: "Ana Cultivadora",
        username: "anac",
        email: "ana.c@example.com",
        senhaHash: "hash123",
        role: "cultivador",
      },
    }),
    prisma.usuario.create({
      data: {
        nome: "Carlos Admin",
        username: "carlosa",
        email: "carlos.a@example.com",
        senhaHash: "hash123",
        role: "admin",
      },
    }),
  ]);

  // Famílias
  const familia1 = await prisma.familia.create({
    data: {
      nome: "Família Silva",
      representante: "Carlos Silva",
      qtdMembros: 3,
      gestorId: usuarios[0].id, // Maria Gestora
      membros: {
        connect: [ { id: usuarios[1].id }, { id: usuarios[2].id } ], // João e Ana
      },
    },
  });

  const familia2 = await prisma.familia.create({
    data: {
      nome: "Família Oliveira",
      representante: "Fernanda Oliveira",
      qtdMembros: 2,
      gestorId: usuarios[0].id, // mesma gestora
      membros: {
        create: [
          {
            nome: "Pedro Oliveira",
            username: "pedroo",
            email: "pedro.o@example.com",
            senhaHash: "hash123",
            role: "cultivador",
          },
          {
            nome: "Lucia Oliveira",
            username: "luciao",
            email: "lucia.o@example.com",
            senhaHash: "hash123",
            role: "cultivador",
          },
        ],
      },
    },
  });

  // Perfis
  await prisma.perfilGestor.create({
    data: {
      usuarioId: usuarios[0].id,
      cargo: "Gestor Regional",
      organizacaoVinculada: "ONG Verde Vida",
      recebeAlertas: true,
    },
  });

  await prisma.perfilVoluntario.create({
    data: {
      usuarioId: usuarios[1].id,
      interesse: "Irrigação",
      disponivel: true,
    },
  });

  await prisma.perfilCultivador.create({
    data: {
      usuarioId: usuarios[2].id,
      tipoExperiencia: "iniciante",
      habilidades: "Plantio básico, rega",
      plantasFavoritas: "Alface, Tomate",
    },
  });

  await prisma.perfilAdmin.create({
    data: {
      usuarioId: usuarios[3].id,
      cargo: "Administrador do Sistema",
      ativo: true,
    },
  });

  // Hortas
  const horta1 = await prisma.horta.create({
    data: {
      nome: "Horta Comunitária Central",
      endereco: "Rua das Flores, 123",
      cordenada: "-23.55052,-46.633308",
      areaCultivada: 120.5,
      tipoSolo: "Argiloso",
      tipoHorta: "comunitaria",
      familiaId: familia1.id,
      gestorId: usuarios[0].id,
    },
  });

  const horta2 = await prisma.horta.create({
    data: {
      nome: "Horta Escolar ABC",
      endereco: "Rua da Escola, 456",
      cordenada: "-23.55100,-46.630000",
      areaCultivada: 80.0,
      tipoSolo: "Arenoso",
      tipoHorta: "escolar",
      familiaId: familia2.id,
      gestorId: usuarios[0].id,
    },
  });

  // Plantios e colheitas
  const plantio1 = await prisma.plantio.create({
    data: {
      cultura: "Alface",
      tipoPlantacao: "orgânico",
      dataInicio: new Date("2025-07-01"),
      previsaoColheita: new Date("2025-07-20"),
      quantidadePlantada: 50,
      unidadeMedida: "unidades",
      hortaId: horta1.id,
    },
  });

  await prisma.colheita.create({
    data: {
      cultura: "Alface",
      dataColheita: new Date("2025-07-19"),
      quantidadeColhida: 45,
      unidadeMedida: "unidades",
      destinoColheita: "doação",
      plantioId: plantio1.id,
    },
  });

  const plantio2 = await prisma.plantio.create({
    data: {
      cultura: "Tomate",
      tipoPlantacao: "convencional",
      dataInicio: new Date("2025-07-10"),
      previsaoColheita: new Date("2025-08-05"),
      quantidadePlantada: 30,
      unidadeMedida: "unidades",
      hortaId: horta2.id,
    },
  });

  console.log("Seed populada com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });