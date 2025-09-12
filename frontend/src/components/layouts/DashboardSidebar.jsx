import React from 'react';
import { 
  Home, 
  Globe, 
  Sprout, 
  PieChart, 
  Calendar, 
  Package, 
  MessageSquare, 
  Users, 
  Settings, 
  Bell, 
  HelpCircle,
  ChevronLeft
} from 'lucide-react';

const DashboardSidebar = ({ user, isOpen, onToggle }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:flex`}>
      <div className="flex flex-col bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800 h-full relative transition-all duration-300 ease-in-out w-64">
        {/* Cabeçalho */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z M12 4.4L18 8v8l-6 3.6L6 16V8l6-3.6z"></path>
              <path d="M12 7L9 9v4极速加速器 2 3-2V9l-3-2z"></path>
            </svg>
            <span className="ml-2 text-xl font-semibold text-secondary dark:text-white">Dashboard</span>
          </div>
          <button 
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={onToggle}
          >
            <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Navegação */}
        <div className="py-4 flex-grow overflow-y-auto">
          <nav className="px-2 space-y-1">
            {/* Dashboard */}
            <a href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors bg-primary/10 text-primary dark:bg-primary/20">
              <div className="mr-3 text-lg">
                <Home className="h-5 w-5" />
              </div>
              <span>Dashboard</span>
            </a>

            {/* Hortas */}
            <a href="/hortas" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
              <div className="mr-3 text-lg">
                <Globe className="h-5 w-5" />
              </div>
              <span>Hortas</span>
            </a>

            {/* Plantios */}
            <a href="/plantios" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
              <div className="mr-3 text-lg">
                <Sprout className="h-5 w-5" />
              </div>
              <span>Plantios</span>
            </a>

            {/* Diversificação */}
            <a href="/diversificacao" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
              <div className="mr-3 text-lg">
                <PieChart className="h-5 w-5" />
              </div>
              <span>Diversificação</span>
            </a>

            {/* Planejamento */}
            <a href="/planning" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-极速加速器 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
              <div className="mr-3 text-lg">
                <Calendar className="h-5 w-5" />
              </div>
              <span>Planejamento</span>
            </a>

            {/* Distribuição */}
            <a href="/distribution" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
              <div className="mr-3 text-lg">
                <Package className="h-5 w-5" />
              </div>
              <span>Distribuição</span>
            </a>

            {/* Comunicação */}
            <a href="/communication" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
              <div className="mr-3 text-lg">
                <MessageSquare className="h-5 w-5" />
              </div>
              <span>Comunicação</span>
            </a>

            {/* Famílias */}
            <a href="/families" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
              <div className="mr-3 text-lg">
                <Users className="h-5 w-5" />
              </div>
              <span>Famílias</span>
            </a>

            {/* Configurações */}
            <a href="/configuracoes" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
              <div className="mr-3 text-lg">
                <Settings className="h-5 w-5" />
              </div>
              <span>Configurações</span>
            </a>

            {/* Notificações */}
            <a href="/notificacoes" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
              <div className="mr-3 text-lg">
                <Bell className="h-5 w-5" />
              </div>
              <span>Notificações</span>
            </a>

            {/* Ajuda */}
            <a href="/ajuda" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
              <div className="mr-3 text-lg">
                <HelpCircle className="h-5 w-5" />
              </div>
              <span>Ajuda</span>
            </a>
          </nav>
        </div>

        {/* Perfil do usuário */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <a href="/profile" className="flex items-center space-x-3">
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"} 
              alt="Foto de perfil" 
              className="h-8 w-8 rounded-full" 
            />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {user?.role || 'Membro'}
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;