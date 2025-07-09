import { useState, useEffect } from "react";

interface CodeIDEProps {
  initialCode?: string;
  language?: "javascript" | "python" | "bash" | "html";
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => void;
  readOnly?: boolean;
  theme?: "dark" | "matrix";
}

const CodeIDE: React.FC<CodeIDEProps> = ({
  initialCode = "",
  language = "javascript",
  onCodeChange,
  onRun,
  readOnly = false,
  theme = "matrix",
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
      setOutput([`[${new Date().toLocaleTimeString()}] Ejecutando código...`]);

      // Simular ejecución
      setTimeout(() => {
        onRun(code);
        setOutput((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Código ejecutado exitosamente.`,
        ]);
        setIsRunning(false);
      }, 1000);
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

  const getSyntaxHighlight = (code: string) => {
    // Simple syntax highlighting for matrix theme
    return code
      .replace(
        /\b(function|const|let|var|if|else|for|while|return)\b/g,
        '<span class="text-blue-400">$1</span>'
      )
      .replace(
        /\b(console|log|alert)\b/g,
        '<span class="text-yellow-400">$1</span>'
      )
      .replace(
        /\b(true|false|null|undefined)\b/g,
        '<span class="text-purple-400">$1</span>'
      )
      .replace(/(["'`])(.*?)\1/g, '<span class="text-green-400">$1$2$1</span>')
      .replace(/(\/\/.*)/g, '<span class="text-gray-500">$1</span>')
      .replace(/(\d+)/g, '<span class="text-orange-400">$1</span>');
  };

  return (
    <div
      className={`code-ide ${
        theme === "matrix" ? "matrix-theme" : "dark-theme"
      }`}
    >
      {/* Header */}
      <div className="code-ide-header">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getLanguageIcon()}</span>
          <span className="font-mono text-sm">{language.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning || readOnly}
            className="neobrutal-btn text-xs px-3 py-1"
          >
            {isRunning ? "⏳" : "▶️"} RUN
          </button>
          <button
            onClick={handleClear}
            className="neobrutal-btn text-xs px-3 py-1"
          >
            🗑️ CLEAR
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="code-editor-container">
        <div className="line-numbers">
          {code.split("\n").map((_, i) => (
            <div key={i} className="line-number">
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          value={code}
          onChange={handleCodeChange}
          readOnly={readOnly}
          className="code-textarea"
          placeholder={`// Escribe tu código ${language} aquí...`}
          spellCheck={false}
        />
        <div
          className="code-highlight"
          dangerouslySetInnerHTML={{ __html: getSyntaxHighlight(code) }}
        />
      </div>

      {/* Terminal Output */}
      <div className="terminal-output">
        <div className="terminal-header">
          <span className="text-sm font-mono">TERMINAL</span>
          <span className="text-xs text-gray-400">{output.length} líneas</span>
        </div>
        <div className="terminal-content">
          {output.length === 0 ? (
            <div className="text-gray-500 text-sm italic">
              // El output aparecerá aquí cuando ejecutes el código
            </div>
          ) : (
            output.map((line, i) => (
              <div key={i} className="terminal-line">
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeIDE;
