import { get, writable, type Writable } from "svelte/store";
import { START_FEN } from "./constant";
import type { EngineType, Move, History, ChessSettingType } from "./type";

export let fenConfig: Writable<string | null> = writable(null);

export let currMoves: Writable<Move[]> = writable([]);

export let errMessages: Writable<string[]> = writable([]);

export let engine: Writable<EngineType | null> = writable(null);

export let history: Writable<History> = writable();

export let chessConfig: Writable<ChessSettingType> = writable();

export let wantUpdateInfo: Writable<boolean> = writable(true);

export const loadFen = (fen: string = START_FEN) => {
  fenConfig.set(fen);
};

export const updateFen = (fen: string) => {
  fenConfig.set(fen);
};

export const getCurrentFen = (): string | null => {
  return get(fenConfig);
};

export const getCurrentMoves = (): Move[] => {
  return get(currMoves);
};

export const updateCurrentMoves = (moves: Move[]) => {
  currMoves.set(moves);
};

export const updateEngine = (e: EngineType) => {
  engine.set(e);
};

export const getEngine = (): EngineType | null => {
  return get(engine);
};

export const getHistory = (): History => {
  return get(history);
};

export const updateHistory = (h: History) => {
  history.set(h);
};

export const getChessConfig = (): ChessSettingType => {
  return get(chessConfig);
};

export const updateChessConfig = (config: ChessSettingType) => {
  chessConfig.set(config);
};

export const getWantUpdateInfo = (): boolean => {
  return get(wantUpdateInfo);
}

export const updateWantUpdateInfo = (_wantUpdateInfo: boolean) => {
  wantUpdateInfo.set(_wantUpdateInfo);
}