import { useState, useEffect } from "react";

interface MiniIDEProps {
  initialCode?: string;
  language?: "javascript" | "python" | "bash" | "html";
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

const MiniIDE: React.FC<MiniIDEProps> = ({
  initialCode = "",
  language = "javascript",
  onCodeChange,
  onRun,
  readOnly = false,
  placeholder = "Escribe tu código aquí...",
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(code);
    }
  }, [code, onCodeChange]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleRun = () => {
    if (onRun) {
      setIsRunning(true);
      setOutput([`[${new Date().toLocaleTimeString()}] Ejecutando...`]);

      // Simular ejecución
      setTimeout(() => {
        onRun(code);
        setOutput((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Completado.`,
        ]);
        setIsRunning(false);
      }, 800);
    }
  };

  const handleClear = () => {
    setOutput([]);
  };

  const getLanguageIcon = () => {
    switch (language) {
      case "javascript":
        return "⚡";
      case "python":
        return "🐍";
      case "bash":
        return "💻";
      case "html":
        return "🌐";
      default:
        return "📝";
    }
  };

  return (
    <div className="mini-ide">
      {/* Header compacto */}
      <div className="mini-ide-header">
        <div className="flex items-center gap-2">
          <span className="text-base">{getLanguageIcon()}</span>
          <span className="font-mono text-xs">{language.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning || readOnly}
            className="neobrutal-btn text-xs px-2 py-1"
          >
            {isRunning ? "⏳" : "▶️"} RUN
          </button>
          <button
            onClick={handleClear}
            className="neobrutal-btn text-xs px-2 py-1"
          >
            🗑️ CLEAR
          </button>
        </div>
      </div>

      {/* Editor compacto */}
      <div className="mini-editor">
        <textarea
          value={code}
          onChange={handleCodeChange}
          readOnly={readOnly}
          className="mini-textarea"
          placeholder={placeholder}
          spellCheck={false}
        />
      </div>

      {/* Output compacto */}
      <div className="mini-output">
        <div className="mini-output-header">
          <span className="text-xs font-mono">OUTPUT</span>
          <span className="text-xs text-gray-400">{output.length} líneas</span>
        </div>
        <div className="mini-output-content">
          {output.length === 0 ? (
            <div className="text-gray-500 text-xs italic">
              // Output aparecerá aquí
            </div>
          ) : (
            output.map((line, i) => (
              <div key={i} className="mini-output-line">
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniIDE;
