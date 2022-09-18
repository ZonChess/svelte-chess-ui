import type { ChessSettingType } from "../../store/chess/type";

export const loadSettings = (): ChessSettingType => {
  return {
    flipped: false,
    lines: true,
    evaluation: true
  };
};
