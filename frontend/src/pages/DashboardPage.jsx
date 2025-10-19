import React from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Package, 
  Users, 
  MessageSquare, 
  Bell, 
  ArrowRight,
  Plus,
  Sprout,
  PieChart,
  Settings,
  LogOut
} from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const DashboardPage = () => {
  const { user } = useUserStore();
  // Dados mockados para demonstração
  const recentActivities = [
    {
      id: 1,
      title: "Preparar o canteiro 4 para plantio de cenouras",
      user: "Maria Silva",
      timeAgo: "Há 1 hora"
    },
    {
      id: 2,
      title: "5kg de alface colhidos no canteiro 1",
      user: "João Oliveira", 
      timeAgo: "Ontem às 16:30"
    },
    {
      id: 3,
      title: "Regar os canteiros 2 e 3",
      user: "Ana Souza",
      timeAgo: "Há 2 dias"
    }
  ];

  const gardenStats = {
    activeBeds: "8 de 10",
    growingCrops: "12",
    nextHarvest: "Alface (3 dias)"
  };

  return (
    <div className="min-h-screen bg-base-100 flex">
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-base-100 border-b border-base-300 p-4">
          <div className="flex items-center justify-between">  
            <div className="flex-1 md:flex-none">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
 
            <div className="flex items-center space-x-4">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                  <div className="indicator">
                    <Bell className="h-5 w-5" />
                    <span className="badge badge-xs badge-primary indicator-item"></span>
                  </div>
                </div>
                <div tabIndex={0} className="dropdown-content card card-compact w-72 bg-base-100 shadow mt-3">
                  <div className="card-body">
                    <span className="font-bold text-lg">Notificações</span>
                    <span className="text-info">Você tem 3 notificações</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
 
        {/* Conteúdo */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Saudação */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Bem-vindo(a), {user?.nome || "Usuário"}!
              </h1>
              <p className="text-base-content/70">
                Aqui está o resumo da sua horta comunitária
              </p>
            </div>
 
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
                  É um bom momento para plantar alface e rúcula, considerando o clima atual e seu calendário agrícola.
                </div>
              </div>
            </div>
 
            {/* Cards do Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Card Minha Horta */}
              <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title text-lg">Minha Horta</h2>
                    <span className="badge badge-success">Ativa</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/70">Canteiros ativos:</span>
                      <span className="font-medium">{gardenStats.activeBeds}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/70">Cultivos em crescimento:</span>
                      <span className="font-medium">{gardenStats.growingCrops}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/70">Próxima colheita:</span>
                      <span className="font-medium">{gardenStats.nextHarvest}</span>
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <Link to="/horta" className="btn btn-ghost btn-sm gap-2">
                      Ver detalhes
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card Calendário */}
              <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title text-lg">Calendário Agrícola</h2>
                    <span className="badge badge-info">Junho</span>
                  </div>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                        !
                      </div>
                      <div>
                        <p className="text-sm font-medium">Mutirão de plantio</p>
                        <p className="text-xs text-base-content/70">Hoje, 09:00 - 12:00</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center text-base-content/70 text-xs font-bold">
                        2
                      </div>
                      <div>
                        <p className="text-sm font-medium">Colheita de tomates</p>
                        <p className="text-xs text-base-content/70">15 de Junho, 16:00 - 18:00</p>
                      </div>
                    </li>
                  </ul>

                  <div className="card-actions justify-end mt-4">
                    <Link to="/planejamento" className="btn btn-ghost btn-sm gap-2">
                      Ver calendário
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card Distribuição */}
              <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title text-lg">Distribuição</h2>
                    <span className="badge badge-warning">Pendente</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/70">Última colheita:</span>
                      <span className="font-medium">12/06/2023</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/70">Alimentos disponíveis:</span>
                      <span className="font-medium">15kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/70">Famílias atendidas:</span>
                      <span className="font-medium">8 de 12</span>
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <Link to="/distribuicao" className="btn btn-ghost btn-sm gap-2">
                      Gerenciar
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Visão Geral da Horta */}
            <div className="card bg-base-100 border border-base-300 shadow-sm mb-8">
              <div className="card-body">
                <h2 className="card-title mb-4">Visão Geral da Horta</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border border-primary/30 bg-primary/5 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-base-content/70">Canteiro 1</p>
                    <p className="font-medium text-primary">Alface</p>
                    <div className="mt-2">
                      <div className="h-2 bg-base-300 rounded-full">
                        <div className="h-2 bg-primary rounded-full" style={{ width: "75%" }}></div>
                      </div>
                      <p className="text-xs text-base-content/70 mt-1">75% crescimento</p>
                    </div>
                  </div>
                  
                  <div className="border border-primary/30 bg-primary/5 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-base-content/70">Canteiro 2</p>
                    <p className="font-medium text-primary">Cenoura</p>
                    <div className="mt-2">
                      <div className="h-2 bg-base-300 rounded-full">
                        <div className="h-2 bg-primary rounded-full" style={{ width: "45%" }}></div>
                      </div>
                      <p className="text-xs text-base-content/70 mt-1">45% crescimento</p>
                    </div>
                  </div>
                  
                  <div className="border border-primary/30 bg-primary/5 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-base-content/70">Canteiro 3</p>
                    <p className="font-medium text-primary">Tomate</p>
                    <div className="mt-2">
                      <div className="h-2 bg-base-300 rounded-full">
                        <div className="h-2 bg-primary rounded-full" style={{ width: "60%" }}></div>
                      </div>
                      <p className="text-xs text-base-content/70 mt-1">60% crescimento</p>
                    </div>
                  </div>
                  
                  <Link to="/horta" className="border border-base-300 bg-base-200 rounded-lg p-4 text-center flex items-center justify-center hover:bg-base-300 transition-colors">
                    <div>
                      <Plus className="h-6 w-6 text-base-content/70 mx-auto" />
                      <p className="text-sm text-base-content/70 mt-1">Adicionar canteiro</p>
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
                  <Link to="/atividades" className="text-sm text-primary hover:underline">
                    Ver todas
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sprout className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.user}</p>
                        <p className="text-sm text-base-content/70">{activity.title}</p>
                        <p className="text-xs text-base-content/50 mt-1">{activity.timeAgo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
 
export default DashboardPage;