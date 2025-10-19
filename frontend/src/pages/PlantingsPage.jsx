import React, { useState, useRef, useEffect, useContext, createContext } from "react";
import { Loader2, Info, Calendar, ArrowRight, Leaf, Droplets, Sun, Thermometer } from "lucide-react";

// ====================================================================
// CORE UTILITIES & COMPONENTS (PARA O ARQUIVO SER SELF-CONTAINED)
// ====================================================================

// 1. Função cn
const cn = (...classes) => classes.filter(Boolean).join(' ');

// 2. Componente Button
const Button = ({ children, variant, size, className, ...props }) => {
  const baseClasses = "btn transition-all duration-200 text-base-content";
  let variantClasses = "btn-primary"; // Default DaisyUI
  if (variant === "outline") variantClasses = "btn-outline";
  if (variant === "ghost") variantClasses = "btn-ghost";
  if (size === "sm") variantClasses = cn(variantClasses, "btn-sm");
  if (size === "lg") variantClasses = cn(variantClasses, "btn-lg");

  return (
    <button
      className={cn(baseClasses, variantClasses, className)}
      {...props}
    >
      {children}
    </button>
  );
};

// 3. Componentes Card
const Card = ({ className, children, ...props }) => (
  <div className={cn("card bg-base-100 shadow-xl border border-base-300 transition-all duration-300", className)} {...props}>
    {children}
  </div>
);
const CardHeader = ({ className, children, ...props }) => (
  <div className={cn("card-body p-4 pb-2", className)} {...props}>
    {children}
  </div>
);
const CardTitle = ({ className, children, ...props }) => (
  <h2 className={cn("card-title text-xl text-base-content", className)} {...props}>{children}</h2>
);
const CardDescription = ({ className, children, ...props }) => (
  <p className={cn("text-sm text-gray-500", className)} {...props}>{children}</p>
);
const CardContent = ({ className, children, ...props }) => (
  <div className={cn("p-4 pt-0", className)} {...props}>
    {children}
  </div>
);
const CardFooter = ({ className, children, ...props }) => (
  <div className={cn("card-actions justify-end p-4 pt-0", className)} {...props}>
    {children}
  </div>
);

// 4. Componente Badge
const Badge = ({ children, className, variant, ...props }) => {
    let variantClass = "badge-neutral";
    if (variant === "default") variantClass = "badge-primary text-primary-content";
    if (variant === "outline") variantClass = "badge-outline";

    return (
        <span className={cn("badge", variantClass, className)} {...props}>
            {children}
        </span>
    );
};

// 5. Componente Progress
const Progress = ({ value, className, ...props }) => (
  <progress
    className={cn("progress progress-primary w-full", className)}
    value={value}
    max="100"
    {...props}
  />
);

// 6. Componentes Tabs
const TabsContext = createContext(null);
const Tabs = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>
        {React.Children.map(children, child => {
          if (child.type === TabsList) {
            return child;
          }
          return null;
        })}
        {React.Children.map(children, child => {
          if (child.type === TabsContent) {
            return child;
          }
          return null;
        })}
      </div>
    </TabsContext.Provider>
  );
};
const TabsList = ({ children, className }) => (
  <div className={cn("tabs tabs-boxed bg-base-200 p-1 rounded-box", className)}>
    {children}
  </div>
);
const TabsTrigger = ({ value, children, className }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      className={cn("tab tab-lg transition-all", className, {
        "tab-active bg-primary text-primary-content": activeTab === value,
      })}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};
const TabsContent = ({ value, children, className }) => {
  const { activeTab } = useContext(TabsContext);
  return activeTab === value ? (
    <div className={cn("pt-4", className)}>
      {children}
    </div>
  ) : null;
};

// 7. Componentes Dialog
const DialogContext = createContext({});
const Dialog = ({ open, onOpenChange, children, ...props }) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (dialogRef.current) {
            if (open) {
                if (dialogRef.current.open) return;
                dialogRef.current.showModal();
            } else {
                dialogRef.current.close();
            }
        }
    }, [open]);

    const handleClose = () => onOpenChange(false);
    
    const handleClickOutside = (e) => {
      if (dialogRef.current && e.target === dialogRef.current) {
        onOpenChange(false);
      }
    };

    return (
        <DialogContext.Provider value={{ onOpenChange }}>
            <dialog
                ref={dialogRef}
                className="modal"
                onClose={handleClose}
                onClick={handleClickOutside}
                {...props}
            >
                {children}
            </dialog>
        </DialogContext.Provider>
    );
};

