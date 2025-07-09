import { useState, useEffect } from "react";
import type { HackInterfaceProps } from "../types/game";
import CodeChallengeInterface from "./CodeChallengeInterface";
import { codeChallenges } from "../utils/codeChallenges";

const HackInterface: React.FC<HackInterfaceProps> = ({
  clue,
  progress,
  onProgressChange,
  onComplete,
}) => {
  const [currentHack, setCurrentHack] = useState<
    "decrypt" | "bypass" | "override" | "code" | "special"
  >("decrypt");
  const [decryptCode, setDecryptCode] = useState("");
  const [decryptError, setDecryptError] = useState("");
  const [bypassSequence, setBypassSequence] = useState<string[]>([]);
  const [bypassError, setBypassError] = useState("");
  const [overrideAttempts, setOverrideAttempts] = useState(0);
  const [overrideError, setOverrideError] = useState("");
  const [specialAnswer, setSpecialAnswer] = useState("");
  const [specialError, setSpecialError] = useState("");

  // Códigos correctos para cada tipo de hack
  const correctCodes = {
    decrypt: "H4CK3R_2024",
    bypass: ["RED", "GREEN", "BLUE", "YELLOW"],
    override: 3,
  };

  useEffect(() => {
    // Para una sola pista, mostrar solo el hack requerido
    if (clue.hackType) {
      setCurrentHack(clue.hackType);
    }
  }, [clue.hackType]);

  const handleDecryptSubmit = () => {
    if (decryptCode.trim() === correctCodes.decrypt) {
      setDecryptError("");
      onProgressChange(100);
      setTimeout(() => {
        onComplete();
      }, 1000);
    } else {
      setDecryptError("Código incorrecto. Intenta de nuevo.");
    }
  };

  const handleSpecialSubmit = () => {
    if (specialAnswer.trim().toLowerCase() === clue.answer.toLowerCase()) {
      setSpecialError("");
      onProgressChange(100);
      setTimeout(() => {
        onComplete();
      }, 1000);
    } else {
      setSpecialError("Respuesta incorrecta. Intenta de nuevo.");
    }
  };

  const handleBypassClick = (color: string) => {
    const newSequence = [...bypassSequence, color];
    setBypassSequence(newSequence);

    if (newSequence.length === correctCodes.bypass.length) {
      const isCorrect = newSequence.every(
        (c, i) => c === correctCodes.bypass[i]
      );
      if (isCorrect) {
        setBypassError("");
        onProgressChange(100);
        setTimeout(() => {
          onComplete();
        }, 1000);
        setBypassSequence([]);
      } else {
        setBypassError("Secuencia incorrecta. Intenta de nuevo.");
        setBypassSequence([]);
      }
    }
  };

  const handleOverrideAttempt = () => {
    const newAttempts = overrideAttempts + 1;
    setOverrideAttempts(newAttempts);

    if (newAttempts === correctCodes.override) {
      setOverrideError("");
      onProgressChange(100);
      setTimeout(() => {
        onComplete();
      }, 1000);
    } else {
      setOverrideError(
        `Intento ${newAttempts}/${correctCodes.override}. Continúa...`
      );
    }
  };

  const renderDecrypt = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-[#00FF00] mb-6">
        🔓 DECRYPT INTERFACE
      </h3>

      <div className="bg-black border-2 border-[#00FF00] p-6 rounded">
        <div className="text-[#00FF00] text-base mb-4 font-mono">
          <div>// Sistema de encriptación detectado</div>
          <div>// Nivel de seguridad: EXTREMO</div>
          <div>// Ingresa el código de acceso:</div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-[#00FF00] text-xl font-mono">$</span>
          <input
            type="text"
            value={decryptCode}
            onChange={(e) => setDecryptCode(e.target.value.toUpperCase())}
            placeholder="Ingresa el código..."
            className="flex-1 bg-black border-2 border-[#00FF00] text-[#00FF00] px-4 py-3 rounded font-mono text-lg"
            maxLength={12}
            onKeyPress={(e) => e.key === "Enter" && handleDecryptSubmit()}
          />
        </div>

        <button
          onClick={handleDecryptSubmit}
          className="neobrutal-btn text-lg px-6 py-3 w-full"
        >
          🔓 EJECUTAR DECRYPT
        </button>

        {decryptError && (
          <div className="text-red-400 text-base mt-4 font-mono bg-red-900/20 p-3 rounded border border-red-400">
            ❌ {decryptError}
          </div>
        )}
      </div>

      <div className="text-white text-base space-y-3 bg-gray-900/50 p-4 rounded border border-gray-600">
        <p>
          💡 <b>Pista:</b> El código es una combinación de letras y números
        </p>
        <p>
          🔍 <b>Formato:</b> LETRAS_NÚMEROS (letras mayúsculas, números, guión
          bajo)
        </p>
        <p>
          ⚡ <b>Dificultad:</b> EXTREMA - Solo para hackers expertos
        </p>
      </div>
    </div>
  );

  const renderBypass = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-[#00FF00] mb-6">
        🔄 BYPASS INTERFACE
      </h3>

      <div className="bg-black border-2 border-[#00FF00] p-6 rounded">
        <div className="text-[#00FF00] text-base mb-6 font-mono">
          // Secuencia de colores requerida
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {["RED", "GREEN", "BLUE", "YELLOW"].map((color) => (
            <button
              key={color}
              onClick={() => handleBypassClick(color)}
              className="neobrutal-btn text-lg py-4 font-bold"
              style={{
                backgroundColor:
                  color === "RED"
                    ? "#ff0000"
                    : color === "GREEN"
                    ? "#00ff00"
                    : color === "BLUE"
                    ? "#0000ff"
                    : "#ffff00",
                color: color === "YELLOW" ? "#000" : "#fff",
              }}
            >
              {color}
            </button>
          ))}
        </div>

        <div className="text-[#00FF00] text-base mb-4 font-mono">
          Secuencia: {bypassSequence.join(" → ") || "Vacía"}
        </div>

        {bypassError && (
          <div className="text-red-400 text-base mt-4 font-mono bg-red-900/20 p-3 rounded border border-red-400">
            ❌ {bypassError}
          </div>
        )}
      </div>

      <div className="text-white text-base space-y-3 bg-gray-900/50 p-4 rounded border border-gray-600">
        <p>
          💡 <b>Pista:</b> Sigue el patrón de colores en el orden correcto
        </p>
        <p>
          🔍 <b>Secuencia:</b> Rojo → Verde → Azul → Amarillo
        </p>
        <p>
          ⚡ <b>Dificultad:</b> EXTREMA - Memoria y precisión requeridas
        </p>
      </div>
    </div>
  );

  const renderOverride = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-[#00FF00] mb-6">
        ⚡ OVERRIDE INTERFACE
      </h3>

      <div className="bg-black border-2 border-[#00FF00] p-6 rounded">
        <div className="text-[#00FF00] text-base mb-6 font-mono">
          <div>// Sistema de override detectado</div>
          <div>
            // Intentos: {overrideAttempts}/{correctCodes.override}
          </div>
        </div>

        <button
          onClick={handleOverrideAttempt}
          className="neobrutal-btn text-lg px-8 py-4 w-full"
        >
          ⚡ INTENTAR OVERRIDE
        </button>

        {overrideError && (
          <div className="text-yellow-400 text-base mt-4 font-mono bg-yellow-900/20 p-3 rounded border border-yellow-400">
            ⚠️ {overrideError}
          </div>
        )}
      </div>

      <div className="text-white text-base space-y-3 bg-gray-900/50 p-4 rounded border border-gray-600">
        <p>
          💡 <b>Pista:</b> Necesitas 3 intentos para completar el override
        </p>
        <p>
          🔍 <b>Progreso:</b> {overrideAttempts}/{correctCodes.override}{" "}
          intentos
        </p>
        <p>
          ⚡ <b>Dificultad:</b> EXTREMA - Persistencia requerida
        </p>
      </div>
    </div>
  );

  const renderSpecial = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-[#00FF00] mb-6">
        🎯 ENIGMA INTERFACE
      </h3>

      <div className="bg-black border-2 border-[#00FF00] p-6 rounded">
        <div className="text-[#00FF00] text-base mb-4 font-mono">
          <div>// Enigma especial detectado</div>
          <div>// Nivel de seguridad: LEGENDARIO</div>
          <div>// Ingresa la respuesta secreta:</div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-[#00FF00] text-xl font-mono">$</span>
          <input
            type="text"
            value={specialAnswer}
            onChange={(e) => setSpecialAnswer(e.target.value)}
            placeholder="Ingresa la respuesta..."
            className="flex-1 bg-black border-2 border-[#00FF00] text-[#00FF00] px-4 py-3 rounded font-mono text-lg"
            onKeyPress={(e) => e.key === "Enter" && handleSpecialSubmit()}
          />
        </div>

        <button
          onClick={handleSpecialSubmit}
          className="neobrutal-btn text-lg px-6 py-3 w-full"
        >
          🎯 EJECUTAR DECRYPT
        </button>

        {specialError && (
          <div className="text-red-400 text-base mt-4 font-mono bg-red-900/20 p-3 rounded border border-red-400">
            ❌ {specialError}
          </div>
        )}
      </div>

      <div className="text-white text-base space-y-3 bg-gray-900/50 p-4 rounded border border-gray-600">
        <p>
          💡 <b>Pista:</b> La respuesta está en la pista principal
        </p>
        <p>
          🔍 <b>Formato:</b> Palabras en minúsculas con guiones bajos
        </p>
        <p>
          ⚡ <b>Dificultad:</b> LEGENDARIA - Solo para los más astutos
        </p>
      </div>
    </div>
  );

  // Renderizar desafío de código si es necesario
  if (currentHack === "code") {
    const challenge = codeChallenges[clue.id];
    if (challenge) {
      return (
        <div className="neobrutal-card">
          <div className="mb-6">
            <h2 className="neobrutal-title text-3xl mb-4">HACK INTERFACE</h2>
            <div className="hack-progress-bar mb-4">
              <div
                className="hack-progress-inner"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-white text-lg font-mono">
              Progreso: {progress}% | Fase: CODE CHALLENGE
            </div>
          </div>

          <CodeChallengeInterface
            challenge={challenge}
            onComplete={onComplete}
            onProgressChange={onProgressChange}
          />
        </div>
      );
    }
  }

  return (
    <div className="neobrutal-card">
      <div className="mb-6">
        <h2 className="neobrutal-title text-3xl mb-4">HACK INTERFACE</h2>
        <div className="hack-progress-bar mb-4">
          <div
            className="hack-progress-inner"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-white text-lg font-mono">
          Progreso: {progress}% | Fase: {currentHack.toUpperCase()}
        </div>
      </div>

      {currentHack === "decrypt" && renderDecrypt()}
      {currentHack === "bypass" && renderBypass()}
      {currentHack === "override" && renderOverride()}
      {currentHack === "special" && renderSpecial()}
    </div>
  );
};

export default HackInterface;
 