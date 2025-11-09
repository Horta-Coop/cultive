import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ChartColumn,
  Leaf,
  Sprout,
  BarChart3,
  Wrench,
  Activity,
  Database,
  FileText,
  Megaphone,
  Bell,
  UserCircle,
  CalendarDays,
  Info,
} from "lucide-react";
import StatCard from "../../components/ui/StatCard";

const DashboardAdmin = () => {

  const rankingHortas = [
    { nome: "Horta Central", produtividade: 92 },
    { nome: "Horta Esperança", produtividade: 86 },
    { nome: "Horta Primavera", produtividade: 81 },
  ];

  const logsSistema = [
    {
      id: 1,
      user: "Maria Souza (Gestor)",
      action: "Cadastrou nova horta: Horta da Vila",
      timeAgo: "Há 2h",
    },
    {
      id: 2,
      user: "Sistema",
      action: "Relatório mensal de produtividade gerado",
      timeAgo: "Ontem às 16:30",
    },
    {
      id: 3,
      user: "João Silva (Família)",
      action: "Registrou colheita de 4kg de alface",
      timeAgo: "Há 3 dias",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Sugestão do Sistema */}
      <div className="alert alert-info shadow-sm mb-8">
        <BarChart3 className="h-6 w-6" />
        <div>
          <h3 className="font-bold">Sugestão do Sistema</h3>
          <p className="text-sm opacity-90">
            Verifique os relatórios de desempenho das hortas e aprove novos
            gestores cadastrados.
          </p>
        </div>
      </div>

      {/* Estatísticas Administrativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Usuários Ativos"
          value={125}
          description="Total de usuários na plataforma"
          icon={<Users />}
        />
        <StatCard
          title="Hortas Cadastradas"
          value={15}
          description="Hortas registradas até o momento"
          icon={<Leaf />}
        />
        <StatCard
          title="Famílias Ativas"
          value={42}
          description="Participando de hortas comunitárias"
          icon={<Sprout />}
        />
        <StatCard
          title="Plantios Ativos"
          value={67}
          description="Distribuídos entre as hortas"
          icon={<ChartColumn />}
        />
        <StatCard
          title="Colheitas do Mês"
          value={128}
          description="Total de registros recentes"
          icon={<BarChart3 />}
        />
        <StatCard
          title="Logs Registrados"
          value={340}
          description="Eventos registrados no sistema"
          icon={<Database />}
        />
      </div>

      {/* Ranking de Hortas */}
      <div className="card bg-base-100 border border-base-300 shadow-sm mb-8">
        <div className="card-body">
          <h2 className="card-title">Ranking de Hortas Mais Produtivas</h2>
          <div className="mt-4 space-y-3">
            {rankingHortas.map((horta, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-base-200/60 hover:bg-base-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary">{index + 1}º</span>
                  <span className="font-medium">{horta.nome}</span>
                </div>
                <div className="text-sm text-base-content/70">
                  Produtividade:{" "}
                  <span className="text-primary font-semibold">
                    {horta.produtividade}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ferramentas Administrativas */}
      <div className="card bg-base-100 border border-base-300 shadow-sm mb-8">
        <div className="card-body">
          <h2 className="card-title mb-4">Ferramentas Administrativas</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/usuarios"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Users className="h-5 w-5" /> Gerenciar Usuários
            </Link>
            <Link
              to="/hortas"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Leaf className="h-5 w-5" /> Gerenciar Hortas
            </Link>
            <Link
              to="/familias"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Sprout className="h-5 w-5" /> Gerenciar Famílias
            </Link>
            <Link
              to="/logs"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Activity className="h-5 w-5" /> Acessar Logs
            </Link>
            <Link
              to="/avisos"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <Megaphone className="h-5 w-5" /> Criar Avisos Globais
            </Link>
            <Link
              to="/faq"
              className="btn btn-outline btn-primary justify-start gap-2"
            >
              <FileText className="h-5 w-5" /> Gerenciar FAQs
            </Link>
          </div>
        </div>
      </div>

      {/* Logs do Sistema */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Logs do Sistema</h2>
            <Link to="/logs" className="text-sm text-primary hover:underline">
              Ver todos
            </Link>
          </div>

          <div className="space-y-4">
            {logsSistema.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{log.user}</p>
                  <p className="text-sm text-base-content/70">{log.action}</p>
                  <p className="text-xs text-base-content/50 mt-1">
                    {log.timeAgo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
