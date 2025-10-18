import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-base-100 py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] dark:opacity-[0.025]"></div>
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-center">
            <div className="max-w-6xl w-full">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2 text-center lg:text-left">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                      Cultive comunidade, <br />
                      <span className="text-primary">colha abundância</span>
                    </h1>
                    <p className="max-w-[700px] text-base-content/70 md:text-xl mx-auto lg:mx-0">
                      A plataforma completa para gestão de hortas comunitárias.
                      Planeje plantios, organize tarefas, distribua colheitas e
                      fortaleça laços comunitários.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
                    <a
                      href="/signup"
                      className="btn btn-primary btn-lg gap-1.5"
                    >
                      Comece sua horta comunitária
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
                        className="h-4 w-4"
                      >
                        <path d="m9 18 6-6-6-6"></path>
                      </svg>
                    </a>
                    <a href="/planos" className="btn btn-outline btn-lg">
                      Ver planos
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm justify-center lg:justify-start">
                    <div className="flex items-center gap-1">
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
                        className="h-4 w-4 text-primary"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                      <span>Planejamento inteligente</span>
                    </div>
                    <div className="flex items-center gap-1">
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
                        className="h-4 w-4 text-primary"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                      <span>Gestão colaborativa</span>
                    </div>
                    <div className="flex items-center gap-1">
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
                        className="h-4 w-4 text-primary"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                      <span>Distribuição justa</span>
                    </div>
                  </div>
                </div>
                <div className="relative hidden lg:block">
                  <div className="absolute -left-8 -top-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)] rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 p-8">
                    <div className="h-full w-full overflow-hidden rounded-2xl border bg-base-100 shadow-xl">
                      <img
                        src="https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=700&q=80"
                        alt="Horta comunitária em funcionamento"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-base-100">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-center">
            <div className="max-w-6xl w-full">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="badge badge-primary badge-lg">Benefícios</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Transformando hortas em comunidades
                  </h2>
                  <p className="max-w-[900px] text-base-content/70 md:text-xl">
                    Cultive reúne todas as ferramentas necessárias para criar,
                    gerenciar e fazer prosperar hortas comunitárias com menos
                    esforço e mais resultados.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {/* Card 1 */}
                <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body items-center text-center">
                    <div className="p-2 w-16 h-16 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
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
                        className="h-10 w-10 text-primary"
                      >
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                      </svg>
                    </div>
                    <h3 className="card-title text-2xl">Gestão Integrada</h3>
                    <p className="text-base-content/70">
                      Todas as ferramentas que você precisa para gerenciar sua
                      horta comunitária em um só lugar. Do planejamento à
                      colheita.
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body items-center text-center">
                    <div className="p-2 w-16 h-16 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
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
                        className="h-10 w-10 text-primary"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <h3 className="card-title text-2xl">
                      Colaboração Eficiente
                    </h3>
                    <p className="text-base-content/70">
                      Organize facilmente tarefas entre os membros da
                      comunidade, agende mutirões e mantenha todos informados.
                    </p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body items-center text-center">
                    <div className="p-2 w-16 h-16 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
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
                        className="h-10 w-10 text-primary"
                      >
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                    </div>
                    <h3 className="card-title text-2xl">
                      Planejamento Inteligente
                    </h3>
                    <p className="text-base-content/70">
                      Sugestões de plantio baseadas na sazonalidade, condições
                      locais e preferências da comunidade.
                    </p>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body items-center text-center">
                    <div className="p-2 w-16 h-16 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
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
                        className="h-10 w-10 text-primary"
                      >
                        <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                        <path d="M18 17V9"></path>
                        <path d="M13 17V5"></path>
                        <path d="M8 17v-3"></path>
                      </svg>
                    </div>
                    <h3 className="card-title text-2xl">
                      Distribuição Transparente
                    </h3>
                    <p className="text-base-content/70">
                      Registre e acompanhe a distribuição das colheitas entre
                      famílias e parceiros de forma justa e transparente.
                    </p>
                  </div>
                </div>

                {/* Card 5 */}
                <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body items-center text-center">
                    <div className="p-2 w-16 h-16 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
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
                        className="h-10 w-10 text-primary"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <h3 className="card-title text-2xl">
                      Comunicação Centralizada
                    </h3>
                    <p className="text-base-content/70">
                      Chat, anúncios e notificações para manter toda a
                      comunidade conectada и engajada.
                    </p>
                  </div>
                </div>

                {/* Card 6 */}
                <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body items-center text-center">
                    <div className="p-2 w-16 h-16 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
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
                        className="h-10 w-10 text-primary"
                      >
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 极速加速器 0 0 1-.963 0z"></path>
                        <path d="M20 3v4"></path>
                        <path d="M22 5h-4"></path>
                        <path d="M4 17v2"></path>
                        <path d="M5 18H3"></path>
                      </svg>
                    </div>
                    <h3 className="card-title text-2xl">Análises Avançadas</h3>
                    <p className="text-base-content/70">
                      Relatórios detalhados sobre produção, participação
                      comunitária e impacto social da sua horta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-base-200">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-center">
            <div className="max-w-6xl w-full">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
                <div>
                  <div className="space-y-2">
                    <div className="badge badge-primary badge-lg">
                      Como funciona
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                      Simples e eficiente do início ao fim
                    </h2>
                    <p className="max-w-[600px] text-base-content/70 md:text-xl">
                      Nossa plataforma foi pensada para facilitar cada etapa da
                      gestão de hortas comunitárias, desde o planejamento
                      inicial até a distribuição das colheitas.
                    </p>
                  </div>
                  <div className="grid gap-4 mt-8">
                    {[
                      {
                        number: "01",
                        title: "Crie",
                        description:
                          "Cadastre sua horta comunitária, defina espaços de cultivo e registre áreas de plantio.",
                      },
                      {
                        number: "02",
                        title: "Conecte",
                        description:
                          "Convide famílias, voluntários e organizações para participar da sua comunidade.",
                      },
                      {
                        number: "03",
                        title: "Cultive",
                        description:
                          "Planeje plantios, organize tarefas e acompanhe o desenvolvimento das culturas.",
                      },
                      {
                        number: "04",
                        title: "Compartilhe",
                        description:
                          "Registre colheitas e distribua os alimentos de forma justa e transparente.",
                      },
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-base-300 bg-base-100 text-sm font-semibold">
                          {step.number}
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold">{step.title}</h3>
                          <p className="text-sm text-base-content/70">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 text-center lg:text-left">
                    <a href="/signup" className="btn btn-primary">
                      Comece agora mesmo
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="极速加速器 0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-2 h-4 w-4"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="relative hidden lg:block">
                  <div className="flex justify-center">
                    <div className="w-full max-w-md">
                      <div className="rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 p-8">
                        <div className="overflow-hidden rounded-2xl border bg-base-100 shadow-xl">
                          <img
                            src="https://images.unsplash.com/photo-1582095128060-e9ca8130cc6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=700&q=80"
                            alt="Pessoas trabalhando juntas em uma horta comunitária"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-base-100">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-center">
            <div className="max-w-6xl w-full">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="badge badge-primary badge-lg">
                    Histórias de sucesso
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Comunidades que prosperam
                  </h2>
                  <p className="max-w-[900px] text-base-content/70 md:text-xl">
                    Descubra como comunidades estão transformando espaços
                    urbanos em hortas prósperas e fortalecendo laços
                    comunitários com a ajuda da nossa plataforma.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid gap-6 py-12 md:grid-cols-3">
                {[
                  {
                    name: "Maria Silva",
                    role: "Líder comunitária em São Paulo",
                    image: "https://randomuser.me/api/portraits/women/17.jpg",
                    quote:
                      "Nossa horta comunitária mudou completamente depois que começamos a usar o Cultive. O planejamento ficou mais fácil e a distribuição das colheitas é agora totalmente transparente.",
                  },
                  {
                    name: "Carlos Oliveira",
                    role: "Família participante no Rio de Janeiro",
                    image: "https://randomuser.me/api/portraits/men/32.jpg",
                    quote:
                      "Como família participante, é gratificante ver como nossa contribuição na horta é reconhecida. O sistema de distribuição garante que todos recebam de forma justa.",
                  },
                  {
                    name: "Ana Rodrigues",
                    role: "Coordenadora de ONG em Belo Horizonte",
                    image: "https://randomuser.me/api/portraits/women/42.jpg",
                    quote:
                      "Nossa ONG apoia 5 hortas comunitárias diferentes e o Cultive nos ajuda a coordenar todas elas de forma eficiente. Os relatórios são essenciais para nossa prestação de contas.",
                  },
                ].map((testimonial, index) => (
                  <div
                    key={index}
                    className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="card-body items-center text-center">
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <p className="text-sm text-base-content/70">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <p className="text-base-content/80 italic">
                        "{testimonial.quote}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex justify-center">
            <div className="max-w-4xl w-full">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Pronto para começar sua jornada?
                  </h2>
                  <p className="max-w-[700px] text-base-content/70 md:text-xl">
                    Junte-se às centenas de comunidades que estão transformando
                    a forma de cultivar e compartilhar alimentos saudáveis.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <a
                    href="/signup"
                    className="btn btn-primary btn-lg gap-1.5"
                  >
                    Criar uma conta gratuitamente
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
                      className="h-4 w-4"
                    >
                      <path d="M18 8L22 12L极速加速器 16"></path>
                      <path d="M2 12H22"></path>
                    </svg>
                  </a>
                  <a href="/sobre" className="btn btn-outline btn-lg">
                    Saiba mais sobre nós
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
        <nav className="grid grid-flow-col gap-4">
          <a href="/sobre" className="link link-hover">
            Sobre nós
          </a>
          <a href="/contato" className="link link-hover">
            Contato
          </a>
          <a href="/planos" className="link link-hover">
            Planos
          </a>
          <a href="/ajuda" className="link link-hover">
            Ajuda
          </a>
        </nav>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </nav>
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - Todos os direitos
            reservados pela Cultive
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default HomePage;