const DialogContent = ({ children, className, ...props }) => {
    const { onOpenChange } = useContext(DialogContext);
    return (
        <div 
            className={cn("modal-box p-6 space-y-4 max-w-lg bg-base-100 shadow-2xl rounded-xl", className)} 
            onClick={(e) => e.stopPropagation()}
            {...props}
        >
            <button 
                onClick={() => onOpenChange(false)} 
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                aria-label="Fechar"
            >
                ✕
            </button>
            {children}
        </div>
    );
};

const DialogHeader = ({ className, children, ...props }) => (
  <div className={cn("space-y-1", className)} {...props}>{children}</div>
);
const DialogTitle = ({ className, children, ...props }) => (
  <h3 className={cn("font-bold text-2xl text-base-content", className)} {...props}>{children}</h3>
);
const DialogDescription = ({ className, children, ...props }) => (
  <p className={cn("text-sm text-gray-500", className)} {...props}>{children}</p>
);
const DialogFooter = ({ className, children, ...props }) => (
  <div className={cn("modal-action justify-end pt-4 space-x-2", className)} {...props}>
    {children}
  </div>
);

// 8. Componente FloatingActionButton
const FloatingActionButton = ({ onNewPlot }) => (
  <button
    className="btn btn-circle btn-lg btn-secondary shadow-xl fixed bottom-6 right-6 z-50 transition-transform hover:scale-105"
    onClick={onNewPlot}
    aria-label="Adicionar Novo Plantio"
  >
    <Leaf className="h-6 w-6" />
  </button>
);


// ====================================================================
// FIM DOS COMPONENTES BASE
// ====================================================================


// Dados de exemplo (mantidos como estão)
const plantingSuggestions = [
  {
    id: 1,
    name: "Alface",
    variety: "Crespa",
    growthTime: 45,
    waterNeeds: "Média",
    sunNeeds: "Parcial",
    temperature: "18-24°C",
    compatibleWith: ["Cenoura", "Cebola", "Tomate"],
    incompatibleWith: ["Salsa"],
    bestSeasonStart: 3,
    bestSeasonEnd: 10,
    icon: "🥬",
    difficultyLevel: "Fácil",
  },
  {
    id: 2,
    name: "Cenoura",
    variety: "Brasília",
    growthTime: 90,
    waterNeeds: "Média",
    sunNeeds: "Pleno",
    temperature: "15-25°C",
    compatibleWith: ["Alface", "Rabanete", "Ervilha"],
    incompatibleWith: ["Beterraba"],
    bestSeasonStart: 2,
    bestSeasonEnd: 8,
    icon: "🥕",
    difficultyLevel: "Médio",
  },
  {
    id: 3,
    name: "Tomate",
    variety: "Cereja",
    growthTime: 80,
    waterNeeds: "Alta",
    sunNeeds: "Pleno",
    temperature: "20-28°C",
    compatibleWith: ["Manjericão", "Cebolinha", "Salsa"],
    incompatibleWith: ["Batata", "Pepino"],
    bestSeasonStart: 9,
    bestSeasonEnd: 3,
    icon: "🍅",
    difficultyLevel: "Moderado",
  },
  {
    id: 4,
    name: "Couve",
    variety: "Manteiga",
    growthTime: 60,
    waterNeeds: "Média",
    sunNeeds: "Parcial",
    temperature: "15-22°C",
    compatibleWith: ["Alho", "Cebola", "Sálvia"],
    incompatibleWith: ["Morango"],
    bestSeasonStart: 3,
    bestSeasonEnd: 9,
    icon: "🥬",
    difficultyLevel: "Fácil",
  },
  {
    id: 5,
    name: "Manjericão",
    variety: "Italiano",
    growthTime: 50,
    waterNeeds: "Média",
    sunNeeds: "Pleno",
    temperature: "18-30°C",
    compatibleWith: ["Tomate", "Pimentão", "Orégano"],
    incompatibleWith: ["Rúcula"],
    bestSeasonStart: 9,
    bestSeasonEnd: 4,
    icon: "🌿",
    difficultyLevel: "Fácil",
  },
  {
    id: 6,
    name: "Rúcula",
    variety: "Folha Larga",
    growthTime: 40,
    waterNeeds: "Média",
    sunNeeds: "Parcial",
    temperature: "15-25°C",
    compatibleWith: ["Alface", "Morango", "Espinafre"],
    incompatibleWith: ["Manjericão"],
    bestSeasonStart: 3,
    bestSeasonEnd: 10,
    icon: "🥬",
    difficultyLevel: "Fácil",
  },
];

