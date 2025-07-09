import type { ClueDisplayProps } from "../types/game";

const ClueDisplay: React.FC<ClueDisplayProps> = ({
  clues,
  currentClue,
  foundClues,
  onClueSelect,
}) => {
  return (
    <div className="neobrutal-card">
      <h3 className="neobrutal-title text-xl mb-4">PISTAS DISPONIBLES</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clues.map((clue) => (
          <div
            key={clue.id}
            className={`clue-card cursor-pointer ${
              foundClues.includes(clue.id) ? "found" : ""
            } ${currentClue === clue.id ? "selected" : ""}`}
            onClick={() => onClueSelect(clue.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg">
                #{clue.id} {clue.location}
              </span>
              {foundClues.includes(clue.id) && (
                <span className="icon-xl">✔️</span>
              )}
            </div>
            <div className="text-white text-sm mb-2">{clue.hint}</div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-1 rounded bg-black border-2 border-[#00FF00] text-[#00FF00]">
                {clue.difficulty.toUpperCase()}
              </span>
              {clue.hackRequired && (
                <span className="text-xs font-bold px-2 py-1 rounded bg-[#00FF00] text-black border-2 border-black">
                  HACK
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClueDisplay;
