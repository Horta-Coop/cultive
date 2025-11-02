import React, { useState, useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { Loader, Lock, LogIn, Mail, User, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { signup, loading } = useUserStore();

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
      case "name":
        return value.trim().length < 3
          ? "O nome deve ter pelo menos 3 caracteres"
          : "";
      case "username":
        return value.trim().length < 3
          ? "O usuário deve ter pelo menos 3 caracteres"
          : "";
      case "email":
        return /^\S+@\S+\.\S+$/.test(value) ? "" : "Email inválido";
      case "password":
        return value.length < 12
          ? "A senha deve ter pelo menos 12 caracteres"
          : "";
      case "confirmPassword":
        return value !== formData.password ? "As senhas não coincidem" : "";
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

    signup(formData);
  };

  // Função para definir classes de input com base no erro ou sucesso
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
            <h2 className="text-2xl font-bold text-base-content">
              Criar conta
            </h2>
            <p className="text-base-content/70 text-sm">
              Comece sua jornada na HortaComm
            </p>
          </div>

          {/* Formulário */}
          <div className="card-body p-6 pt-0 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome completo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/60 z-10 pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    className={`input input-bordered w-full pl-12 z-0 ${inputClass(
                      "name"
                    )}`}
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-error mt-1">{errors.name}</p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content">
                  Nome de usuário
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/60 z-10 pointer-events-none" />
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

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/60 z-10 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    className={`input input-bordered w-full pl-12 z-0 ${inputClass(
                      "email"
                    )}`}
                    placeholder="Seu email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-error mt-1">{errors.email}</p>
                )}
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/60 z-10 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`input input-bordered w-full pl-12 pr-12 z-0 ${inputClass(
                      "password"
                    )}`}
                    placeholder="Crie uma senha"
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

              {/* Confirmar senha */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-base-content">
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/60 z-10 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={`input input-bordered w-full pl-12 pr-12 z-0 ${inputClass(
                      "confirmPassword"
                    )}`}
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-base-content/60 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-error mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Termos */}
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
              <button
                type="submit"
                className="btn btn-primary w-full flex items-center justify-center relative overflow-hidden"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Criar conta
                  </>
                )}
              </button>
            </form>

            {/* Link para login */}
            <div className="text-center mt-6">
              <p className="text-sm text-base-content/70">
                Já tem uma conta?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
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