// Dados de exemplo para os plantios do usuário
const userPlantings = [
  {
    id: 1,
    crop: "Alface Crespa",
    plotName: "Canteiro 3",
    plantedDate: "2023-05-10",
    estimatedHarvest: "2023-06-24",
    status: "growing",
    progress: 70,
    careInstructions: [
      { task: "Irrigar", frequency: "Diariamente", lastDone: "2023-05-30" },
      {
        task: "Remover ervas daninhas",
        frequency: "Semanalmente",
        lastDone: "2023-05-28",
      },
    ],
    icon: "🥬",
  },
  {
    id: 2,
    crop: "Cenoura",
    plotName: "Canteiro 2",
    plantedDate: "2023-04-15",
    estimatedHarvest: "2023-07-14",
    status: "growing",
    progress: 50,
    careInstructions: [
      { task: "Irrigar", frequency: "A cada 2 dias", lastDone: "2023-05-29" },
      {
        task: "Afrouxar solo",
        frequency: "Quinzenalmente",
        lastDone: "2023-05-20",
      },
    ],
    icon: "🥕",
  },
  {
    id: 3,
    crop: "Tomate Cereja",
    plotName: "Canteiro 1",
    plantedDate: "2023-04-01",
    estimatedHarvest: "2023-06-20",
    status: "ready",
    progress: 95,
    careInstructions: [
      { task: "Irrigar", frequency: "A cada 2 dias", lastDone: "2023-05-29" },
      {
        task: "Amarrar planta",
        frequency: "Quando necessário",
        lastDone: "2023-05-25",
      },
      {
        task: "Podar brotos laterais",
        frequency: "Semanalmente",
        lastDone: "2023-05-28",
      },
    ],
    icon: "🍅",
  },
  {
    id: 4,
    crop: "Manjericão",
    plotName: "Canteiro 4",
    plantedDate: "2023-05-20",
    estimatedHarvest: "2023-07-10",
    status: "growing",
    progress: 30,
    careInstructions: [
      { task: "Irrigar", frequency: "A cada 2 dias", lastDone: "2023-05-29" },
      {
        task: "Remover flores",
        frequency: "Quando aparecerem",
        lastDone: "2023-05-28",
      },
    ],
    icon: "🌿",
  },
];

