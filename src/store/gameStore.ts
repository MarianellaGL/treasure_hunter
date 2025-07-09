import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
  // Estado del juego
  foundClues: number[];
  terminalOutput: string[];
  currentClueId: number;
  isGameStarted: boolean;

  // Acciones
  addFoundClue: (clueId: number) => void;
  setFoundClues: (clues: number[]) => void;
  addTerminalOutput: (message: string) => void;
  setTerminalOutput: (output: string[]) => void;
  setCurrentClueId: (clueId: number) => void;
  startGame: () => void;
  resetGame: () => void;
  clearStorage: () => void;

  // Estado de hacking
  hackProgress: number;
  setHackProgress: (progress: number) => void;

  // Estado de minijuegos
  decryptCode: string;
  setDecryptCode: (code: string) => void;
  bypassSequence: string[];
  setBypassSequence: (sequence: string[]) => void;
  overrideAttempts: number;
  setOverrideAttempts: (attempts: number) => void;
  removeFoundClue: (clueId: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      foundClues: [],
      terminalOutput: [],
      currentClueId: 1,
      isGameStarted: false,
      hackProgress: 0,
      decryptCode: "",
      bypassSequence: [],
      overrideAttempts: 0,

      // Acciones
      addFoundClue: (clueId: number) => {
        const { foundClues, addTerminalOutput } = get();
        if (!foundClues.includes(clueId)) {
          const newFoundClues = [...foundClues, clueId];
          set({ foundClues: newFoundClues });
          addTerminalOutput(`¡Pista ${clueId} completada!`);
        }
      },

      setFoundClues: (clues: number[]) => {
        set({ foundClues: clues });
      },

      addTerminalOutput: (message: string) => {
        const { terminalOutput } = get();
        const timestamp = new Date().toLocaleTimeString();
        const newOutput = [...terminalOutput, `[${timestamp}] ${message}`];
        set({ terminalOutput: newOutput });
      },

      setTerminalOutput: (output: string[]) => {
        set({ terminalOutput: output });
      },

      setCurrentClueId: (clueId: number) => {
        set({ currentClueId: clueId });
      },

      startGame: () => {
        set({ isGameStarted: true });
      },

      resetGame: () => {
        set({
          foundClues: [],
          terminalOutput: [],
          currentClueId: 1,
          isGameStarted: false,
          hackProgress: 0,
          decryptCode: "",
          bypassSequence: [],
          overrideAttempts: 0,
        });
      },

      clearStorage: () => {
        localStorage.removeItem("treasure-hunter-game");
        set({
          foundClues: [],
          terminalOutput: [],
          currentClueId: 1,
          isGameStarted: false,
          hackProgress: 0,
          decryptCode: "",
          bypassSequence: [],
          overrideAttempts: 0,
        });
      },

      // Estado de hacking
      setHackProgress: (progress: number) => {
        set({ hackProgress: progress });
      },

      // Estado de minijuegos
      setDecryptCode: (code: string) => {
        set({ decryptCode: code });
      },

      setBypassSequence: (sequence: string[]) => {
        set({ bypassSequence: sequence });
      },

      setOverrideAttempts: (attempts: number) => {
        set({ overrideAttempts: attempts });
      },

      // Función temporal para limpiar pista específica
      removeFoundClue: (clueId: number) => {
        const { foundClues } = get();
        const newFoundClues = foundClues.filter((id) => id !== clueId);
        set({ foundClues: newFoundClues });
      },
    }),
    {
      name: "treasure-hunter-game",
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Validar que foundClues sea un array
          if (!Array.isArray(state.foundClues)) {
            console.warn("FoundClues no es un array, limpiando estado...");
            state.foundClues = [];
          }

          // Validar que terminalOutput sea un array
          if (!Array.isArray(state.terminalOutput)) {
            console.warn("TerminalOutput no es un array, limpiando estado...");
            state.terminalOutput = [];
          }
        }
      },
    }
  )
);
