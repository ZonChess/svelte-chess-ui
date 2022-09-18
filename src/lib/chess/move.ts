import { get } from "svelte/store";
import {
  errMessages,
  fenConfig,
  getCurrentFen,
  getCurrentMoves,
  updateCurrentMoves,
} from "../../store/chess/board";
import { FILE_BOARD, PIECE_NAME, RANK_BOARD } from "../../store/chess/constant";
import type {
  BitMove,
  BoardPos,
  Fen,
  Move,
  PieceType,
} from "../../store/chess/type";
import {
  bounds,
  checkPosition,
  colorflip,
  generateFEN,
  isWhiteCheck,
  parseFEN,
} from "./fen";
import { historyAdd } from "./history";

export const doMove = (
  pos: Fen,
  from: BoardPos,
  to: BoardPos,
  promotion?: PieceType | null
): Fen => {
  if (pos.b[from.x][from.y].toUpperCase() != pos.b[from.x][from.y]) {
    var r = colorflip(
      doMove(
        colorflip(pos),
        {
          x: from.x,
          y: 7 - from.y,
        },
        {
          x: to.x,
          y: 7 - to.y,
        },
        promotion
      )
    );
    r.m[1]++;
    return r;
  }
  var r = colorflip(colorflip(pos));
  r.w = !r.w;
  if (from.x == 7 && from.y == 7) r.c[0] = false;
  if (from.x == 0 && from.y == 7) r.c[1] = false;
  if (to.x == 7 && to.y == 0) r.c[2] = false;
  if (to.x == 0 && to.y == 0) r.c[3] = false;
  if (from.x == 4 && from.y == 7) r.c[0] = r.c[1] = false;
  r.e =
    pos.b[from.x][from.y] == "P" && from.y == 6 && to.y == 4
      ? [from.x, 5]
      : null;
  if (pos.b[from.x][from.y] == "K") {
    if (Math.abs(from.x - to.x) > 1) {
      r.b[from.x][from.y] = "-";
      r.b[to.x][to.y] = "K";
      r.b[to.x > 4 ? 5 : 3][to.y] = "R";
      r.b[to.x > 4 ? 7 : 0][to.y] = "-";
      return r;
    }
  }
  if (pos.b[from.x][from.y] == "P" && to.y == 0) {
    r.b[to.x][to.y] = promotion != null ? promotion : "Q";
  } else if (
    pos.b[from.x][from.y] == "P" &&
    pos.e != null &&
    to.x == pos.e[0] &&
    to.y == pos.e[1] &&
    Math.abs(from.x - to.x) == 1
  ) {
    r.b[to.x][from.y] = "-";
    r.b[to.x][to.y] = pos.b[from.x][from.y];
  } else {
    r.b[to.x][to.y] = pos.b[from.x][from.y];
  }
  r.b[from.x][from.y] = "-";
  r.m[0] =
    pos.b[from.x][from.y] == "P" || pos.b[to.x][to.y] != "-" ? 0 : r.m[0] + 1;
  return r;
};

export const doBitMove = (pos: Fen, move: BitMove): Fen => {
  return doMove(pos, move.from, move.to, move.p);
};

