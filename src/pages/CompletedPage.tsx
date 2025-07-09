import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { useGameState } from "../hooks/useGameState";

const BINARIO =
  "01100110 01100101 01101100 01101001 01111010 00100000 01100011 01110101 01101101 01110000 01101100 01100101 01100001 01101110 01111001 01101111 01110011 00101100 00100000 01110100 01100101 00100000 01100001 01101101 01101111";

const CompletedPage: React.FC = () => {
  const { clues } = useGameState();
  const { foundClues } = useGameStore();
  const [decoded, setDecoded] = useState(false);

  const completionPercentage = (foundClues.length / clues.length) * 100;

  // Decodificar binario a texto
  const decodeBinary = (bin: string) =>
    bin
      .split(" ")
      .map((b) => String.fromCharCode(parseInt(b, 2)))
      .join("");

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center">
      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col justify-center items-center">
        <div className="max-w-2xl mx-auto">
          {/* Header de victoria */}
          <div className="neobrutal-card text-center mb-6">
            <div className="mb-4">
              <span className="text-4xl md:text-6xl">🎉</span>
            </div>
            <h1 className="neobrutal-title text-3xl md:text-4xl mb-4">
              ¡MISIÓN COMPLETADA!
            </h1>
            <div className="mb-4">
              <span className="font-bold text-[#00FF00] text-lg md:text-xl">
                Hacker Nivel Máximo
              </span>
            </div>
          </div>

          {/* Estadísticas */}
          <h2 className="neobrutal-title text-xl mb-3">ESTADÍSTICAS FINALES</h2>
          <div className="text-white text-base space-y-3 mb-8">
            <div className="flex justify-between items-center">
              <span>Pistas encontradas:</span>
              <span className="font-bold text-[#00FF00]">
                {foundClues.length}/{clues.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Porcentaje de éxito:</span>
              <span className="font-bold text-[#00FF00]">
                {completionPercentage}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Estado del sistema:</span>
              <span className="font-bold text-[#00FF00]">COMPROMETIDO</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Nivel de hacker:</span>
              <span className="font-bold text-[#00FF00]">LEGENDARIO</span>
            </div>
          </div>

          {/* Mensaje binario final */}
          <div className="neobrutal-card text-center mb-6 p-6 bg-black border-2 border-[#00FF00]">
            <div className="mb-4">
              <span className="font-mono text-[#00FF00] text-lg select-all break-words">
                {decoded ? decodeBinary(BINARIO) : BINARIO}
              </span>
            </div>
            {!decoded && (
              <button
                onClick={() => setDecoded(true)}
                className="neobrutal-btn btn-100 text-lg px-8 py-4 mt-2"
              >
                DECODIFICAR
              </button>
            )}
            {decoded && (
              <div className="text-[#00FF00] text-xl font-bold mt-4 animate-pulse">
                🎂🎉
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedPage;
