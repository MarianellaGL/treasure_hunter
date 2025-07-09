import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";

const IntroPage: React.FC = () => {
  const navigate = useNavigate();
  const { startGame } = useGameStore();

  const handleStart = () => {
    startGame();
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="neobrutal-card text-center mb-6">
            <h1 className="neobrutal-title text-3xl md:text-4xl mb-4">
              TREASURE HUNTER
            </h1>
            <div className="mb-4">
              <span className="font-bold text-[#00FF00] text-lg md:text-xl">
                Escape Room Hacker
              </span>
            </div>
          </div>

          <div className="neobrutal-card mb-6">
            <h2 className="neobrutal-title text-xl mb-3">MISIÓN</h2>
            <div className="text-white text-base space-y-3">
              <p>
                <span className="font-bold text-[#00FF00]">SITUACIÓN:</span> Has
                sido contratado como hacker ético para infiltrarte en un sistema
                de seguridad de alta tecnología.
              </p>
              <p>
                <span className="font-bold text-[#00FF00]">OBJETIVO:</span>{" "}
                Encontrar la pista oculta que contiene información crítica sobre
                el sistema.
              </p>
              <p>
                <span className="font-bold text-[#00FF00]">ADVERTENCIA:</span>{" "}
                Solo tienes una oportunidad. Si fallas, el sistema se bloqueará
                permanentemente.
              </p>
            </div>
          </div>

          <div className="neobrutal-card mb-6">
            <h3 className="neobrutal-title text-lg mb-3">INSTRUCCIONES</h3>
            <div className="text-white text-sm space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-[#00FF00] font-bold">1.</span>
                <span>Navega por las diferentes secciones del sistema</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00FF00] font-bold">2.</span>
                <span>
                  Completa los desafíos de hacking cuando sea necesario
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00FF00] font-bold">3.</span>
                <span>Encuentra la pista oculta para completar la misión</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00FF00] font-bold">4.</span>
                <span>El terminal te mostrará el progreso en tiempo real</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleStart}
              className="neobrutal-btn text-lg py-4 px-8"
            >
              INICIAR MISIÓN
            </button>
          </div>

          <div className="text-center mt-6">
            <div className="text-xs text-[#00FF00] opacity-80">
              <p>Sistema: Linux Kernel 5.15.0 | Usuario: hacker_anonymous</p>
              <p>Permisos: ROOT | Estado: LISTO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