export const isLegal = (pos: Fen, from: BoardPos, to: BoardPos): boolean => {
  if (!bounds(from.x, from.y)) return false;
  if (!bounds(to.x, to.y)) return false;
  if (from.x == to.x && from.y == to.y) return false;
  if (pos.b[from.x][from.y] != pos.b[from.x][from.y].toUpperCase()) {
    return isLegal(
      colorflip(pos),
      {
        x: from.x,
        y: RANK_BOARD - 1 - from.y,
      },
      {
        x: to.x,
        y: RANK_BOARD - 1 - to.y,
      }
    );
  }
  if (!pos.w) return false;
  var pfrom = pos.b[from.x][from.y];
  var pto = pos.b[to.x][to.y];
  if (pto.toUpperCase() == pto && pto != "-") return false;
  if (pfrom == "-") {
    return false;
  } else if (pfrom == "P") {
    var enpassant = pos.e != null && to.x == pos.e[0] && to.y == pos.e[1];
    if (
      !(
        (from.x == to.x && from.y == to.y + 1 && pto == "-") ||
        (from.x == to.x &&
          from.y == RANK_BOARD - 2 &&
          to.y == RANK_BOARD - 4 &&
          pto == "-" &&
          pos.b[to.x][RANK_BOARD - 3] == "-") ||
        (Math.abs(from.x - to.x) == 1 &&
          from.y == to.y + 1 &&
          (pto != "-" || enpassant))
      )
    )
      return false;
  } else if (pfrom == "N") {
    if (Math.abs(from.x - to.x) < 1 || Math.abs(from.x - to.x) > 2)
      return false;
    if (Math.abs(from.y - to.y) < 1 || Math.abs(from.y - to.y) > 2)
      return false;
    if (Math.abs(from.x - to.x) + Math.abs(from.y - to.y) != 3) return false;
  } else if (pfrom == "K") {
    var castling = true;
    if (from.y != RANK_BOARD - 1 || to.y != RANK_BOARD - 1) castling = false;
    if (from.x != 4 || (to.x != 2 && to.x != 6)) castling = false;
    if ((to.x == 6 && !pos.c[0]) || (to.x == 2 && !pos.c[1])) castling = false;
    if (
      to.x == 2 &&
      pos.b[0][RANK_BOARD - 1] +
        pos.b[1][RANK_BOARD - 1] +
        pos.b[2][RANK_BOARD - 1] +
        pos.b[3][RANK_BOARD - 1] !=
        "R---"
    )
      castling = false;
    if (
      to.x == 6 &&
      pos.b[5][RANK_BOARD - 1] +
        pos.b[6][RANK_BOARD - 1] +
        pos.b[7][RANK_BOARD - 1] !=
        "--R"
    )
      castling = false;
    if (
      (Math.abs(from.x - to.x) > 1 || Math.abs(from.y - to.y) > 1) &&
      !castling
    )
      return false;
    if (castling && isWhiteCheck(pos)) return false;
    if (
      castling &&
      isWhiteCheck(
        doMove(pos, from, {
          x: to.x == 2 ? 3 : 5,
          y: RANK_BOARD - 1,
        })
      )
    )
      return false;
  }
  if (pfrom == "B" || pfrom == "R" || pfrom == "Q") {
    var a = from.x - to.x,
      b = from.y - to.y;
    var line = a == 0 || b == 0;
    var diag = Math.abs(a) == Math.abs(b);
    if (!line && !diag) return false;
    if (pfrom == "R" && !line) return false;
    if (pfrom == "B" && !diag) return false;
    var count = Math.max(Math.abs(a), Math.abs(b));
    var ix = a > 0 ? -1 : a < 0 ? 1 : 0,
      iy = b > 0 ? -1 : b < 0 ? 1 : 0;
    for (var i = 1; i < count; i++) {
      if (pos.b[from.x + ix * i][from.y + iy * i] != "-") return false;
    }
  }
  if (isWhiteCheck(doMove(pos, from, to))) return false;
  return true;
};

export const genMoves = (pos: Fen): BitMove[] => {
  var moves: BitMove[] = [];
  for (var x1 = 0; x1 < FILE_BOARD; x1++)
    for (var y1 = 0; y1 < RANK_BOARD; y1++)
      for (var x2 = 0; x2 < FILE_BOARD; x2++)
        for (var y2 = 0; y2 < RANK_BOARD; y2++) {
          if (
            isLegal(
              pos,
              {
                x: x1,
                y: y1,
              },
              {
                x: x2,
                y: y2,
              }
            )
          ) {
            if (
              (y2 == 0 || y2 == RANK_BOARD - 1) &&
              pos.b[x1][y1].toUpperCase() == "P"
            ) {
              moves.push({
                from: {
                  x: x1,
                  y: y1,
                },
                to: {
                  x: x2,
                  y: y2,
                },
                p: "N",
              });
              moves.push({
                from: {
                  x: x1,
                  y: y1,
                },
                to: {
                  x: x2,
                  y: y2,
                },
                p: "B",
              });
              moves.push({
                from: {
                  x: x1,
                  y: y1,
                },
                to: {
                  x: x2,
                  y: y2,
                },
                p: "R",
              });
              moves.push({
                from: {
                  x: x1,
                  y: y1,
                },
                to: {
                  x: x2,
                  y: y2,
                },
                p: "Q",
              });
            } else
              moves.push({
                from: {
                  x: x1,
                  y: y1,
                },
                to: {
                  x: x2,
                  y: y2,
                },
              });
          }
        }
  return moves;
};

