import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

interface ProfessionalIDEProps {
  initialCode?: string;
  language?: "javascript" | "python" | "bash" | "html" | "typescript";
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  height?: string;
}

const ProfessionalIDE: React.FC<ProfessionalIDEProps> = ({
  initialCode = "",
  language = "javascript",
  onCodeChange,
  onRun,
  readOnly = false,
  // placeholder = "// Escribe tu código aquí...", // No usado actualmente
  height = "300px",
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(code);
    }
  }, [code, onCodeChange]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleRun = () => {
    if (onRun) {
      setIsRunning(true);
      setOutput([`[${new Date().toLocaleTimeString()}] Ejecutando código...`]);

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
      case "typescript":
        return "📘";
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
      horizontal: "visible" as const,
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
    readOnly: readOnly,
    automaticLayout: true,
    wordWrap: "on" as const,
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
  };

  return (
    <div className="professional-ide">
      {/* Header */}
      <div className="professional-ide-header">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getLanguageIcon()}</span>
          <span className="font-mono text-sm font-bold">
            {language.toUpperCase()}
          </span>
          <span className="text-xs text-gray-400">Monaco Editor</span>
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

      {/* Editor */}
      <div className="professional-editor">
        <Editor
          height={height}
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="matrix-theme"
          options={options}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("matrix-theme", matrixTheme);
          }}
          onMount={(editor) => {
            // Configuraciones adicionales al montar
            editor.focus();
          }}
        />
      </div>

      {/* Terminal Output */}
      <div className="professional-terminal">
        <div className="professional-terminal-header">
          <span className="text-sm font-mono font-bold">TERMINAL</span>
          <span className="text-xs text-gray-400">{output.length} líneas</span>
        </div>
        <div className="professional-terminal-content">
          {output.length === 0 ? (
            <div className="text-gray-500 text-sm italic">
              // El output aparecerá aquí cuando ejecutes el código
            </div>
          ) : (
            output.map((line, i) => (
              <div key={i} className="professional-terminal-line">
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalIDE;
 