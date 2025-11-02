import React, { useState, useEffect } from "react";
import { Lock, LogIn, User, Loader, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading } = useUserStore();

  // Detecta se a tela é mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Validação em tempo real
  const validateField = (name, value) => {
    switch (name) {
      case "username":
        return value.trim().length < 3
          ? "O usuário deve ter pelo menos 3 caracteres"
          : "";
      case "password":
        return value.length < 3
          ? "A senha deve ter pelo menos 3 caracteres"
          : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação final antes de enviar
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      newErrors[field] = validateField(field, formData[field]);
    });

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) return;

    login(formData.username, formData.password);
  };

  // Define classes de input com base no erro ou sucesso
  const inputClass = (field) => {
    if (errors[field]) return "input-error";
    if (!errors[field] && formData[field]) return "input-success";
    return "";
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <main
        className={`flex-1 flex ${
          isMobile
            ? "items-start justify-center pt-12 pb-6"
            : "items-center justify-center py-12"
        } bg-base-200 transition-all duration-300`}
      >
        <div className="card bg-base-100 border border-base-300 shadow-lg w-full max-w-md mx-4 relative">
          {/* Cabeçalho */}
          <div className="card-body p-6 space-y-1 text-center">
            <h2 className="text-2xl font-bold text-base-content">Entrar</h2>
            <p className="text-base-content/70 text-sm">
              Volte a cultivar com sua comunidade
            </p>
          </div>

          {/* Formulário */}
          <div className="card-body p-6 pt-0 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content">
                  Nome de usuário
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-base-content/60 pointer-events-none z-10" />
                  <input
                    type="text"
                    name="username"
                    className={`input input-bordered w-full pl-12 z-0 ${inputClass(
                      "username"
                    )}`}
                    placeholder="Seu nome de usuário"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-error mt-1">{errors.username}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-base-content">
                    Senha
                  </label>
                  <a
                    href="/recuperar"
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/60 pointer-events-none z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`input input-bordered w-full pl-12 pr-12 z-0 ${inputClass(
                      "password"
                    )}`}
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-base-content/60 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-error mt-1">{errors.password}</p>
                )}
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
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-base-content"
                >
                  Lembrar de mim
                </label>
              </div>

              {/* Botão de login */}
              <button
                type="submit"
                className="btn btn-primary w-full flex items-center justify-center relative overflow-hidden"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin text-base-100 z-5" />
                    <span className="z-0">Entrando...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2 text-base-100 z-5" />
                    <span className="z-0">Entrar</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Rodapé */}
          <div className="card-body p-6 pt-0 flex flex-col space-y-4 items-center">
            <div className="text-center text-sm text-base-content/70">
              Não tem uma conta?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Cadastre-se
              </Link>
            </div>
            <div className="text-center text-xs text-base-content/60">
              Ao fazer login, você concorda com nossos{" "}
              <a href="/termos" className="hover:underline">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a href="/privacidade" className="hover:underline">
                Política de Privacidade
              </a>
              .
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
