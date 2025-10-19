import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Droplets, Sun, BugOff, Plus, Bell } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useHortaStore } from "../stores/useHortaStore";

const GardenPlot = ({ plot, onClick }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case "available":
        return "border border-base-300 bg-base-200";
      case "planted":
        return "border border-primary/30 bg-primary/5";
      case "harvested":
        return "border border-green-300 bg-green-50";
      case "maintenance":
        return "border border-yellow-300 bg-yellow-50";
      default:
        return "border border-base-300 bg-base-200";
    }
  };

  return (
    <div
      className={`rounded-lg p-4 cursor-pointer transition-shadow hover:shadow-md ${getStatusClasses(
        plot.status
      )}`}
      onClick={() => onClick(plot.id)}
    >
      <div className="text-center mb-2">
        <h3 className="font-medium text-base-content">{plot.name}</h3>
        <p className="text-sm text-base-content/70">
          {plot.status === "available"
            ? "Disponível"
            : plot.status === "maintenance"
            ? "Em manutenção"
            : plot.crop || "—"}
        </p>
      </div>

      {plot.status !== "available" && (
        <div className="mt-2">
          <div className="h-2 bg-base-300 rounded-full">
            <div
              className="h-2 bg-primary rounded-full"
              style={{ width: `${plot.progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-base-content/70">
            <span>{plot.status === "planted" ? "Crescimento" : "Progresso"}</span>
            <span>{plot.progress}%</span>
          </div>
        </div>
      )}

      {plot.status === "planted" && plot.estimatedHarvest && (
        <p className="text-xs text-center mt-2 text-primary">
          Colheita estimada: {plot.estimatedHarvest}
        </p>
      )}
    </div>
  );
};

export default function GardenPage() {
  const { user } = useUserStore();
  const { gardens, loading, error, fetchGardens } = useHortaStore();
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [newPlotOpen, setNewPlotOpen] = useState(false);

  useEffect(() => {
    if (!gardens && !loading) fetchGardens();
  }, [gardens, loading, fetchGardens]);

  // Mapear dados reais do model Horta -> formato do componente
  const mappedPlotsFromServer = (gardens || []).flatMap((horta) => {
    // cada horta pode ter vários plantios; mapamos cada plantio para um "plot" visual
    if (Array.isArray(horta.plantios) && horta.plantios.length > 0) {
      return horta.plantios.map((plantio, idx) => ({
        id: `${horta.id}::${idx}`,
        name: horta.nome + (horta.plantios.length > 1 ? ` (${idx + 1})` : ""),
        crop: plantio?.cultura || horta.tipoHorta || horta.descricao || "",
        status: plantio?.status ? plantio.status.toLowerCase() : "planted",
        progress: plantio?.progresso ?? 50,
        plantedDate: plantio?.dataPlantio ?? plantio?.createdAt ?? undefined,
        estimatedHarvest: plantio?.estimativaColheita ?? undefined,
      }));
    }

    // se não tem plantios, representamos a própria horta como um plot "available"
    return [
      {
        id: horta.id,
        name: horta.nome,
        crop: horta.tipoHorta || horta.descricao || "",
        status: "available",
        progress: 0,
      },
    ];
  });

  // fallback para mocks caso não exista dado do servidor
  const fallbackPlots = [
    { id: 1, name: "Canteiro 1", crop: "Alface", status: "planted", progress: 75, plantedDate: "05/05/2023", estimatedHarvest: "20/06/2023" },
    { id: 2, name: "Canteiro 2", crop: "Cenoura", status: "planted", progress: 45, plantedDate: "10/05/2023", estimatedHarvest: "10/07/2023" },
    { id: 3, name: "Canteiro 3", crop: "Tomate", status: "planted", progress: 60, plantedDate: "01/05/2023", estimatedHarvest: "01/08/2023" },
    { id: 4, name: "Canteiro 4", crop: "", status: "available", progress: 0 },
    { id: 5, name: "Canteiro 5", crop: "Rúcula", status: "harvested", progress: 100, plantedDate: "01/04/2023", estimatedHarvest: "01/06/2023" },
    { id: 6, name: "Canteiro 6", crop: "", status: "maintenance", progress: 30 },
  ];

  const gardenPlots = mappedPlotsFromServer.length ? mappedPlotsFromServer : fallbackPlots;
  const selectedPlotData = gardenPlots.find((p) => String(p.id) === String(selectedPlot)) || null;

  return (
    <div className="min-h-screen bg-base-100 flex">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-base-100 border-b border-base-300 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 md:flex-none">
              <h1 className="text-xl font-semibold">Minha Horta</h1>
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
                    <span className="text-info">{error ? `Erro: ${error}` : "Você tem novas notificações"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Bem-vindo(a), {user?.nome || "Usuário"}!</h1>
              <p className="text-base-content/70">Gerencie seus canteiros e acompanhe o progresso dos cultivos.</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="card bg-base-100 border border-base-300">
                    <div className="card-body">
                      <h2 className="card-title">Horta Comunitária</h2>
                      <p className="text-sm text-base-content/70">Dados carregados do servidor</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="card bg-base-100 border border-base-300">
                    <div className="card-body">
                      <h2 className="card-title">Layout da Horta</h2>
                      <p className="card-description">Visualize e gerencie seus canteiros</p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {gardenPlots.map((plot) => (
                          <GardenPlot key={plot.id} plot={plot} onClick={(id) => setSelectedPlot(id)} />
                        ))}
                      </div>
                      <div className="card-actions justify-end mt-4">
                        <Link to="/hortas" className="btn btn-ghost btn-sm gap-2">
                          Ver todos
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-100 border border-base-300">
                    <div className="card-body">
                      <h2 className="card-title">Detalhes do Canteiro</h2>
                      {selectedPlotData ? (
                        <>
                          <p className="font-medium">{selectedPlotData.name}</p>
                          <p className="text-sm text-base-content/70">
                            {selectedPlotData.status === "planted"
                              ? `Plantado em ${selectedPlotData.plantedDate || "–"}`
                              : selectedPlotData.status === "harvested"
                              ? "Canteiro pronto para novo plantio"
                              : selectedPlotData.status === "available"
                              ? "Disponível para plantio"
                              : "Em manutenção"}
                          </p>

                          {selectedPlotData.status === "planted" && (
                            <>
                              <div className="mt-4">
                                <div className="h-3 bg-base-300 rounded-full">
                                  <div
                                    className="h-3 bg-primary rounded-full"
                                    style={{ width: `${selectedPlotData.progress}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs mt-1 text-base-content/70">
                                  <span>Plantio</span>
                                  <span>Colheita</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                  <p className="text-sm text-base-content/70">Data de plantio</p>
                                  <p className="font-medium">{selectedPlotData.plantedDate || "–"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-base-content/70">Colheita estimada</p>
                                  <p className="font-medium">{selectedPlotData.estimatedHarvest || "–"}</p>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-12 text-base-content/70">Selecione um canteiro para ver detalhes</div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <button
        onClick={() => setNewPlotOpen(true)}
        aria-label="Novo canteiro"
        className="fixed right-6 bottom-6 btn btn-primary btn-circle"
      >
        <Plus className="h-5 w-5" />
      </button>

      {newPlotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Novo Canteiro</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-base-content/70">Nome</label>
                <input className="input input-bordered w-full" placeholder="Ex: Canteiro 7" />
              </div>
              <div>
                <label className="block text-sm text-base-content/70">Status inicial</label>
                <select className="select select-bordered w-full">
                  <option value="available">Disponível</option>
                  <option value="maintenance">Em Manutenção</option>
                  <option value="planted">Plantado</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button className="btn btn-ghost" onClick={() => setNewPlotOpen(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setNewPlotOpen(false)}>Adicionar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}