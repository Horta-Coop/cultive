import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ArrowRight,
  Plus,
  Sprout,
  ChartColumn,
  Leaf,
} from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import StatCard from "../components/ui/StatCard";

const DashboardPage = () => {
  const { user } = useUserStore();
  // Dados mockados para demonstração
  const recentActivities = [
    {
      id: 1,
      title: "Preparar o canteiro 4 para plantio de cenouras",
      user: "Maria Silva",
      timeAgo: "Há 1 hora",
    },
    {
      id: 2,
      title: "5kg de alface colhidos no canteiro 1",
      user: "João Oliveira",
      timeAgo: "Ontem às 16:30",
    },
    {
      id: 3,
      title: "Regar os canteiros 2 e 3",
      user: "Ana Souza",
      timeAgo: "Há 2 dias",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
          <p className="text-base-content/60 mt-1">
            <span className="font-bold mb-2">
              Bem-vindo(a), {user?.nome || "Usuário"}!
            </span>{" "}
            Aqui está o resumo da sua horta comunitária
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto">
        {/* Sugestão do Assistente */}
        <div className="alert alert-info mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <div>
            <h3 className="font-bold">Sugestão do Assistente</h3>
            <div className="text-xs">
              É um bom momento para plantar alface e rúcula, considerando o
              clima atual e seu calendário agrícola.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Famílias Ativas"
            value={20}
            description={`${Math.round(
              (20 / 50) * 100
            )}% do total de ${50} famílias`}
            icon={<Users className="h-6 w-6" />}
          />
          <StatCard
            title="Colheitas (kg)"
            value={30}
            description={`${50} itens colhidos no total`}
            icon={<ChartColumn className="h-6 w-6" />}
          />
          <StatCard
            title="Canteiros Ocupados"
            value={80}
            description={`${50} canteiros disponíveis em ${100} hortas`}
            icon={<Leaf className="h-6 w-6" />}
          />
        </div>

        {/* Visão Geral da Horta */}
        <div className="card bg-base-100 border border-base-300 shadow-sm mb-8">
          <div className="card-body">
            <h2 className="card-title mb-4">Visão Geral da Horta</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-primary/30 bg-primary/5 rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-base-content/70">
                  Canteiro 1
                </p>
                <p className="font-medium text-primary">Alface</p>
                <div className="mt-2">
                  <div className="h-2 bg-base-300 rounded-full">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-base-content/70 mt-1">
                    75% crescimento
                  </p>
                </div>
              </div>

              <div className="border border-primary/30 bg-primary/5 rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-base-content/70">
                  Canteiro 2
                </p>
                <p className="font-medium text-primary">Cenoura</p>
                <div className="mt-2">
                  <div className="h-2 bg-base-300 rounded-full">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-base-content/70 mt-1">
                    45% crescimento
                  </p>
                </div>
              </div>

              <div className="border border-primary/30 bg-primary/5 rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-base-content/70">
                  Canteiro 3
                </p>
                <p className="font-medium text-primary">Tomate</p>
                <div className="mt-2">
                  <div className="h-2 bg-base-300 rounded-full">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-base-content/70 mt-1">
                    60% crescimento
                  </p>
                </div>
              </div>

              <Link
                to="/horta"
                className="border border-base-300 bg-base-200 rounded-lg p-4 text-center flex items-center justify-center hover:bg-base-300 transition-colors"
              >
                <div>
                  <Plus className="h-6 w-6 text-base-content/70 mx-auto" />
                  <p className="text-sm text-base-content/70 mt-1">
                    Adicionar canteiro
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Atividades Recentes</h2>
              <Link
                to="/atividades"
                className="text-sm text-primary hover:underline"
              >
                Ver todas
              </Link>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sprout className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-sm text-base-content/70">
                      {activity.title}
                    </p>
                    <p className="text-xs text-base-content/50 mt-1">
                      {activity.timeAgo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
