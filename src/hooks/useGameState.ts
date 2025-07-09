import { useState, useEffect } from "react";
import { clues } from "../utils/clues";

export const useGameState = () => {
  const [foundClues, setFoundClues] = useState<Set<number>>(new Set());
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  // Cargar estado guardado al inicializar
  useEffect(() => {
    const savedFoundClues = localStorage.getItem("treasure-hunter-found-clues");
    const savedTerminalOutput = localStorage.getItem(
      "treasure-hunter-terminal-output"
    );

    if (savedFoundClues) {
      const parsedClues = JSON.parse(savedFoundClues);
      setFoundClues(new Set(parsedClues));
    }

    if (savedTerminalOutput) {
      const parsedOutput = JSON.parse(savedTerminalOutput);
      setTerminalOutput(parsedOutput);
    }
  }, []);

  // Guardar estado cuando cambie
  useEffect(() => {
    localStorage.setItem(
      "treasure-hunter-found-clues",
      JSON.stringify([...foundClues])
    );
  }, [foundClues]);

  useEffect(() => {
    localStorage.setItem(
      "treasure-hunter-terminal-output",
      JSON.stringify(terminalOutput)
    );
  }, [terminalOutput]);

  const resetGame = () => {
    setFoundClues(new Set());
    setTerminalOutput([]);
    localStorage.removeItem("treasure-hunter-found-clues");
    localStorage.removeItem("treasure-hunter-terminal-output");
  };

  const startGame = () => {
    // Agregar mensajes iniciales al terminal
    setTerminalOutput([
      "[Sistema] Iniciando Treasure Hunter v2.0...",
      "[Sistema] Cargando módulos de hacking...",
      "[Sistema] Conectando a la red...",
      "[Sistema] Acceso concedido. ¡Bienvenido, hacker!",
    ]);
  };

  return {
    clues,
    foundClues,
    setFoundClues,
    terminalOutput,
    setTerminalOutput,
    resetGame,
    startGame,
  };
};
