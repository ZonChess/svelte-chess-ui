import type { BoardPos, Fen, PieceType } from "../../store/chess/type";
import { RANK_BOARD, FILE_BOARD } from "../../store/chess/constant";

export const bounds = (x: number, y: number): boolean => {
  return x >= 0 && x < FILE_BOARD && y >= 0 && y < RANK_BOARD;
};

export const generateFEN = (pos: Fen): string => {
  var s = "",
    f = 0,
    castling = pos.c,
    enpassant = pos.e,
    board = pos.b;
  for (var y = 0; y < RANK_BOARD; y++) {
    for (var x = 0; x < FILE_BOARD; x++) {
      if (board[x][y] == "-") {
        f++;
      } else {
        if (f > 0) (s += f), (f = 0);
        s += board[x][y];
      }
    }
    if (f > 0) (s += f), (f = 0);
    if (y < RANK_BOARD - 1) s += "/";
  }
  s +=
    " " +
    (pos.w ? "w" : "b") +
    " " +
    (castling[0] || castling[1] || castling[2] || castling[3]
      ? (castling[0] ? "K" : "") +
        (castling[1] ? "Q" : "") +
        (castling[2] ? "k" : "") +
        (castling[3] ? "q" : "")
      : "-") +
    " " +
    (enpassant == null
      ? "-"
      : "abcdefgh"[enpassant[0]] + "87654321"[enpassant[1]]) +
    " " +
    pos.m[0] +
    " " +
    pos.m[1];
  return s;
};

export const parseFEN = (fen: string): Fen => {
  var board: PieceType[][] = new Array(FILE_BOARD);
  for (var i = 0; i < 8; i++) board[i] = new Array(RANK_BOARD);

  var a = fen.replace(/^\s+/, "").split(" "),
    s = a[0],
    x: number,
    y: number;
  for (x = 0; x < 8; x++)
    for (y = 0; y < 8; y++) {
      board[x][y] = "-";
    }

  (x = 0), (y = 0);
  for (var i = 0; i < s.length; i++) {
    if (s[i] == " ") break;
    if (s[i] == "/") {
      x = 0;
      y++;
    } else {
      if (!bounds(x, y)) continue;
      if ("KQRBNP".indexOf(s[i].toUpperCase()) != -1) {
        board[x][y] = s[i] as PieceType;
        x++;
      } else if ("0123456789".indexOf(s[i]) != -1) {
        x += parseInt(s[i]);
      } else x++;
    }
  }
  var castling: boolean[],
    enpassant: number[] | null,
    whitemove = !(a.length > 1 && a[1] == "b");
  if (a.length > 2) {
    castling = [
      a[2].indexOf("K") != -1,
      a[2].indexOf("Q") != -1,
      a[2].indexOf("k") != -1,
      a[2].indexOf("q") != -1,
    ];
  } else {
    castling = [true, true, true, true];
  }
  if (a.length > 3 && a[3].length == 2) {
    var ex = "abcdefgh".indexOf(a[3][0]);
    var ey = "87654321".indexOf(a[3][1]);
    enpassant = ex >= 0 && ey >= 0 ? [ex, ey] : null;
  } else {
    enpassant = null;
  }
  var movecount = [
    a.length > 4 && !isNaN(parseInt(a[4])) && a[4] != "" ? parseInt(a[4]) : 0,
    a.length > 5 && !isNaN(parseInt(a[5])) && a[5] != "" ? parseInt(a[5]) : 1,
  ];

  return {
    b: board,
    c: castling,
    e: enpassant,
    w: whitemove,
    m: movecount,
  };
};

const board = (pos: Fen, x: number, y: number): PieceType => {
  if (x >= 0 && x < FILE_BOARD && y >= 0 && y < RANK_BOARD) return pos.b[x][y];
  return "-";
};

export const isWhiteCheck = (pos: Fen) => {
  var kx: number | null = null,
    ky: number | null = null;
  for (var x = 0; x < 8; x++) {
    for (var y = 0; y < 8; y++) {
      if (pos.b[x][y] == "K") {
        kx = x;
        ky = y;
      }
    }
  }
  if (kx == null || ky == null) return false;
  if (
    board(pos, kx + 1, ky - 1) == "p" ||
    board(pos, kx - 1, ky - 1) == "p" ||
    board(pos, kx + 2, ky + 1) == "n" ||
    board(pos, kx + 2, ky - 1) == "n" ||
    board(pos, kx + 1, ky + 2) == "n" ||
    board(pos, kx + 1, ky - 2) == "n" ||
    board(pos, kx - 2, ky + 1) == "n" ||
    board(pos, kx - 2, ky - 1) == "n" ||
    board(pos, kx - 1, ky + 2) == "n" ||
    board(pos, kx - 1, ky - 2) == "n" ||
    board(pos, kx - 1, ky - 1) == "k" ||
    board(pos, kx, ky - 1) == "k" ||
    board(pos, kx + 1, ky - 1) == "k" ||
    board(pos, kx - 1, ky) == "k" ||
    board(pos, kx + 1, ky) == "k" ||
    board(pos, kx - 1, ky + 1) == "k" ||
    board(pos, kx, ky + 1) == "k" ||
    board(pos, kx + 1, ky + 1) == "k"
  )
    return true;
  for (var i = 0; i < 8; i++) {
    var ix = ((i + Number(i > 3)) % 3) - 1;
    var iy = (((i + Number(i > 3)) / 3) << 0) - 1;
    for (var d = 1; d < 8; d++) {
      var b = board(pos, kx + d * ix, ky + d * iy);
      var line = ix == 0 || iy == 0;
      if (b == "q" || (b == "r" && line) || (b == "b" && !line)) return true;
      if (b != "-") break;
    }
  }
  return false;
};