const PlantingCard = ({ planting, onClick }) => {
  // Calcula dias restantes até a colheita
  const today = new Date();
  const harvestDate = new Date(planting.estimatedHarvest);
  const daysLeft = Math.ceil(
    (harvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Formata a data de plantio
  const plantedDate = new Date(planting.plantedDate);
  const formattedPlantedDate = plantedDate.toLocaleDateString("pt-BR");

  // Determine a classe de badge baseada no status (DaisyUI)
  const badgeClass =
    planting.status === "ready"
      ? "badge-success text-success-content"
      : "badge-info text-info-content";

  return (
    <Card
      className="overflow-hidden shadow-xl transition-transform hover:scale-[1.02] cursor-pointer"
      onClick={() => onClick(planting.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-3xl mr-2">{planting.icon}</span>
            <div>
              <CardTitle>{planting.crop}</CardTitle>
              <CardDescription>{planting.plotName}</CardDescription>
            </div>
          </div>
          <Badge
            className={cn(
              "text-xs font-semibold",
              badgeClass
            )}
          >
            {planting.status === "ready"
              ? "Pronto p/ colheita"
              : "Em crescimento"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progresso:</span>
            <span className="font-medium text-base-content">{planting.progress}%</span>
          </div>
          <Progress value={planting.progress} className="h-2 bg-base-300" />

          <div className="flex justify-between items-center text-sm pt-2">
            <div className="flex items-center text-base-content/70">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Plantado: {formattedPlantedDate}</span>
            </div>
            <div>
              {daysLeft > 0 ? (
                <span className="text-primary font-medium">
                  {daysLeft} dias restantes
                </span>
              ) : (
                <span className="text-success font-medium">
                  Pronto para colheita!
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


const PlantingSuggestionCard = ({ suggestion, onSelect }) => {
  // Verifica se estamos na estação recomendada
  const currentMonth = new Date().getMonth() + 1;
  const isInSeason =
    suggestion.bestSeasonStart <= suggestion.bestSeasonEnd
      ? currentMonth >= suggestion.bestSeasonStart &&
        currentMonth <= suggestion.bestSeasonEnd
      : currentMonth >= suggestion.bestSeasonStart ||
        currentMonth <= suggestion.bestSeasonEnd;

  // Determinar classe do badge de época (DaisyUI)
  const seasonBadgeClass = isInSeason ? "badge-secondary" : "badge-outline";

  return (
    <Card
      className="overflow-hidden shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
      onClick={() => onSelect(suggestion.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-3xl mr-2">{suggestion.icon}</span>
            <div>
              <CardTitle>{suggestion.name}</CardTitle>
              <CardDescription>Variedade: {suggestion.variety}</CardDescription>
            </div>
          </div>
          <Badge className={cn("badge", seasonBadgeClass)} variant={isInSeason ? "default" : "outline"}>
            {isInSeason ? "Época ideal" : "Fora de época"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{suggestion.growthTime} dias até a colheita</span>
          </div>
          <div className="flex items-center">
            <Droplets className="h-4 w-4 mr-2 text-info" />
            <span>Água: {suggestion.waterNeeds}</span>
          </div>
          <div className="flex items-center">
            <Sun className="h-4 w-4 mr-2 text-warning" />
            <span>Sol: {suggestion.sunNeeds}</span>
          </div>
          <div className="flex items-center">
            <Thermometer className="h-4 w-4 mr-2 text-error" />
            <span>Temperatura: {suggestion.temperature}</span>
          </div>
          <div className="text-xs mt-2">
            <span className="text-gray-500">Dificuldade: </span>
            <span
              className={cn(
                "font-bold",
                suggestion.difficultyLevel === "Fácil"
                  ? "text-success"
                  : suggestion.difficultyLevel === "Médio"
                  ? "text-warning"
                  : "text-error"
              )}
            >
              {suggestion.difficultyLevel}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full btn-sm"
          onClick={() => onSelect(suggestion.id)}
        >
          Ver detalhes <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function PlantingsPage() {
  const [selectedPlanting, setSelectedPlanting] = useState(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showPlantingDialog, setShowPlantingDialog] = useState(false);
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);

  // Handlers
  const handlePlantingClick = (id) => {
    setSelectedPlanting(id);
    setShowPlantingDialog(true);
  };

  const handleSuggestionClick = (id) => {
    setSelectedSuggestion(id);
    setShowSuggestionDialog(true);
  };

  const handleNewPlanting = () => {
    // Abrir o modal de sugestões ao clicar no FAB
    setSelectedSuggestion(plantingSuggestions[0].id); // Seleciona o primeiro por padrão
    setShowSuggestionDialog(true);
  };

  // Dados para o modal de detalhes
  const plantingDetails = userPlantings.find((p) => p.id === selectedPlanting);
  const suggestionDetails = plantingSuggestions.find(
    (s) => s.id === selectedSuggestion
  );

  return (
    <div className="min-h-screen bg-base-100 flex font-sans"> 
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-base-content tracking-tight">
                Meus Plantios
              </h1>
              <p className="text-lg text-gray-500 mt-1">
                Acompanhe o crescimento e planeje novos cultivos.
              </p>
            </div>

            {/* Tabs e Conteúdo */}
            <Tabs defaultValue="current" className="space-y-6">
              <TabsList className="bg-base-200 p-1 rounded-box"> 
                <TabsTrigger value="current">Plantios Atuais</TabsTrigger>
                <TabsTrigger value="suggestions">
                  Sugestões de Cultivo
                </TabsTrigger>
              </TabsList>

              {/* Plantios Atuais */}
              <TabsContent value="current" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPlantings.map((planting) => (
                    <PlantingCard
                      key={planting.id}
                      planting={planting}
                      onClick={handlePlantingClick}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* Sugestões de Plantio */}
              <TabsContent value="suggestions" className="space-y-4">
                <Card className="bg-info/10 border-info border-l-4 mb-6 shadow-md">
                  <CardContent className="flex items-start p-4">
                    <Info className="h-8 w-8 text-info mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-base-content mb-1">
                        Recomendações Sazonais
                      </h3>
                      <p className="text-sm text-info-content/80">
                        Estas sugestões consideram a época ideal para o plantio, otimizando o sucesso da colheita.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plantingSuggestions.map((suggestion) => (
                    <PlantingSuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      onSelect={handleSuggestionClick}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Botão flutuante para adicionar novo plantio (DaisyUI secondary) */}
        <FloatingActionButton onNewPlot={handleNewPlanting} />

        {/* Modal de detalhes do plantio atual */}
        {plantingDetails && (
          <Dialog
            open={showPlantingDialog}
            onOpenChange={setShowPlantingDialog}
          >
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center text-3xl font-bold">
                  <span className="mr-3">{plantingDetails.icon}</span>
                  {plantingDetails.crop}
                </DialogTitle>
                <DialogDescription>
                  {plantingDetails.plotName} • Plantado em{" "}
                  {new Date(plantingDetails.plantedDate).toLocaleDateString(
                    "pt-BR"
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-bold mb-2 text-base-content">
                    Status do Crescimento
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/70">Progresso:</span>
                      <span className="font-semibold text-primary">
                        {plantingDetails.progress}% completo
                      </span>
                    </div>
                    <Progress
                      value={plantingDetails.progress}
                      className="h-3 bg-base-300"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-bold mb-2 text-base-content">
                    Próximos Cuidados
                  </h4>
                  <div className="space-y-3">
                    {plantingDetails.careInstructions.map(
                      (instruction, index) => (
                        <div
                          key={index}
                          className="bg-base-200 p-3 rounded-lg shadow-sm"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-base-content">
                              {instruction.task}
                            </span>
                            <Badge className="badge badge-warning badge-outline">
                              {instruction.frequency}
                            </Badge>
                          </div>
                          <div className="text-xs mt-1 text-gray-500">
                            Última vez:{" "}
                            {new Date(instruction.lastDone).toLocaleDateString(
                              "pt-BR"
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-bold mb-2 text-base-content">
                    Previsão de Colheita
                  </h4>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <div className="text-xl font-extrabold text-secondary-content">
                      {new Date(
                        plantingDetails.estimatedHarvest
                      ).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="text-sm text-gray-600">
                      {plantingDetails.status === "ready"
                        ? "Pronto para colheita!"
                        : `Aproximadamente ${Math.ceil(
                            (new Date(
                              plantingDetails.estimatedHarvest
                            ).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )} dias restantes`}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setShowPlantingDialog(false)}
                >
                  Fechar
                </Button>
                {plantingDetails.status === "ready" && (
                  <Button className="btn btn-success">
                    Registrar Colheita
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Modal de detalhes da sugestão de plantio */}
        {suggestionDetails && (
          <Dialog
            open={showSuggestionDialog}
            onOpenChange={setShowSuggestionDialog}
          >
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center text-3xl font-bold">
                  <span className="mr-3">{suggestionDetails.icon}</span>
                  {suggestionDetails.name} ({suggestionDetails.variety})
                </DialogTitle>
                <DialogDescription>
                  Guia completo de cultivo para a sua horta
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-base-200 p-3 rounded-lg flex flex-col items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary mb-1" />
                    <div className="text-xs text-gray-500">Ciclo</div>
                    <span className="font-bold text-lg text-base-content">
                      {suggestionDetails.growthTime} dias
                    </span>
                  </div>
                  <div className="bg-base-200 p-3 rounded-lg flex flex-col items-center justify-center">
                    <Droplets className="h-6 w-6 text-info mb-1" />
                    <div className="text-xs text-gray-500">Água</div>
                    <span className="font-bold text-lg text-base-content">
                      {suggestionDetails.waterNeeds}
                    </span>
                  </div>
                  <div className="bg-base-200 p-3 rounded-lg flex flex-col items-center justify-center">
                    <Sun className="h-6 w-6 text-warning mb-1" />
                    <div className="text-xs text-gray-500">Sol</div>
                    <span className="font-bold text-lg text-base-content">
                      {suggestionDetails.sunNeeds}
                    </span>
                  </div>
                  <div className="bg-base-200 p-3 rounded-lg flex flex-col items-center justify-center">
                    <Thermometer className="h-6 w-6 text-error mb-1" />
                    <div className="text-xs text-gray-500">Temp. Ideal</div>
                    <span className="font-bold text-lg text-base-content">
                      {suggestionDetails.temperature}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-bold mb-3 text-base-content">
                    Melhor Época para Plantio (Meses)
                  </h4>
                  <div className="bg-base-200 p-3 rounded-lg">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (month) => {
                          const isInSeason =
                            suggestionDetails.bestSeasonStart <=
                            suggestionDetails.bestSeasonEnd
                              ? month >= suggestionDetails.bestSeasonStart &&
                                month <= suggestionDetails.bestSeasonEnd
                              : month >= suggestionDetails.bestSeasonStart ||
                                month <= suggestionDetails.bestSeasonEnd;

                          return (
                            <Badge
                              key={month}
                              className={cn(
                                "badge text-xs min-w-[40px] justify-center",
                                isInSeason ? "badge-success" : "badge-ghost",
                                month === new Date().getMonth() + 1 &&
                                  "ring-2 ring-primary ring-offset-2" // Realça o mês atual
                              )}
                            >
                              {new Date(2023, month - 1, 1).toLocaleDateString(
                                "pt-BR",
                                { month: "short" }
                              )}
                            </Badge>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-bold mb-2 text-base-content">
                      Plantas Companheiras
                    </h4>
                    <div className="bg-success/10 border-l-4 border-success p-3 rounded-md">
                      <ul className="text-sm space-y-1 text-base-content/90">
                        {suggestionDetails.compatibleWith.map(
                          (plant, index) => (
                            <li key={index} className="flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-success mr-2"></span>
                              {plant}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-2 text-base-content">
                      Não Plantar Com
                    </h4>
                    <div className="bg-error/10 border-l-4 border-error p-3 rounded-md">
                      <ul className="text-sm space-y-1 text-base-content/90">
                        {suggestionDetails.incompatibleWith.map(
                          (plant, index) => (
                            <li key={index} className="flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-error mr-2"></span>
                              {plant}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-bold text-base-content">
                    Nível de Dificuldade
                  </h4>
                  <div className="mt-1 flex items-center bg-base-200 p-3 rounded-lg">
                    <span
                      className={cn(
                        "font-extrabold text-lg",
                        suggestionDetails.difficultyLevel === "Fácil"
                          ? "text-success"
                          : suggestionDetails.difficultyLevel === "Médio"
                          ? "text-warning"
                          : "text-error"
                      )}
                    >
                      {suggestionDetails.difficultyLevel}
                    </span>
                    <span className="text-sm text-gray-600 ml-3">
                      {suggestionDetails.difficultyLevel === "Fácil"
                        ? "— Ideal para iniciantes, requer pouca manutenção."
                        : suggestionDetails.difficultyLevel === "Médio"
                        ? "— Requer atenção regular e monitoramento."
                        : "— Para jardineiros experientes, com cuidados específicos."}
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setShowSuggestionDialog(false)}
                >
                  Fechar
                </Button>
                <Button className="btn btn-primary">
                  Iniciar Plantio
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}