import React, { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { Loader, Lock, LogIn, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, loading} = useUserStore()

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);

  };


  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <main className="flex-1 flex items-center justify-center py-12 bg-base-200">
        <div className="card bg-base-100 border border-base-300 shadow-lg w-full max-w-md mx-4">
          {/* Cabeçalho */}
          <div className="card-body p-6 space-y-1 text-center">
            <h2 className="text-2xl font-bold">Criar conta</h2>
            <p className="text-base-content/70 text-sm">
              Comece sua jornada na HortaComm
            </p>
          </div>

          {/* Conteúdo do formulário */}
          <div className="card-body p-6 pt-0 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Nome */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-500 z-1" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    className="input input-bordered w-full pl-10"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Campo Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome de usuário</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-500 z-1" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    className="input input-bordered w-full pl-10"
                    placeholder="Seu nome de usuário"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Campo Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-500 z-1" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="Seu email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-500 z-1" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    className="input input-bordered w-full pl-10"
                    placeholder="Crie uma senha"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Campo Confirmar Senha */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmar senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-500 z-1" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="input input-bordered w-full pl-10"
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Termos e condições */}
              <div className="flex items-center space-x-2">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="checkbox checkbox-sm checkbox-primary"
                />
                <label htmlFor="terms" className="text-sm text-base-content/70">
                  Concordo com os{" "}
                  <a href="/termos" className="text-primary hover:underline">
                    Termos de Serviço
                  </a>{" "}
                  e{" "}
                  <a
                    href="/privacidade"
                    className="text-primary hover:underline"
                  >
                    Política de Privacidade
                  </a>
                </label>
              </div>

              {/* Botão de cadastro */}
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? (<>
                <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true"/>
                Carregando...
                </>): (<>
                <LogIn className="h-4 w-4 mr-2" />
                Criar conta
                </>)}
              </button>
            </form>

            {/* Link para login */}
            <div className="text-center mt-6">
              <p className="text-sm text-base-content/70">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