export const colorflip = (pos: Fen): Fen => {
  var board: PieceType[][] = new Array(FILE_BOARD);
  for (var i = 0; i < FILE_BOARD; i++) board[i] = new Array(RANK_BOARD);
  for (let x = 0; x < FILE_BOARD; x++)
    for (let y = 0; y < RANK_BOARD; y++) {
      board[x][y] = pos.b[x][RANK_BOARD - 1 - y];
      var color = board[x][y].toUpperCase() == board[x][y];
      board[x][y] = (
        color ? board[x][y].toLowerCase() : board[x][y].toUpperCase()
      ) as PieceType;
    }
  return {
    b: board,
    c: [pos.c[2], pos.c[3], pos.c[0], pos.c[1]],
    e: pos.e == null ? null : [pos.e[0], RANK_BOARD - 1 - pos.e[1]],
    w: !pos.w,
    m: [pos.m[0], pos.m[1]],
  };
};

export const checkPosition = (pos: Fen): string[] => {
  let errmsgs: string[] = [];
  let [wk, bk, wp, bp, wpr, bpr, wn, wb1, wb2, wr, wq, bn, bb1, bb2, br, bq] = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  for (var x = 0; x < 8; x++) {
    for (var y = 0; y < 8; y++) {
      var c = (x + y) % 2 == 0;
      if (pos.b[x][y] == "K") wk++;
      if (pos.b[x][y] == "k") bk++;
      if (pos.b[x][y] == "P") wp++;
      if (pos.b[x][y] == "p") bp++;
      if (pos.b[x][y] == "N") wn++;
      if (pos.b[x][y] == "n") bn++;
      if (c && pos.b[x][y] == "B") wb1++;
      if (c && pos.b[x][y] == "b") bb1++;
      if (!c && pos.b[x][y] == "B") wb2++;
      if (!c && pos.b[x][y] == "b") bb2++;
      if (pos.b[x][y] == "R") wr++;
      if (pos.b[x][y] == "r") br++;
      if (pos.b[x][y] == "Q") wq++;
      if (pos.b[x][y] == "q") bq++;
      if (pos.b[x][y] == "P" && (y == 0 || y == 7)) wpr++;
      if (pos.b[x][y] == "p" && (y == 0 || y == 7)) bpr++;
    }
  }
  if (wk == 0) errmsgs.push("Missing white king");
  if (bk == 0) errmsgs.push("Missing black king");
  if (wk > 1) errmsgs.push("Two white kings");
  if (bk > 1) errmsgs.push("Two black kings");
  var wcheck = isWhiteCheck(pos);
  var bcheck = isWhiteCheck(colorflip(pos));
  if ((pos.w && bcheck) || (!pos.w && wcheck))
    errmsgs.push("Non-active color is in check");
  if (wp > 8) errmsgs.push("Too many white pawns");
  if (bp > 8) errmsgs.push("Too many black pawns");
  if (wpr > 0) errmsgs.push("White pawns in first or last rank");
  if (bpr > 0) errmsgs.push("Black pawns in first or last rank");
  var we =
    Math.max(0, wq - 1) +
    Math.max(0, wr - 2) +
    Math.max(0, wb1 - 1) +
    Math.max(0, wb2 - 1) +
    Math.max(0, wn - 2);
  var be =
    Math.max(0, bq - 1) +
    Math.max(0, br - 2) +
    Math.max(0, bb1 - 1) +
    Math.max(0, bb2 - 1) +
    Math.max(0, bn - 2);
  if (we > Math.max(0, 8 - wp)) errmsgs.push("Too many extra white pieces");
  if (be > Math.max(0, 8 - bp)) errmsgs.push("Too many extra black pieces");
  if (
    (pos.c[0] && (pos.b[7][7] != "R" || pos.b[4][7] != "K")) ||
    (pos.c[1] && (pos.b[0][7] != "R" || pos.b[4][7] != "K"))
  )
    errmsgs.push(
      "White has castling rights and king or rook not in their starting position"
    );
  if (
    (pos.c[2] && (pos.b[7][0] != "r" || pos.b[4][0] != "k")) ||
    (pos.c[3] && (pos.b[0][0] != "r" || pos.b[4][0] != "k"))
  )
    errmsgs.push(
      "Black has castling rights and king or rook not in their starting position"
    );
  return errmsgs;
};

export const hasPiece = (fen: Fen, pos: BoardPos): boolean => {
  return board(fen, pos.x, pos.y) !== "-";
};

export const parseMoveNumber = (fen: string): number => {
  var a = fen.replace(/^\s+/, '').split(' ');
  return (a.length > 5 && !isNaN(parseInt(a[5])) && a[5] != '') ? parseInt(a[5]) : 1;
}