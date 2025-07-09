import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useGameState } from "../hooks/useGameState";
import CodeChallengeInterface from "../components/CodeChallengeInterface";
import { codeChallenges } from "../utils/codeChallenges";

const CluePage: React.FC = () => {
  const navigate = useNavigate();
  const { clueId } = useParams<{ clueId: string }>();
  const { clues } = useGameState();
  const { foundClues, addFoundClue, setHackProgress } = useGameStore();

  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hackAnswer, setHackAnswer] = useState("");
  const [hackError, setHackError] = useState("");
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [progressKey, setProgressKey] = useState(0); // Para forzar re-render

  const currentClueId = parseInt(clueId || "1");
  const currentClue = clues.find((c) => c.id === currentClueId);
  const isFound = foundClues.includes(currentClueId);

  useEffect(() => {
    if (!currentClue) {
      navigate("/");
      return;
    }
    if (isFound) setIsCompleted(true);
    // Resetear progreso de hack al cambiar de pista
    setHackProgress(0);
  }, [currentClue, isFound, navigate, setHackProgress]);

  // Sincronizar estado local con el store
  useEffect(() => {
    if (isFound && !isCompleted) {
      setIsCompleted(true);
    }
  }, [isFound, isCompleted]);

  // Debug: loggear cambios en el estado
  useEffect(() => {
    setProgressKey((prev) => prev + 1); // Forzar re-render
  }, [foundClues, clues.length]);

  const handleHackComplete = () => {
    if (currentClue) {
      // La pista ya se agregó en handleHackSubmit, solo marcar como completada
      setIsCompleted(true);

      // Para pistas tipo "code", no navegar automáticamente, mostrar botón SIGUIENTE
      // Para pistas tipo "special", navegar automáticamente
      if (currentClue.hackType === "special") {
        if (currentClueId === clues.length) {
          setTimeout(() => navigate("/completed"), 2000);
        } else {
          const nextClueId = currentClueId + 1;
          setTimeout(() => navigate(`/terminal/${nextClueId}`), 1500);
        }
      }
      // Si es pista tipo "code", el avance será manual con el botón SIGUIENTE
    }
  };

  const handleHackSubmit = () => {
    if (hackAnswer.trim().toLowerCase() === currentClue?.answer.toLowerCase()) {
      setHackError("");
      // Agregar la pista al store inmediatamente
      addFoundClue(currentClueId);
      setShowSuccessScreen(true);

      // Después de mostrar la pantalla de éxito, continuar con el flujo normal
      setTimeout(() => {
        setShowSuccessScreen(false);
        if (currentClue?.hackType === "special") {
          // Para pistas tipo "special", ir directamente a TerminalPage
          if (currentClueId === clues.length) {
            navigate("/completed");
          } else {
            const nextClueId = currentClueId + 1;
            navigate(`/terminal/${nextClueId}`);
          }
        } else {
          // Para pistas tipo "code", usar handleHackComplete
          handleHackComplete();
        }
      }, 1500);
    } else {
      setHackError("Respuesta incorrecta. Intenta de nuevo.");
    }
  };

  const handleBack = () => navigate("/");
  const handleNext = () => {
    const nextClueId = currentClueId + 1;
    if (nextClueId <= clues.length) navigate(`/terminal/${nextClueId}`);
    else navigate("/completed");
  };

  if (!currentClue) return null;

  // Progreso en porcentaje
  const progress = (foundClues.length / clues.length) * 100;

  // Determinar qué botón mostrar
  const showHackButton = currentClue.hackRequired && !isCompleted;
  const showNextButton =
    isCompleted &&
    currentClueId < clues.length &&
    currentClue.hackType === "code";
  const showBackButton = !currentClue.hackRequired && !isCompleted; // Solo mostrar VOLVER si no hay hack y no está completada

  // Para pistas tipo "code", mostrar CodeChallengeInterface
  if (currentClue.hackType === "code" && !isCompleted) {
    const challenge = codeChallenges[currentClue.id];
    if (challenge) {
      return (
        <CodeChallengeInterface
          challenge={challenge}
          onComplete={handleHackComplete}
          onProgressChange={setHackProgress}
        />
      );
    }
  }

  // Pantalla de éxito
  if (showSuccessScreen) {
    const successLines = [
      "",
      "✅ Respuesta correcta",
      "✅ Enigma resuelto",
      "✅ Acceso concedido",
      "",
      "🎯 Pista completada exitosamente",
      "",
    ];

    const generateAsciiBox = (title: string, lines: string[]) => {
      const boxWidth = 60;
      const topBorder = "╔" + "═".repeat(boxWidth - 2) + "╗";
      const bottomBorder = "╚" + "═".repeat(boxWidth - 2) + "╝";
      const separator = "╠" + "═".repeat(boxWidth - 2) + "╣";
      const titlePadding = Math.max(0, boxWidth - title.length - 2);
      const leftPadding = Math.floor(titlePadding / 2);
      const rightPadding = titlePadding - leftPadding;
      const titleLine =
        "║" + " ".repeat(leftPadding) + title + " ".repeat(rightPadding) + "║";
      const contentLines = lines.map((line) => {
        return (
          "║ " +
          line +
          " ".repeat(Math.max(0, boxWidth - line.length - 4)) +
          " ║"
        );
      });
      return [
        topBorder,
        titleLine,
        separator,
        ...contentLines,
        bottomBorder,
      ].join("\n");
    };

    return (
      <div className="min-h-screen w-full bg-black flex flex-col justify-center items-center p-4">
        <div
          className="text-[#00FF00] font-mono text-sm whitespace-pre"
          style={{ fontFamily: "monospace" }}
        >
          {generateAsciiBox("ÉXITO", successLines)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      {/* Barra de progreso estática (sin animaciones) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 20,
          height: 16,
          background: "black",
        }}
      >
        <div
          style={{
            height: 12,
            background: "#333",
            border: "2px solid #00FF00",
          }}
        >
          <div
            key={progressKey}
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#00FF00",
              transition: "width 0.5s ease-in-out",
              animation: "none",
            }}
          />
        </div>
      </div>

      {/* Contenido principal simple */}
      <main
        className="flex-1 flex flex-col justify-center items-center px-4 w-full max-w-md mx-auto"
        style={{
          paddingTop: 24,
          paddingBottom: showHackButton || showNextButton ? 96 : 24,
          width: "100%",
        }}
      >
        <div className="neobrutal-card w-full mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2 py-1 rounded bg-black border-2 border-[#00FF00] text-[#00FF00]">
              {currentClue.difficulty.toUpperCase()}
            </span>
            {currentClue.hackRequired && (
              <span className="text-xs font-bold px-2 py-1 rounded bg-[#00FF00] text-black border-2 border-black">
                {currentClue.hackType === "special" ? "ENIGMA" : "HACK"}
              </span>
            )}
            {isFound && <span className="icon-xl">✔️</span>}
          </div>
          <h3 className="neobrutal-title text-lg mb-4 text-center">PISTA</h3>
          <div className="text-white text-base italic text-center leading-relaxed px-2">
            "{currentClue.hint}"
          </div>
        </div>

        {/* Input para hack si corresponde */}
        {showHackButton && (
          <div className="neobrutal-card w-full mb-4">
            <h3 className="neobrutal-title text-lg mb-4 text-center">
              HACK INTERFACE
            </h3>
            <div className="bg-black border-2 border-[#00FF00] p-6 rounded">
              <div className="text-[#00FF00] text-base mb-4 font-mono">
                <div>// Sistema de seguridad detectado</div>
                <div>// Nivel: {currentClue.difficulty.toUpperCase()}</div>
                <div>// Ingresa la respuesta:</div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#00FF00] text-xl font-mono">$</span>
                <input
                  type="text"
                  value={hackAnswer}
                  onChange={(e) => setHackAnswer(e.target.value)}
                  placeholder="Ingresa la respuesta..."
                  className="flex-1 px-4 py-3 text-lg neobrutal-input"
                  style={{
                    border: "4px solid #00FF00",
                    background: "black",
                    color: "#00FF00",
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleHackSubmit()}
                />
              </div>

              {hackError && (
                <div className="text-red-400 text-base mb-4 font-mono bg-red-900/20 p-3 rounded border border-red-400">
                  ❌ {hackError}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Botón VOLVER si no hay hack */}
      {showBackButton && (
        <div className="floating-bottom-menu w-full flex flex-row items-stretch justify-stretch">
          <button
            onClick={handleBack}
            className="neobrutal-btn flex-1 btn-100 w-full clue-page-btn"
          >
            VOLVER
          </button>
        </div>
      )}
      {/* Botón EJECUTAR DECRYPT si hay hack */}
      {showHackButton && (
        <div className="floating-bottom-menu w-full flex flex-row items-stretch justify-stretch">
          <button
            onClick={handleHackSubmit}
            className="neobrutal-btn flex-1 btn-100 w-full clue-page-btn"
          >
            🔓 EJECUTAR DECRYPT
          </button>
        </div>
      )}
      {/* Botón SIGUIENTE si corresponde */}
      {showNextButton && (
        <div className="floating-bottom-menu w-full flex flex-row items-stretch justify-stretch">
          <button
            onClick={handleNext}
            className="neobrutal-btn flex-1 btn-100 w-full clue-page-btn"
          >
            SIGUIENTE
          </button>
        </div>
      )}
      {/* Botón PISTA ENCONTRADA para pistas tipo "special" */}
      {/* showSpecialButton is removed, so this block is removed */}
    </div>
  );
};

export default CluePage;
