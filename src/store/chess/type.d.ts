import type { SvelteComponent } from "svelte";

export type Fen = {
  b: PieceType[][];
  c: boolean[];
  e: number[] | null;
  m: number[];
  w: boolean;
};

export type BoardPos = {
  x: number;
  y: number;
};

export type BitMove = {
  from: BoardPos;
  to: BoardPos;
  p?: PieceType;
};

export type Move = {
  move: BitMove;
  san: string;
  fen: string;
  player: Player;
  eval: number | null;
  depth: number;
  w: boolean;
  answer: string | null;
  answerpv: string[];
  pvtext: string;
};

export type PieceType =
  | "r"
  | "b"
  | "n"
  | "q"
  | "k"
  | "p"
  | "-"
  | "R"
  | "B"
  | "N"
  | "Q"
  | "K"
  | "P";

export type Player = "b" | "w" | null;

export type EngineType = {
  ready: boolean;
  kill: boolean;
  waiting: boolean;
  depth: number;
  lastnodes: number;
  send?: Function;
  eval?: Function;
  messagefunc?: Function;
  fen?: string;
  score?: number | null;
};

export type HistoryMove = {
  score: number | null;
  depth: number;
  black: boolean;
  move?: BitMove;
};

export type HistoryItem = [
  string,
  HistoryMove | null,
  BitMove | null,
  string | null
];

export type History = {
  history1: HistoryItem[];
  history2: [number, HistoryItem[]] | null;
  historyindex: number;
};

export type TabType = {
  name: string;
  content: typeof SvelteComponent;
  isActive: boolean;
  icon: string;
  dataCy: string;
};

export type LineMoveType = {
  pos: Fen;
  move: BitMove;
  idx: number;
  showIndex: boolean;
  san: string;
};

export type ChessSettingType = {
  flipped: boolean;
  lines: boolean;
  evaluation: boolean;
};

export type CoordinateType = {
  x: number;
  y: number;
  classes: string;
  text: string;
};

export type PreviewPositionType = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type OpeningType = [string, string, string, number, number];

export type HistoryPlayerSan = [number, string, string, boolean];

export type HistoryMoveType = [
  number,
  HistoryPlayerSan | null,
  HistoryPlayerSan | null
];
