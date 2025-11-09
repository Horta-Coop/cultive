import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Sprout, ClipboardList, UserCog } from "lucide-react";

const FamiliaDetalhesPage = () => {
  const { id } = useParams();
  const [familia, setFamilia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔧 Substitua pela chamada real do backend (ex: fetch(`/api/familias/${id}`))
    async function fetchFamilia() {
      try {
        // Simulação temporária:
        const data = {
          id,
          nome: "Família Silva",
          representante: "João Silva",
          descricao: "Família dedicada ao cultivo de hortaliças orgânicas.",
          qtdMembros: 4,
          gestor: { nome: "Maria Oliveira", role: "gestor" },
          membros: [
            { id: 1, nome: "João Silva", role: "cultivador" },
            { id: 2, nome: "Ana Silva", role: "voluntario" },
          ],
          hortas: [
            { id: 1, nome: "Horta Central", tipoHorta: "comunitaria" },
            { id: 2, nome: "Horta Norte", tipoHorta: "escolar" },
          ],
          plantios: [
            { id: 1, cultura: "Alface", tipoPlantacao: "orgânico" },
            { id: 2, cultura: "Tomate", tipoPlantacao: "convencional" },
          ],
        };

        setFamilia(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchFamilia();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!familia) {
    return (
      <div className="text-center mt-20 text-base-content/70">
        Família não encontrada.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      {/* Voltar */}
      <div className="mb-4">
        <Link to="/familias" className="btn btn-ghost btn-sm gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>

      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-1">
          {familia.nome}
        </h1>
        <p className="text-base-content/60">{familia.descricao}</p>
      </div>

      {/* Gestor */}
      <div className="card bg-base-100 border border-base-200 shadow-sm mb-6">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2 text-primary">
            <UserCog className="h-5 w-5" />
            Gestor Responsável
          </h2>
          <p className="mt-2">
            <span className="font-semibold">{familia.gestor?.nome}</span> —{" "}
            <span className="text-base-content/70">{familia.gestor?.role}</span>
          </p>
        </div>
      </div>

      {/* Informações principais */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Membros */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2 text-secondary">
              <Users className="h-5 w-5" />
              Membros da Família ({familia.qtdMembros})
            </h2>
            <ul className="mt-2 space-y-1 text-sm">
              {familia.membros.map((m) => (
                <li key={m.id} className="flex justify-between">
                  <span>{m.nome}</span>
                  <span className="text-base-content/60 capitalize">
                    {m.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hortas */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2 text-success">
              <Sprout className="h-5 w-5" />
              Hortas Associadas
            </h2>
            <ul className="mt-2 space-y-1 text-sm">
              {familia.hortas.map((h) => (
                <li key={h.id} className="flex justify-between">
                  <span>{h.nome}</span>
                  <span className="text-base-content/60">{h.tipoHorta}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Plantios */}
        <div className="md:col-span-2 card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2 text-warning">
              <ClipboardList className="h-5 w-5" />
              Plantios Ativos
            </h2>
            {familia.plantios.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {familia.plantios.map((p) => (
                  <span key={p.id} className="badge badge-outline">
                    {p.cultura} — {p.tipoPlantacao}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-base-content/60 mt-2 text-sm">
                Nenhum plantio ativo registrado.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamiliaDetalhesPage;
