import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  Users,
  Sprout,
  BarChart3,
  Clock,
  AlertTriangle,
  CalendarDays,
  Megaphone,
  UserPlus,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";

// Importando suas stores separadas
import { useHortaStore } from "@/stores/useHortaStore";
import { usePlantioStore } from "@/stores/usePlantioStore";
import { useColheitaStore } from "@/stores/useColheitaStore";
import { useFamiliaStore } from "@/stores/useFamiliaStore";
import { useUserStore } from "@/stores/useUserStore";

const formatDate = (dateISO) => {
  if (!dateISO) return "N/A";
  const date = new Date(dateISO);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const DashboardGestor = () => {
  const {user} = useUserStore();
  const { hortas, fetchHortas } = useHortaStore();
  const { plantios, fetchPlantios } = usePlantioStore();
  const { colheitas, fetchColheitas } = useColheitaStore();
  const { familias, fetchFamilias } = useFamiliaStore();

  useEffect(() => {
    fetchHortas();
    fetchPlantios();
    fetchColheitas();
    fetchFamilias();
  }, []);


  const gestorStats = useMemo(() => {
    const hortasDoGestor = hortas.filter((h) => h.gestor.id === user?.id);
    const hortaIds = hortasDoGestor.map((h) => h._id || h.id);

    const plantiosAtivos = plantios.filter(
      (p) => hortaIds.includes(p.horta.id) && !p.dataColheita
    );

    const trintaDiasAtras = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const colheitasRecentes = colheitas.filter(
      (c) =>
        c.horta.id &&
        hortaIds.includes(c.horta.id)
    );

    const hoje = new Date();

    const plantiosAtrasados = plantiosAtivos
      .filter((p) => p.previsaoColheita && new Date(p.previsaoColheita) < hoje)
      .map((p) => {
        const horta = hortas.find(
          (h) => h._id === p.hortaId || h.id === p.hortaId
        );
        return {
          nome: `${p.cultura || "Plantio"} - ${horta?.nome || "Horta"}`,
          diasAtraso: Math.ceil(
            (hoje - new Date(p.previsaoColheita)) / (1000 * 60 * 60 * 24)
          ),
        };
      })
      .slice(0, 5);

    const proximasColheitas = plantiosAtivos
      .filter((p) => p.previsaoColheita && new Date(p.previsaoColheita) > hoje)
      .map((p) => {
        const horta = hortas.find(
          (h) => h._id === p.hortaId || h.id === p.hortaId
        );
        return {
          nome: `${p.cultura || "Plantio"} - ${horta?.nome || "Horta"}`,
          data: formatDate(p.previsaoColheita),
        };
      })
      .slice(0, 5);

    const ultimasColheitas = colheitasRecentes
      .sort((a, b) => new Date(b.dataColheita) - new Date(a.dataColheita))
      .slice(0, 5)
      .map((c) => ({
        nome: c.cultura || "Colheita",
        quantidade: `${c.quantidadeColhida || 0}${c.unidadeMedida || "kg"}`,
        data: formatDate(c.dataColheita),
      }));

    return {
      nomeGestor: user?.nome || "Gestor",
      hortasGestor: hortasDoGestor.length,
      familiasGestor: familias.length,
      plantiosAtivos: plantiosAtivos.length,
      colheitasRecentes: colheitasRecentes.length,
      notificacoesPendentes: 5,
      plantiosAtrasados,
      proximasColheitas,
      ultimasColheitasLista: ultimasColheitas,
      proximosAvisos: [
        { titulo: "Mutirão de limpeza", data: "07/12/2025" },
        { titulo: "Reunião com famílias", data: "12/12/2025" },
      ],
    };
  }, [user, hortas, plantios, colheitas, familias]);

  const { plantiosAtrasados, proximasColheitas, ultimasColheitasLista } =
    gestorStats;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">
        Olá, {gestorStats.nomeGestor}! 👋
      </h1>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
        <StatCard
          title="Hortas sob gestão"
          value={gestorStats.hortasGestor}
          description="Você é responsável por essas hortas"
          icon={<Leaf className="h-6 w-6 text-primary" />}
        />

        <StatCard
          title="Famílias sob gestão"
          value={gestorStats.familiasGestor}
          description="Participando das suas hortas"
          icon={<Users className="h-6 w-6 text-primary" />}
        />

        <StatCard
          title="Plantios ativos"
          value={gestorStats.plantiosAtivos}
          description="Em andamento nas suas hortas"
          icon={<Sprout className="h-6 w-6 text-primary" />}
        />

        <StatCard
          title="Colheitas recentes"
          value={gestorStats.colheitasRecentes}
          description="Registradas nos últimos 30 dias"
          icon={<BarChart3 className="h-6 w-6 text-primary" />}
        />

        <StatCard
          title="Notificações pendentes"
          value={gestorStats.notificacoesPendentes}
          description="Aguardando sua revisão"
          icon={<AlertTriangle className="h-6 w-6 text-warning" />}
        />
      </div>

      {/* Alertas */}
      <div className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold">Alertas de Atenção 🚨</h2>

        {plantiosAtrasados.length > 0 ? (
          <div className="alert alert-warning shadow-sm">
            <Clock className="h-6 w-6 shrink-0" />
            <div>
              <h3 className="font-bold">Plantios atrasados</h3>
              <p className="text-sm opacity-90">
                Existem {plantiosAtrasados.length} plantios atrasados.
              </p>

              <ul className="text-xs mt-1 ml-3 list-disc">
                {plantiosAtrasados.map((p, i) => (
                  <li key={i}>
                    {p.nome} —{" "}
                    <span className="text-warning font-medium">
                      {p.diasAtraso} dias de atraso
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link to="/plantios" className="btn btn-sm btn-warning">
              Revisar
            </Link>
          </div>
        ) : (
          <div className="alert alert-success shadow-sm">
            <CheckCircle2 className="h-6 w-6 shrink-0" />
            <div>
              <h3 className="font-bold">Status do Plantio</h3>
              <p className="text-sm">
                Nenhum plantio está atrasado. Ótimo trabalho!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Cards de informações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Próximas Colheitas */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-lg">
              <CalendarDays className="h-5 w-5 mr-1" /> Próximas Colheitas
            </h2>

            <ul className="mt-3 space-y-2">
              {proximasColheitas.length > 0 ? (
                proximasColheitas.map((c, i) => (
                  <li
                    key={i}
                    className="flex justify-between p-2 bg-base-200/60 rounded-md"
                  >
                    <span className="truncate">{c.nome}</span>
                    <span className="text-sm text-base-content/70 font-medium">
                      {c.data}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-base-content/60">
                  Nenhuma colheita prevista.
                </li>
              )}
            </ul>

            <div className="card-actions justify-end mt-4">
              <Link to="/plantios" className="btn btn-sm btn-ghost">
                Ver todos
              </Link>
            </div>
          </div>
        </div>

        {/* Próximos Avisos */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-lg">
              <Megaphone className="h-5 w-5 mr-1" /> Próximos Avisos
            </h2>

            <ul className="mt-3 space-y-2">
              {gestorStats.proximosAvisos.map((a, i) => (
                <li
                  key={i}
                  className="flex justify-between p-2 bg-base-200/60 rounded-md"
                >
                  <span className="truncate">{a.titulo}</span>
                  <span className="text-sm text-base-content/70 font-medium">
                    {a.data}
                  </span>
                </li>
              ))}
            </ul>

            <div className="card-actions justify-end mt-4">
              <Link to="/avisos" className="btn btn-sm btn-ghost">
                Gerenciar Avisos
              </Link>
            </div>
          </div>
        </div>

        {/* Últimas Colheitas */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-lg">
              <CheckCircle2 className="h-5 w-5 mr-1" /> Últimas Colheitas
            </h2>

            <ul className="mt-3 space-y-2">
              {ultimasColheitasLista.length > 0 ? (
                ultimasColheitasLista.map((c, i) => (
                  <li
                    key={i}
                    className="flex justify-between p-2 bg-base-200/60 rounded-md"
                  >
                    <span className="truncate">{c.nome}</span>
                    <span className="text-sm text-base-content/70 font-medium">
                      {c.quantidade} em {c.data}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-base-content/60">
                  Nenhuma colheita recente.
                </li>
              )}
            </ul>

            <div className="card-actions justify-end mt-4">
              <Link to="/colheitas" className="btn btn-sm btn-ghost">
                Ver Registros
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Painel de Gestão Rápida */}
      <div className="card bg-base-100 border border-base-300 shadow-sm mb-12">
        <div className="card-body">
          <h2 className="card-title">Painel de Gestão Rápida</h2>
          <p className="text-sm text-base-content/70 mb-4">
            Acesso rápido às principais ferramentas de gestão.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/usuarios"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Gerenciar Usuários
            </Link>

            <Link
              to="/hortas"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Leaf className="h-5 w-5" />
              Gerenciar Hortas
            </Link>

            <Link
              to="/avisos"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Megaphone className="h-5 w-5" />
              Criar Aviso
            </Link>

            <Link
              to="/colheitas"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <ClipboardList className="h-5 w-5" />
              Registrar Colheita
            </Link>

            <Link
              to="/plantios"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Sprout className="h-5 w-5" />
              Gerenciar Plantios
            </Link>

            <Link
              to="/familias"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Users className="h-5 w-5" />
              Gerenciar Famílias
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGestor;
