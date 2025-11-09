import React from "react";
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
import StatCard from "../../components/ui/StatCard";

const DashboardGestor = () => {
  const gestor = {
    nome: "Kainã Magdiel",
    hortasGestor: 3,
    familiasGestor: 12,
    plantiosAtivos: 24,
    colheitasRecentes: 8,
    notificacoesPendentes: 5,
  };

  const plantiosAtrasados = [
    { nome: "Alface - Horta Central", diasAtraso: 4 },
    { nome: "Cenoura - Horta Vila Verde", diasAtraso: 2 },
  ];

  const familiasPoucoAtivas = [
    { nome: "Família Souza", participacoes: 1 },
    { nome: "Família Lima", participacoes: 2 },
  ];

  const voluntariosPoucoAtivos = [
    { nome: "Lucas", diasDisponiveis: 1 },
    { nome: "Marina", diasDisponiveis: 2 },
  ];

  const proximasColheitas = [
    { nome: "Tomate - Horta Central", data: "08/11/2025" },
    { nome: "Couve - Horta Esperança", data: "10/11/2025" },
  ];

  const proximosAvisos = [
    { titulo: "Mutirão de limpeza", data: "07/11/2025" },
    { titulo: "Reunião com famílias", data: "12/11/2025" },
  ];

  const colheitasRecentes = [
    { nome: "Rúcula", quantidade: "3kg", data: "04/11/2025" },
    { nome: "Cenoura", quantidade: "5kg", data: "03/11/2025" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* ================= INDICADORES GERAIS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Hortas sob gestão"
          value={gestor.hortasGestor}
          description="Você é responsável por essas hortas"
          icon={<Leaf />}
        />
        <StatCard
          title="Famílias sob gestão"
          value={gestor.familiasGestor}
          description="Participando das suas hortas"
          icon={<Users />}
        />
        <StatCard
          title="Plantios ativos"
          value={gestor.plantiosAtivos}
          description="Em andamento nas hortas sob sua gestão"
          icon={<Sprout />}
        />
        <StatCard
          title="Colheitas recentes"
          value={gestor.colheitasRecentes}
          description="Registradas recentemente"
          icon={<BarChart3 />}
        />
        <StatCard
          title="Notificações pendentes"
          value={gestor.notificacoesPendentes}
          description="Aguardando revisão"
          icon={<AlertTriangle />}
        />
      </div>

      {/* ================= ALERTAS INTELIGENTES ================= */}
      <div className="space-y-4 mb-10">
        {plantiosAtrasados.length > 0 && (
          <div className="alert alert-warning shadow-sm">
            <Clock className="h-6 w-6" />
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
          </div>
        )}

        {familiasPoucoAtivas.length > 0 && (
          <div className="alert alert-info shadow-sm">
            <Users className="h-6 w-6" />
            <div>
              <h3 className="font-bold">Famílias com baixa participação</h3>
              <ul className="text-xs mt-1 ml-3 list-disc">
                {familiasPoucoAtivas.map((f, i) => (
                  <li key={i}>
                    {f.nome} — {f.participacoes} participação(ões)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {voluntariosPoucoAtivos.length > 0 && (
          <div className="alert alert-error shadow-sm">
            <AlertTriangle className="h-6 w-6" />
            <div>
              <h3 className="font-bold">Voluntários pouco disponíveis</h3>
              <ul className="text-xs mt-1 ml-3 list-disc">
                {voluntariosPoucoAtivos.map((v, i) => (
                  <li key={i}>
                    {v.nome} — {v.diasDisponiveis} dia(s) disponíveis
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ================= LISTAS ÚTEIS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Próximas colheitas */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">
              <CalendarDays className="h-5 w-5 mr-1" /> Próximas Colheitas
            </h2>
            <ul className="mt-3 space-y-2">
              {proximasColheitas.map((c, i) => (
                <li
                  key={i}
                  className="flex justify-between p-2 bg-base-200/60 rounded-md"
                >
                  <span>{c.nome}</span>
                  <span className="text-sm text-base-content/70">{c.data}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Próximos avisos */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">
              <Megaphone className="h-5 w-5 mr-1" /> Próximos Avisos
            </h2>
            <ul className="mt-3 space-y-2">
              {proximosAvisos.map((a, i) => (
                <li
                  key={i}
                  className="flex justify-between p-2 bg-base-200/60 rounded-md"
                >
                  <span>{a.titulo}</span>
                  <span className="text-sm text-base-content/70">{a.data}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Últimas colheitas */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">
              <CheckCircle2 className="h-5 w-5 mr-1" /> Últimas Colheitas
            </h2>
            <ul className="mt-3 space-y-2">
              {colheitasRecentes.map((c, i) => (
                <li
                  key={i}
                  className="flex justify-between p-2 bg-base-200/60 rounded-md"
                >
                  <span>{c.nome}</span>
                  <span className="text-sm text-base-content/70">
                    {c.quantidade} — {c.data}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ================= PAINEL ADMINISTRATIVO ================= */}
      <div className="card bg-base-100 border border-base-300 shadow-sm mb-8">
        <div className="card-body">
          <h2 className="card-title mb-4">Painel de Gestão Rápida</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/usuarios"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <UserPlus className="h-5 w-5" /> Gerenciar Usuários
            </Link>
            <Link
              to="/hortas"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Leaf className="h-5 w-5" /> Gerenciar Hortas
            </Link>
            <Link
              to="/avisos"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Megaphone className="h-5 w-5" /> Criar Aviso
            </Link>
            <Link
              to="/colheitas"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <ClipboardList className="h-5 w-5" /> Registrar Colheita
            </Link>
            <Link
              to="/plantios"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Sprout className="h-5 w-5" /> Gerenciar Plantios
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGestor;
