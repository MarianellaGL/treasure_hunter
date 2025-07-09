import { useState, useEffect } from "react";
import { useGameStore } from "../store/gameStore";

const AnimatedTerminal: React.FC = () => {
  const { terminalOutput } = useGameStore();
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (terminalOutput.length === 0) return;

    // Mostrar solo las últimas 5 líneas para evitar scroll
    const maxLines = 5;
    const linesToShow = terminalOutput.slice(-maxLines);

    if (linesToShow.length !== displayedLines.length) {
      setDisplayedLines(linesToShow);
      setCurrentIndex(0);
    }
  }, [terminalOutput, displayedLines.length]);

  useEffect(() => {
    if (displayedLines.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < displayedLines.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 100); // Velocidad de animación

    return () => clearInterval(interval);
  }, [displayedLines.length]);

  const visibleLines = displayedLines.slice(0, currentIndex + 1);

  return (
    <div className="neobrutal-card">
      <h3 className="neobrutal-title text-xl mb-4">TERMINAL</h3>
      <div className="bg-black border-2 border-[#00FF00] p-4 rounded font-mono text-sm h-48 overflow-hidden">
        <div className="text-[#00FF00] space-y-1">
          {visibleLines.map((line, index) => (
            <div
              key={index}
              className="terminal-line"
              style={{
                animationDelay: `${index * 100}ms`,
                opacity: index === currentIndex ? 1 : 0.8,
              }}
            >
              {line}
            </div>
          ))}
          {visibleLines.length > 0 && (
            <div className="text-[#00FF00] animate-pulse">
              <span className="cursor-blink">█</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimatedTerminal;
