import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useGameState } from "../hooks/useGameState";
import { useState, useEffect } from "react";
import { motion, animate } from "framer-motion";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { clues } = useGameState();
  const { foundClues, startGame, clearStorage, removeFoundClue } =
    useGameStore();
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const hasProgress = foundClues.length > 0;
  const nextClueId = hasProgress
    ? Array.from({ length: clues.length }, (_, i) => i + 1).find(
        (id) => !foundClues.includes(id)
      ) || 1
    : 1;

  // Animación del contador de progreso con Framer Motion
  useEffect(() => {
    const controls = animate(animatedProgress, foundClues.length, {
      duration: 1,
      onUpdate: (v) => setAnimatedProgress(Math.round(v)),
    });
    return controls.stop;
  }, [foundClues.length]);

  const handleContinue = () => {
    navigate(`/terminal/${nextClueId}`);
  };

  const handleStartNew = () => {
    startGame();
    navigate("/terminal/1");
  };

  const handleClearStorage = () => {
    clearStorage();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center">
      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col justify-center items-center">
        {/* Header Principal */}
        <div className="mb-6 w-full flex flex-col items-center justify-center">
          <div className="neobrutal-card text-center w-full max-w-md mx-auto">
            <h1
              className={`neobrutal-title text-3xl md:text-4xl mb-4 glitch-text ${
                hasProgress ? "animate-glitch" : ""
              }`}
            >
              TREASURE HUNTER
            </h1>
            <div className="mb-4">
              <span className="font-bold text-[#00FF00] text-lg md:text-xl matrix-text">
                Escape Room Hacker
              </span>
            </div>

            {hasProgress ? (
              <div className="mb-4 text-white text-base space-y-2">
                <p>
                  🎯 <b>Progreso:</b> {foundClues.length} de {clues.length}{" "}
                  pistas encontradas
                </p>
                <p>
                  👥 <b>Asistencia:</b> 3 personas
                </p>
                <p>
                  ⚡ <b>Dificultad:</b> EXTREMA
                </p>
              </div>
            ) : (
              <div className="mb-4 text-white text-base space-y-2">
                <p>
                  🎯 <b>Objetivo:</b> Encontrar {clues.length} pistas ocultas
                </p>
                <p>
                  👥 <b>Asistencia:</b> 6 personas
                </p>
                <p>
                  ⚡ <b>Dificultad:</b> EXTREMA
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Progreso visual con animación */}
        <div className="mb-6 w-full flex flex-col items-center justify-center">
          <div className="neobrutal-card flex flex-col items-center py-6 w-full max-w-md mx-auto">
            <h3 className="neobrutal-title text-lg mb-3">PROGRESO</h3>
            <div className="w-full max-w-xs mb-2">
              <div
                className={`progress-bar scan-line ${
                  foundClues.length === 0 ? "loading" : ""
                } ${foundClues.length === clues.length ? "completed" : ""}`}
              >
                <motion.div
                  className="progress-bar-inner animate-pulse-glow"
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      foundClues.length === 0
                        ? "30%"
                        : `${(foundClues.length / clues.length) * 100}%`,
                  }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                ></motion.div>
              </div>
            </div>
            <div className="text-xs text-white text-center mt-2">
              <motion.span
                className="font-bold text-[#00FF00]"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                key={animatedProgress}
              >
                {animatedProgress}
              </motion.span>{" "}
              de {clues.length} pistas encontradas
            </div>
            {/* Indicadores de pistas */}
            <div className="progress-indicators">
              {clues.map((_, index) => (
                <div
                  key={index}
                  className={`progress-indicator ${
                    foundClues.includes(index + 1) ? "completed" : "pending"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Botones flotantes tipo menú app móvil */}
      <div
        className={`floating-bottom-menu w-full flex flex-row items-stretch justify-stretch${
          foundClues.length === 0 ? " only-btn-100" : ""
        }`}
      >
        {foundClues.length === 0 ? (
          <button
            onClick={handleStartNew}
            className="neobrutal-btn flex-1 btn-100 w-full"
          >
            HACKEA LA MATRIX
          </button>
        ) : (
          <>
            <button
              onClick={handleContinue}
              className="neobrutal-btn flex-1 btn-33 w-full"
            >
              CONTINUAR
            </button>
            <button
              onClick={handleClearStorage}
              className="neobrutal-btn flex-1 btn-33 w-full"
            >
              LIMPIAR DATOS
            </button>
          </>
        )}
      </div>

      {/* Footer fijo */}
      <footer
        style={{
          position: "fixed",
          bottom: "calc(70px + 16px)", // Altura del menú flotante + margen
          left: 0,
          width: "100%",
          zIndex: 10,
          pointerEvents: "none",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.95)",
            color: "#00FF00",
            fontSize: "0.85rem",
            borderRadius: "8px",
            padding: "16px 18px",
            opacity: 0.85,
            pointerEvents: "auto",
            boxShadow: "0 2px 8px #000",
            marginBottom: 0,
            textAlign: "center",
          }}
        >
          <div>Sistema: Linux Kernel 5.15.0 | Usuario: hacker_anonymous</div>
          <div>
            Permisos: ROOT | Estado: {hasProgress ? "EN PROGRESO" : "LISTO"}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
