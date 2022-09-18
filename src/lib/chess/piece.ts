import { FILE_BOARD, RANK_BOARD } from "../../store/chess/constant";
import type { PieceType, Player } from "../../store/chess/type";

export const getPlayerFromPiece = (pieceType: PieceType): Player => {
  if (pieceType === "-") {
    return null;
  }

  if (
    pieceType === "r" ||
    pieceType === "b" ||
    pieceType === "n" ||
    pieceType === "q" ||
    pieceType === "k" ||
    pieceType === "p"
  ) {
    return "b";
  }
  return "w";
};

export const getFile = (file: number): number => {
  return file;
};

export const getRank = (rank: number): number => {
  return RANK_BOARD - 1 - rank;
};
export const getPreviewPieceImage = (piece: PieceType): string => {
  let name = getPlayerFromPiece(piece) + piece.toLocaleLowerCase();
  return `/src/assets/chess/themes/pieces/neo/60/${name}.png`;
};
