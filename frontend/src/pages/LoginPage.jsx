import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  LogIn, 
  Github,
  User 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de login aqui
    console.log('Login attempt:', { username, password, rememberMe });
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      
      <main className="flex-1 flex items-center justify-center py-12 bg-base-200">
        <div className="card bg-base-100 border border-base-300 shadow-lg w-full max-w-md mx-4">
          {/* Cabeçalho */}
          <div className="card-body p-6 space-y-1 text-center">
            <h2 className="text-2xl font-bold">Entrar</h2>
            <p className="text-base-content/70 text-sm">Volte a cultivar com sua comunidade</p>
          </div>

          {/* Conteúdo do formulário */}
          <div className="card-body p-6 pt-0 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo de usuário */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome de usuário</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-1" />
                  <input 
                    type="text" 
                    className="input input-bordered w-full pl-10" 
                    placeholder="Seu nome de usuário" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Campo de senha */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Senha</label>
                  <a href="/recuperar" className="text-sm text-primary hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-1" />
                  </div>
                  <input 
                    type="password" 
                    className="input input-bordered w-full pl-10" 
                    placeholder="Sua senha" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Lembrar de mim */}
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="rememberMe"
                  className="checkbox checkbox-sm checkbox-primary" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe" className="text-sm">
                  Lembrar de mim
                </label>
              </div>

              {/* Botão de login */}
              <button type="submit" className="btn btn-primary w-full">
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </button>
            </form>
          </div>

          {/* Rodapé */}
          <div className="card-body p-6 pt-0 flex flex-col space-y-4 items-center">
            <div className="text-center text-sm text-base-content/70">
              Não tem uma conta?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Cadastre-se
              </Link>
            </div>
            <div className="text-center text-xs text-base-content/60">
              Ao fazer login, você concorda com nossos{' '}
              <a href="/termos" className="hover:underline">Termos de Serviço</a> e{' '}
              <a href="/privacidade" className="hover:underline">Política de Privacidade</a>.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;