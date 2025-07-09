import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HackInterface from "../components/HackInterface";
import ClueDisplay from "../components/ClueDisplay";
import ProgressTracker from "../components/ProgressTracker";
import type { Clue } from "../types/game";
import AnimatedTerminal from "../components/AnimatedTerminal";

interface GamePageProps {
  clues: Clue[];
  foundClues: Set<number>;
  setFoundClues: (clues: Set<number>) => void;
  terminalOutput: string[];
  setTerminalOutput: (output: string[]) => void;
}

const GamePage: React.FC<GamePageProps> = ({
  clues,
  foundClues,
  setFoundClues,
  terminalOutput,
  setTerminalOutput,
}) => {
  const navigate = useNavigate();
  const [currentClue, setCurrentClue] = useState<number>(0);
  const [hackProgress, setHackProgress] = useState<number>(0);

  const addTerminalOutput = (message: string) => {
    setTerminalOutput([
      ...terminalOutput,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

  const handleClueFound = (clueId: number) => {
    const clue = clues.find((c) => c.id === clueId);
    if (clue) {
      setFoundClues(new Set([...foundClues, clueId]));
      addTerminalOutput(`¡Pista ${clueId} encontrada en ${clue.location}!`);

      if (foundClues.size + 1 === clues.length) {
        setTimeout(() => {
          navigate("/completed");
          addTerminalOutput(
            "¡Misión completada! Has encontrado todas las pistas."
          );
          addTerminalOutput(
            "El tesoro te espera en el primer cajón del lugar de carpintería."
          );
        }, 2000);
      }
    }
  };

  const handleHackComplete = () => {
    setHackProgress(100);
    addTerminalOutput("¡Hack completado! Acceso concedido.");
    setTimeout(() => {
      setHackProgress(0);
      handleClueFound(currentClue + 1);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-screen">
        <div className="lg:col-span-2">
          <AnimatedTerminal />
        </div>
        <div className="space-y-4">
          <ProgressTracker
            totalClues={clues.length}
            foundClues={foundClues.size}
          />
          <ClueDisplay
            clues={clues}
            currentClue={currentClue}
            foundClues={
              Array.isArray(foundClues) ? foundClues : Array.from(foundClues)
            }
            onClueSelect={setCurrentClue}
          />
          {clues[currentClue]?.hackRequired && (
            <HackInterface
              clue={clues[currentClue]}
              progress={hackProgress}
              onProgressChange={setHackProgress}
              onComplete={handleHackComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
