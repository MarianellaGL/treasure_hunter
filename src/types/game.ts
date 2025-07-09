export type GameState = "intro" | "playing" | "completed";

export type Difficulty = "easy" | "medium" | "hard" | "extreme" | "legendary";

export type HackType = "decrypt" | "bypass" | "override" | "code" | "special";

export interface Clue {
  id: number;
  location: string;
  hint: string;
  difficulty: Difficulty;
  hackRequired: boolean;
  hackType?: HackType;
  answer: string;
}

export interface TerminalProps {
  output: string[];
}

export interface ProgressTrackerProps {
  totalClues: number;
  foundClues: number;
}

export interface ClueDisplayProps {
  clues: Clue[];
  currentClue: number;
  foundClues: number[];
  onClueSelect: (clueId: number) => void;
}

export interface HackInterfaceProps {
  clue: Clue;
  progress: number;
  onProgressChange: (progress: number) => void;
  onComplete: () => void;
}

export interface CodeIDEProps {
  initialCode?: string;
  language?: "javascript" | "python" | "bash" | "html";
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => void;
  readOnly?: boolean;
  theme?: "dark" | "matrix";
}

export interface CodeChallenge {
  title: string;
  description: string;
  language: "javascript" | "python" | "bash" | "html";
  initialCode: string;
  solution: string;
  hints: string[];
  validation: (code: string) => boolean;
}