export const sanMove = (pos: Fen, move: BitMove, moves: BitMove[]): string => {
  var s = "";
  if (
    move.from.x == 4 &&
    move.to.x == 6 &&
    pos.b[move.from.x][move.from.y].toLowerCase() == "k"
  ) {
    s = "O-O";
  } else if (
    move.from.x == 4 &&
    move.to.x == 2 &&
    pos.b[move.from.x][move.from.y].toLowerCase() == "k"
  ) {
    s = "O-O-O";
  } else {
    var piece = pos.b[move.from.x][move.from.y].toUpperCase();
    if (piece != "P") {
      var a = 0,
        sx = 0,
        sy = 0;
      for (var i = 0; i < moves.length; i++) {
        if (
          pos.b[moves[i].from.x][moves[i].from.y] ==
            pos.b[move.from.x][move.from.y] &&
          (moves[i].from.x != move.from.x || moves[i].from.y != move.from.y) &&
          moves[i].to.x == move.to.x &&
          moves[i].to.y == move.to.y
        ) {
          a++;
          if (moves[i].from.x == move.from.x) sx++;
          if (moves[i].from.y == move.from.y) sy++;
        }
      }
      s += piece;
      if (a > 0) {
        if (sx > 0 && sy > 0)
          s += "abcdefgh"[move.from.x] + "87654321"[move.from.y];
        else if (sx > 0) s += "87654321"[move.from.y];
        else s += "abcdefgh"[move.from.x];
      }
    }
    if (
      pos.b[move.to.x][move.to.y] != "-" ||
      (piece == "P" && move.to.x != move.from.x)
    ) {
      if (piece == "P") s += "abcdefgh"[move.from.x];
      s += "x";
    }
    s += "abcdefgh"[move.to.x] + "87654321"[move.to.y];
    if (piece == "P" && (move.to.y == 0 || move.to.y == 7))
      s += "=" + (move.p == null ? "Q" : move.p);
  }
  var pos2 = doMove(pos, move.from, move.to, move.p);
  if (isWhiteCheck(pos2) || isWhiteCheck(colorflip(pos2)))
    s += genMoves(pos2).length == 0 ? "#" : "+";
  return s;
};

export const parseSan = (
  san: string
): { piece: PieceType; piecestr?: string; movestr: string } => {
  if ("NBRQK".indexOf(san[0]) == -1) {
    return { piece: "-", movestr: san, piecestr: "-" };
  }

  return {
    piece: san[0] as PieceType,
    piecestr: PIECE_NAME[san[0]],
    movestr: san.substring(1),
  };
};

export const refreshMoves = () => {
  const fen = get(fenConfig);
  if (fen === null) {
    return;
  }
  let pos = parseFEN(fen);
  let currentMoves: Move[] = [];
  updateCurrentMoves(currentMoves);
  errMessages.set([]);
  let errmsgs = checkPosition(pos);

  // Pos is ok
  if (errmsgs.length === 0) {
    let moves = genMoves(pos);
    for (var i = 0; i < moves.length; i++) {
      currentMoves.push({
        move: moves[i],
        san: sanMove(pos, moves[i], moves),
        fen: generateFEN(doMove(pos, moves[i].from, moves[i].to, moves[i].p)),
        player: pos.w ? "b" : "w",
        eval: null,
        depth: 0,
        w: pos.w,
        answer: "",
        answerpv: [],
        pvtext: "",
      });
    }

    if (currentMoves.length === 0) {
      // Check win
    } else {
      updateCurrentMoves(currentMoves);
    }
  }
};

export const getLegalMoves = (pos: Fen, from: BoardPos): BitMove[] => {
  let legalMoves: BitMove[] = [];
  for (let x = 0; x < FILE_BOARD; x++) {
    for (let y = 0; y < RANK_BOARD; y++) {
      if (from == null || from.x < 0 || from.y < 0) continue;
      if (from.x == x && from.y === y) continue;
      if (isLegal(pos, from, { x: x, y: y })) {
        legalMoves.push({ from: from, to: { x: x, y: y } });
      }
    }
  }
  return legalMoves;
};

export const getCurSan = (move: BitMove): string | null => {
  const currmoves = getCurrentMoves();
  if (move == null) return null;
  for (var i = 0; i < currmoves.length; i++)
    if (
      currmoves[i].move.from.x == move.from.x &&
      currmoves[i].move.from.y == move.from.y &&
      currmoves[i].move.to.x == move.to.x &&
      currmoves[i].move.to.y == move.to.y &&
      currmoves[i].move.p == move.p
    )
      return currmoves[i].san;
  return null;
};

export const doMoveHandler = (pos: Fen, move: BitMove, calback: Function) => {
  const oldfen = getCurrentFen() as string;
  const currmoves = getCurrentMoves();
  var legal = isLegal(pos, move.from, move.to) && currmoves.length > 0;
  if (legal) {
    var san = getCurSan(move);
    pos = doMove(pos, move.from, move.to, move.p);
    const newFen = generateFEN(pos);
    historyAdd(oldfen);
    historyAdd(newFen, null, move, san);

    calback && calback(newFen, move);
  }
  return true;
};

export const parseBestMove = (m: string): BitMove | null => {
  if (m == null || m.length < 4) return null;
  var from = {
    x: "abcdefgh".indexOf(m[0]),
    y: "87654321".indexOf(m[1]),
  };
  var to = {
    x: "abcdefgh".indexOf(m[2]),
    y: "87654321".indexOf(m[3]),
  };
  var p = m.length > 4 ? "nbrq".indexOf(m[4]) : -1;
  if (p < 0)
    return {
      from: from,
      to: to,
    };
  return {
    from: from,
    to: to,
    p: "NBRQ"[p] as PieceType,
  };
};
