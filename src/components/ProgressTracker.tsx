import type { ProgressTrackerProps } from "../types/game";

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  totalClues,
  foundClues,
}) => {
  const progress = (foundClues / totalClues) * 100;

  return (
    <div className="neobrutal-card w-full mb-4">
      <h3 className="neobrutal-title text-lg mb-4">PROGRESO</h3>
      <div className="progress-bar">
        <div
          className="progress-bar-inner"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center mb-2">
        {Array.from({ length: totalClues }, (_, i) => (
          <div
            key={i}
            className={`w-8 h-8 flex items-center justify-center font-bold text-base border-4 rounded-full select-none
              ${
                i < foundClues
                  ? "bg-[#00FF00] text-black border-[#00FF00]"
                  : "bg-black text-[#00FF00] border-white"
              }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div className="text-xs text-white text-center mt-2">
        {foundClues} de {totalClues} pistas encontradas
      </div>
    </div>
  );
};

export default ProgressTracker;
