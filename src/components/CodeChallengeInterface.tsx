import { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import type { CodeChallenge } from "../types/game";

// Hook para Pyodide singleton
function usePyodideSingleton() {
  const [pyodide, setPyodide] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (pyodide) return pyodide;
      setIsLoading(true);
      try {
        // Esperar a que window.loadPyodide esté disponible
        let tries = 0;
        while (
          !(window as unknown as { loadPyodide?: unknown }).loadPyodide &&
          tries < 100
        ) {
          await new Promise((res) => setTimeout(res, 100));
          tries++;
        }
        if (!(window as unknown as { loadPyodide?: unknown }).loadPyodide)
          throw new Error("Pyodide no disponible tras esperar");
        const pyodideInstance = await (
          window as unknown as {
            loadPyodide: (opts: {
              indexURL: string;
            }) => Promise<Record<string, unknown>>;
          }
        ).loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });
        await (
          pyodideInstance as { loadPackage: (pkg: string) => Promise<void> }
        ).loadPackage("numpy");
        setPyodide(pyodideInstance);
        return pyodideInstance;
      } catch (error) {
        console.error("Error loading Pyodide:", error);
        return null;
      } finally {
        setIsLoading(false);
      }
    }
    if (typeof window !== "undefined") {
      load();
    }
  }, [pyodide]);

  return { pyodide, isLoading };
}

interface CodeChallengeInterfaceProps {
  challenge: CodeChallenge;
  onComplete: () => void;
  onProgressChange: (progress: number) => void;
}

