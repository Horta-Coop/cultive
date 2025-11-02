import { Plus, Lightbulb } from "lucide-react";
import { Button } from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropMenu";

export function FloatingActionButton({ onNewPlot, onNewTask, onNewHarvest }) {
  return (
    <>
      {/* Botão de Ação Principal (Menu Flutuante) */}
      <div className="fixed right-6 bottom-20 md:bottom-6 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="btn-accent text-accent-content rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
              size="icon"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onNewPlot && (
              <DropdownMenuItem className="cursor-pointer" onClick={onNewPlot}>
                <div className="flex items-center">
                  <span className="mr-2">🌱</span>
                  <span>Novo Canteiro</span>
                </div>
              </DropdownMenuItem>
            )}
            {onNewTask && (
              <DropdownMenuItem className="cursor-pointer" onClick={onNewTask}>
                <div className="flex items-center">
                  <span className="mr-2">📝</span>
                  <span>Nova Tarefa</span>
                </div>
              </DropdownMenuItem>
            )}
            {onNewHarvest && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={onNewHarvest}
              >
                <div className="flex items-center">
                  <span className="mr-2">🥕</span>
                  <span>Registrar Colheita</span>
                </div>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Botão do Assistente IA */}
      <div className="fixed left-6 bottom-20 md:bottom-6 z-20">
        <Button
          className="btn-primary text-primary-content rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors"
          size="icon"
        >
          <Lightbulb className="h-6 w-6" />
          <span className="sr-only">Assistente IA</span>
        </Button>
      </div>
    </>
  );
}
