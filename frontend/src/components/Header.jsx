import React from "react";

const Header = () => {
  return (
    <header className="navbar bg-base-100 shadow-sm py-2 px-4">
      <div className="navbar-start">
        {/* Logo e nome da marca */}
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
          </svg>
          <span className="text-lg font-semibold">Cultive</span>
        </div>
      </div>

      {/* Menu para desktop */}
      <div className="navbar-center hidden md:flex">
        <nav className="flex gap-6">
          <a href="/planos" className="link link-hover text-base-content">
            Planos
          </a>
          <a href="/sobre" className="link link-hover text-base-content">
            Sobre nós
          </a>
          <a href="/ajuda" className="link link-hover text-base-content">
            Ajuda
          </a>
        </nav>
      </div>

      {/* Botões de autenticação para desktop */}
      <div className="navbar-end hidden md:flex gap-2">
        <Link to="/login" className="btn btn-ghost">Entrar</Link>
        <Link to="/signup" className="btn btn-primary">Cadastre-se</Link>
      </div>

      {/* Menu mobile dropdown */}
      <div className="navbar-end md:hidden">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a href="/planos">Planos</a>
            </li>
            <li>
              <a href="/sobre">Sobre nós</a>
            </li>
            <li>
              <a href="/ajuda">Ajuda</a>
            </li>
            <li className="menu-title mt-2">
              <span>Conta</span>
            </li>
            <li>
              <Link to="/login">Entrar</Link>
            </li>
            <li>
              <Link to="/signup">Cadastre-se</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
