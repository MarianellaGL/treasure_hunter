import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TERMINAL_MESSAGES: Record<string, string[]> = {
  "1": [
    "[SISTEMA] Pista 1 completada exitosamente.",
    "[SISTEMA] Redirigiendo al siguiente acertijo...",
    "[ADVERTENCIA] No será tan fácil la próxima vez...",
  ],
  "2": [
    "[SISTEMA] Pista 2 completada exitosamente.",
    "[SISTEMA] Redirigiendo al siguiente acertijo...",
    "[ADVERTENCIA] El sistema se está volviendo más inteligente...",
  ],
  "3": [
    "[SISTEMA] Pista 3 completada exitosamente.",
    "[SISTEMA] Redirigiendo al siguiente acertijo...",
    "[ADVERTENCIA] Los enigmas se intensifican...",
  ],
  "4": [
    "[SISTEMA] Pista 4 completada exitosamente.",
    "[SISTEMA] Redirigiendo al siguiente acertijo...",
    "[ADVERTENCIA] El desafío aumenta exponencialmente...",
  ],
  "5": [
    "[SISTEMA] Pista 5 completada exitosamente.",
    "[SISTEMA] Redirigiendo al siguiente acertijo...",
    "[ADVERTENCIA] ¿Podrás mantener el ritmo?",
  ],
  "6": [
    "[SISTEMA] Pista 6 completada exitosamente.",
    "[SISTEMA] Redirigiendo al siguiente acertijo...",
    "[ADVERTENCIA] El sistema detecta un hacker experimentado...",
  ],
  "7": [
    "[SISTEMA] Pista 7 completada exitosamente.",
    "[SISTEMA] Redirigiendo al siguiente acertijo...",
    "[ADVERTENCIA] Los últimos niveles son legendarios...",
  ],
  "8": [
    "[SISTEMA] Pista 8 completada exitosamente.",
    "[SISTEMA] Redirigiendo al siguiente acertijo...",
    "[ADVERTENCIA] Solo los mejores llegan hasta aquí...",
  ],
  "9": [
    "[SISTEMA] Pista 9 completada exitosamente.",
    "[SISTEMA] Redirigiendo al siguiente acertijo...",
    "[ADVERTENCIA] El desafío final te espera...",
  ],
  "10": [
    "[SISTEMA] Pista 10 completada exitosamente.",
    "[SISTEMA] Redirigiendo al siguiente acertijo...",
    "[ADVERTENCIA] ¡Has alcanzado el nivel máximo!",
  ],
};

const TerminalPage: React.FC = () => {
  const { clueId } = useParams<{ clueId: string }>();
  const navigate = useNavigate();
  const [shownMessages, setShownMessages] = useState<string[]>([]);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const messages = TERMINAL_MESSAGES[clueId || "1"] || [
      "[SISTEMA] Cargando...",
      "[SISTEMA] Acceso concedido.",
    ];
    let idx = 0;
    setShownMessages([]);
    setShowSpinner(false);
    const interval = setInterval(() => {
      setShownMessages((prev) => [...prev, messages[idx]]);
      idx++;
      if (idx >= messages.length) {
        clearInterval(interval);
        setShowSpinner(true);
        setTimeout(() => {
          navigate(`/clue/${clueId}`);
        }, 1200);
      }
    }, 1100);
    return () => clearInterval(interval);
  }, [clueId, navigate]);

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center">
      <div className="neobrutal-card max-w-md w-full mx-auto mt-16 mb-16 p-6">
        <div className="terminal-boot" style={{ minHeight: 180 }}>
          {shownMessages.map((msg, i) => (
            <div
              key={i}
              className="boot-message matrix-text"
              style={{
                animation: `fadeInUp 0.7s cubic-bezier(.39,.575,.56,1) both`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              {msg}
            </div>
          ))}
          {!showSpinner && <div className="boot-cursor">_</div>}
        </div>
        {showSpinner && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="matrix-spinner mb-2"></div>
            <div className="text-[#00FF00] text-sm font-mono opacity-80">
              Cargando pista...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalPage;