const CodeChallengeInterface: React.FC<CodeChallengeInterfaceProps> = ({
  challenge,
  onComplete,
  onProgressChange,
}) => {
  const [currentCode, setCurrentCode] = useState(challenge.initialCode);
  const [attempts, setAttempts] = useState(0);
  const [lastOutput, setLastOutput] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  // Referencia y estado para ancho dinámico del cuadro ASCII
  const asciiBoxRef = useRef<HTMLDivElement>(null);
  const [asciiWidth, setAsciiWidth] = useState(60); // valor inicial

  const { pyodide, isLoading: pyodideLoading } = usePyodideSingleton();

  useEffect(() => {
    const updateAsciiWidth = () => {
      if (asciiBoxRef.current) {
        const pxWidth = asciiBoxRef.current.offsetWidth;
        // Aproximadamente 8px por carácter a 12px monospace
        let chars = Math.floor(pxWidth / 8);
        chars = Math.max(40, Math.min(chars, 80));
        setAsciiWidth(chars);
      }
    };
    updateAsciiWidth();
    window.addEventListener("resize", updateAsciiWidth);
    return () => window.removeEventListener("resize", updateAsciiWidth);
  }, []);

  useEffect(() => {
    // Calcular progreso basado en intentos
    const progress = Math.min((attempts * 10) / 100, 0.9);
    onProgressChange(progress * 100);
  }, [attempts, onProgressChange]);

  // Reiniciar estado cada vez que cambia el challenge (por ejemplo, al navegar entre pistas)
  useEffect(() => {
    setCurrentCode(challenge.initialCode);
    setAttempts(0);
    setLastOutput("");
    setShowTerminal(true);
    setIsCompleted(false);
    // No tocar isRunning ni pyodideLoading aquí
  }, [challenge]);

  // Debug: loggear cambios en el estado
  useEffect(() => {
    console.log(
      "Estado actualizado - lastOutput:",
      lastOutput,
      "showTerminal:",
      showTerminal,
      "attempts:",
      attempts
    );
  }, [lastOutput, showTerminal, attempts]);

  // Timeout de seguridad para Pyodide
  useEffect(() => {
    if (pyodideLoading) {
      const timeout = setTimeout(() => {
        if (pyodideLoading) {
          setLastOutput(
            "Error: Pyodide está tardando demasiado en cargar. Intenta recargar la página."
          );
          setIsRunning(false);
        }
      }, 15000); // 15 segundos
      return () => clearTimeout(timeout);
    }
  }, [pyodideLoading]);

  // Función para generar cuadros ASCII adaptativos con ancho dinámico
  const padLine = (line: string, width: number) =>
    line + " ".repeat(Math.max(0, width - line.length));
  const generateAsciiBox = (title: string, lines: string[], width: number) => {
    const boxWidth = width;
    const topBorder = "╔" + "═".repeat(boxWidth - 2) + "╗";
    const bottomBorder = "╚" + "═".repeat(boxWidth - 2) + "╝";
    const separator = "╠" + "═".repeat(boxWidth - 2) + "╣";
    // Centrar el título
    const titlePadding = Math.max(0, boxWidth - title.length - 2);
    const leftPadding = Math.floor(titlePadding / 2);
    const rightPadding = titlePadding - leftPadding;
    const titleLine =
      "║" + " ".repeat(leftPadding) + title + " ".repeat(rightPadding) + "║";
    // Generar líneas de contenido, todas del mismo ancho
    const contentLines = lines.map((line) => {
      return "║ " + padLine(line, boxWidth - 4) + " ║";
    });
    return [
      topBorder,
      titleLine,
      separator,
      ...contentLines,
      bottomBorder,
    ].join("\n");
  };

  const handleCodeRun = async (code: string) => {
    if (isRunning || pyodideLoading) return;
    if (!pyodide && challenge.language === "python") {
      setLastOutput(
        "Error: El entorno Python no está disponible. Intenta recargar la página o espera unos segundos."
      );
      setShowTerminal(true);
      setIsRunning(false);
      return;
    }
    setIsRunning(true);
    setAttempts((prev) => prev + 1);
    setShowTerminal(false); // Ocultar terminal

    if (challenge.language === "python") {
      try {
        const codeToRun = `${code}\n__result = solve_dream_matrix()`;
        let result = "";
        try {
          await (
            pyodide as {
              runPythonAsync: (code: string) => Promise<unknown>;
              globals: { get: (name: string) => unknown };
            }
          ).runPythonAsync(codeToRun);
          result = String(
            (
              pyodide as {
                runPythonAsync: (code: string) => Promise<unknown>;
                globals: { get: (name: string) => unknown };
              }
            ).globals.get("__result")
          );
        } catch (err: unknown) {
          setLastOutput(
            `Error de ejecución en Python:\n${
              err instanceof Error ? err.message : String(err)
            }`
          );
          setIsRunning(false);
          return;
        }
        if (result && result.trim() === "dream_sequence_304") {
          setIsCompleted(true);
          onProgressChange(100);
          const successLines = [
            "",
            "✅ Código correcto detectado",
            "✅ Patrón Fibonacci identificado",
            "✅ Acceso al sistema concedido",
            "✅ Resultado: dream_sequence_304",
            "",
            "🎯 El dormitorio ha sido hackeado exitosamente",
            "🔓 Continuando a la siguiente pista...",
            "",
          ];
          setLastOutput(
            generateAsciiBox("HACK COMPLETADO", successLines, asciiWidth)
          );
          setTimeout(() => {
            onComplete();
          }, 3000);
        } else {
          const errorLines = [
            "",
            "❌ Código incorrecto detectado",
            "❌ Patrón no identificado",
            "❌ Acceso denegado",
            "",
            `🔍 Output recibido: '${result}'`,
            `🔍 Output (trim): '${result ? result.trim() : result}'`,
            "💡 Analiza la matriz más cuidadosamente",
            "",
          ];
          setLastOutput(
            generateAsciiBox("HACK FALLIDO", errorLines, asciiWidth)
          );
        }
      } catch (err: any) {
        setLastOutput(
          `Error inesperado en la ejecución:\n${err.message || err.toString()}`
        );
      }
      setIsRunning(false);
      return;
    } else if (challenge.language === "javascript") {
      try {
        // Ejecutar JavaScript en el navegador
        let result = "";
        let consoleOutput = "";

        // Capturar console.log
        const originalConsoleLog = console.log;
        console.log = (...args) => {
          consoleOutput += args.join(" ") + "\n";
          originalConsoleLog(...args);
        };

        try {
          // Ejecutar el código JavaScript
          eval(code);

          // Buscar el último número en cualquier console.log
          if (consoleOutput.trim()) {
            const lines = consoleOutput.trim().split("\n");
            let foundNumber = null;
            for (let i = lines.length - 1; i >= 0; i--) {
              const match = lines[i].match(/(-?\d+(?:\.\d+)?)/);
              if (match) {
                foundNumber = match[1];
                break;
              }
            }
            if (foundNumber !== null) {
              result = foundNumber;
            } else {
              result = lines[lines.length - 1];
            }
          }
        } catch (err: any) {
          setLastOutput(
            `Error de ejecución en JavaScript:\n${
              err.message || err.toString()
            }`
          );
          setIsRunning(false);
          console.log = originalConsoleLog;
          return;
        }

        // Restaurar console.log
        console.log = originalConsoleLog;

        // Debug: mostrar qué se está recibiendo
        console.log("JavaScript result:", result);
        console.log("Console output:", consoleOutput);

        // Validación flexible para el resultado de JavaScript
        if (result && /\b45\b/.test(result.trim())) {
          setIsCompleted(true);
          onProgressChange(100);
          const successLines = [
            "",
            "✅ Código correcto detectado",
            "✅ Suma realizada exitosamente",
            "✅ Ubicación secreta encontrada",
            "",
            "📍 UBICACIÓN: mesa_carpinteria",
            "",
            "🎯 Busca en el garage, en la mesa de carpintería",
            "🔓 Continuando a la siguiente pista...",
            "",
          ];
          setLastOutput(
            generateAsciiBox("HACK COMPLETADO", successLines, asciiWidth)
          );
          setTimeout(() => {
            onComplete();
          }, 3000);
        } else {
          const errorLines = [
            "",
            "❌ Código incorrecto detectado",
            "❌ Suma incorrecta",
            "❌ Ubicación no encontrada",
            "",
            `🔍 Output recibido: '${result}'`,
            `🔍 Console output: '${consoleOutput.trim()}'`,
            "💡 Verifica tu suma",
            "",
          ];
          setLastOutput(
            generateAsciiBox("HACK FALLIDO", errorLines, asciiWidth)
          );
        }
      } catch (err: any) {
        setLastOutput(
          `Error inesperado en la ejecución:\n${err.message || err.toString()}`
        );
      }
      setIsRunning(false);
      return;
    }
    // ... otros lenguajes o lógica previa
    setIsRunning(false);
  };

  const handleReset = useCallback(() => {
    console.log("CLEAR ejecutado - Limpiando todo el estado");

    // Limpiar todo el estado
    setCurrentCode(challenge.initialCode);
    setAttempts(0);
    setLastOutput("");
    setShowTerminal(true);
    onProgressChange(0);
    setIsRunning(false);
    setIsCompleted(false);
    setEditorKey((prev) => prev + 1); // Forzar re-render del editor
  }, [challenge, onProgressChange]);

  // Si está completado, no mostrar nada (la pista se mostrará en CluePage)
  if (isCompleted) {
    return null;
  }

  // Tema personalizado Matrix
  const matrixTheme = {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "6A9955", fontStyle: "italic" },
      { token: "keyword", foreground: "C586C0", fontStyle: "bold" },
      { token: "string", foreground: "CE9178" },
      { token: "number", foreground: "B5CEA8" },
      { token: "operator", foreground: "D4D4D4" },
      { token: "function", foreground: "DCDCAA" },
      { token: "variable", foreground: "9CDCFE" },
      { token: "type", foreground: "4EC9B0" },
    ],
    colors: {
      "editor.background": "#000000",
      "editor.foreground": "#00FF00",
      "editor.lineHighlightBackground": "#1A1A1A",
      "editor.selectionBackground": "#264F78",
      "editor.inactiveSelectionBackground": "#3A3D41",
      "editorCursor.foreground": "#00FF00",
      "editorWhitespace.foreground": "#3E3E3E",
      "editorIndentGuide.background": "#404040",
      "editor.selectionHighlightBorder": "#007ACC",
    },
  };

  const options = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    fontFamily: "'Courier New', monospace",
    lineNumbers: "on" as const,
    roundedSelection: false,
    scrollbar: {
      vertical: "visible" as const,
      horizontal: "hidden" as const,
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 0,
    },
    readOnly: false,
    automaticLayout: true,
    wordWrap: "wordWrapColumn" as const,
    wordWrapColumn: 40,
    folding: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    glyphMargin: false,
    contextmenu: true,
    quickSuggestions: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: "on" as const,
    tabCompletion: "on" as const,
    wordBasedSuggestions: "allDocuments" as const,
    scrollBeyondLastColumn: 0,
    horizontalScrollbarSize: 0,
    overviewRulerBorder: false,
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      {/* Header de la terminal */}
      <div className="neobrutal-card w-full mb-2 md:mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold px-2 py-1 rounded bg-black border-2 border-[#00FF00] text-[#00FF00]">
            {challenge.language.toUpperCase()}
          </span>
          <span className="text-xs font-bold px-2 py-1 rounded bg-[#00FF00] text-black border-2 border-black">
            CODE HACK
          </span>
        </div>
        <h3 className="neobrutal-title text-base md:text-lg mb-2 md:mb-4 text-center">
          TERMINAL
        </h3>
        <div className="text-white text-sm md:text-base text-center leading-relaxed px-2">
          {challenge.description}
        </div>

        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-white mb-2">
            <span>Progreso del hack</span>
            <span>{Math.min(attempts * 10, 90)}%</span>
          </div>
          <div className="w-full bg-gray-800 border-2 border-[#00FF00] h-3">
            <div
              className="bg-[#00FF00] h-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(attempts * 10, 90)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Terminal con scroll responsive */}
      <div className="flex-1 px-2 md:px-4" ref={asciiBoxRef}>
        {showTerminal ? (
          <div className=" w-full mx-auto mb-2 md:mb-4">
            {/* Editor simplificado sin botones */}
            <div className="bg-black border-2 border-[#00FF00]">
              <div className="flex items-center gap-2 mb-2 p-2">
                <span className="text-base md:text-lg">💻</span>
                <span className="font-mono text-xs md:text-sm font-bold text-[#00FF00]">
                  {challenge.language.toUpperCase()}
                </span>
              </div>
              <Editor
                key={editorKey} // Add key to force re-render
                height="calc(100vh - 450px)"
                language={challenge.language}
                value={currentCode}
                onChange={(value) => setCurrentCode(value || "")}
                theme="matrix-theme"
                options={options}
                beforeMount={(monaco) => {
                  monaco.editor.defineTheme("matrix-theme", matrixTheme);
                }}
                onMount={(editor) => {
                  editor.focus();
                }}
              />
            </div>
          </div>
        ) : (
          <div className="neobrutal-card mb-2 md:mb-4 bg-black border-2 border-[#00FF00]">
            <div className="flex flex-col items-center justify-center gap-1 mb-2 p-2 border-b border-[#00FF00] w-full">
              <span className="text-base md:text-lg">🎯</span>
              <span className="font-mono text-xs md:text-sm font-bold text-[#00FF00] text-center w-full">
                RESULTADO DEL HACK
              </span>
              <span className="text-xs text-[#00FF00] opacity-70 mt-1 text-center w-full">
                Ejecución #{attempts}
              </span>
            </div>
            <div className="p-3">
              <div className="text-[#00FF00] text-xs md:text-sm font-mono">
                <pre
                  className="whitespace-pre-wrap break-words leading-relaxed overflow-x-auto w-full"
                  style={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    width: "100%",
                    minWidth: "100%",
                    maxWidth: "100%",
                    wordBreak: "break-all",
                    overflowWrap: "break-word",
                    display: "block",
                    background: "black",
                    color: "#00FF00",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {lastOutput}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Terminal Output - Solo visible cuando showTerminal es true */}
        {showTerminal && (
          <div className="neobrutal-card mb-2 md:mb-4 bg-black border-2 border-[#00FF00]">
            <div className="flex items-center gap-2 mb-2 p-2 border-b border-[#00FF00]">
              <span className="text-base md:text-lg">📤</span>
              <span className="font-mono text-xs md:text-sm font-bold text-[#00FF00]">
                TERMINAL OUTPUT
              </span>
              <span className="text-xs text-[#00FF00] opacity-70">
                {attempts > 0 ? `Ejecución #${attempts}` : "Listo"}
              </span>
            </div>
            <div className="p-3">
              <div className="text-[#00FF00] text-xs md:text-sm font-mono opacity-50 italic">
                // Presiona RUN para ejecutar el código // El output aparecerá
                aquí
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botones flotantes */}
      <div className="floating-bottom-menu w-full flex flex-row items-stretch justify-stretch">
        <button
          onClick={() => handleCodeRun(currentCode)}
          className="neobrutal-btn flex-1 btn-33 w-full clue-page-btn"
          disabled={
            challenge.language === "python"
              ? pyodideLoading || isRunning || !pyodide
              : isRunning
          }
        >
          {challenge.language === "python"
            ? pyodideLoading
              ? "⏳ Cargando Python..."
              : isRunning
              ? "⏳ Ejecutando..."
              : !pyodide
              ? "❌ Python no disponible"
              : "▶️ RUN"
            : isRunning
            ? "⏳ Ejecutando..."
            : "▶️ RUN"}
        </button>
        <button
          onClick={handleReset}
          className="neobrutal-btn flex-1 btn-33 w-full clue-page-btn"
        >
          🗑️ CLEAR
        </button>
        <button
          onClick={() => {
            console.log("Recargando página como solución temporal");
            window.location.reload();
          }}
          className="neobrutal-btn flex-1 btn-33 w-full clue-page-btn"
        >
          🔄 RELOAD
        </button>
      </div>

      {/* En el render, si pyodide es null y no está cargando, mostrar mensaje de error SOLO si es Python */}
      {challenge.language === "python" && !pyodide && !pyodideLoading && (
        <div className="neobrutal-card mb-2 md:mb-4 bg-black border-2 border-red-500">
          <div className="text-red-400 text-base font-mono p-4 text-center">
            Error: El entorno Python no está disponible.
            <br />
            Intenta recargar la página o revisa tu conexión a internet.
            <br />
            Si el problema persiste, contacta soporte.
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeChallengeInterface;
