import {
  getCurrentFen,
  getHistory,
  updateFen,
  updateHistory,
  updateWantUpdateInfo,
} from "../../store/chess/board";
import { START_FEN } from "../../store/chess/constant";
import type {
  BitMove,
  History,
  HistoryItem,
  HistoryMove,
  HistoryMoveType,
} from "../../store/chess/type";
import { parseMoveNumber } from "./fen";
import { parseSan } from "./move";

export const loadHistory = (): History => {
  return {
    history1: [[START_FEN, null, null, null]],
    history2: null,
    historyindex: 0,
  };
};

export const historyAdd = (
  fen: string,
  oldhistory?: HistoryItem[] | null,
  move?: BitMove | null,
  san?: string | null
) => {
  let history = getHistory();
  if (!history) history = loadHistory();
  if (
    history.historyindex >= 0 &&
    history.history1[history.historyindex][0] == fen
  )
    return;
  var c: HistoryMove | null = null;
  if (oldhistory != null) {
    for (var i = 0; i < oldhistory.length; i++) {
      if (oldhistory[i][0] == fen && oldhistory[i].length > 1)
        c = oldhistory[i][1];
    }
  } else {
    if (history.history2 == null) {
      history.history2 = [
        history.historyindex,
        JSON.parse(JSON.stringify(history.history1)),
      ];
      // refreshButtonRevert();
    }
  }
  history.historyindex++;
  history.history1.length = history.historyindex;
  history.history1.push([fen, c, move ?? null, san ?? null]);
  updateHistory(history);
  // historyButtons();
  // historySave();
};

export const addHistoryEval = (
  index: number,
  score: number | null,
  depth: number,
  move?: BitMove
) => {
  let history = getHistory();
  if (
    history.history1[index].length < 2 ||
    history.history1[index][1] == null ||
    (history.history1[index][1] != null &&
      (history.history1[index][1] as HistoryMove).depth < depth)
  ) {
    var black = history.history1[index][0].indexOf(" b ") > 0;
    var ei = {
      score: score,
      depth: depth,
      black: black,
      move: move,
    };
    if (history.history1[index].length >= 2) history.history1[index][1] = ei;
    else {
      history.history1[index].push(ei);
      history.history1[index].push(null);
    }
    updateHistory(history);
    // repaintGraph();
    // updateWantUpdateInfo(true);
  }
};

export const getHistoryMoveList = (): HistoryMoveType[] => {
  let historyMoveList: HistoryMoveType[] = [];
  var lastmn: number = 0,
    mn: number = 1;
  let h = getHistory();
  for (var i = 1; i < h?.history1.length; i++) {
    var san = "\u2605";
    if (h.history1[i].length > 3 && h.history1[i][3] != null)
      san = h.history1[i][3];
    var sanObj = parseSan(san);
    if (mn != lastmn) {
      lastmn = mn;
      historyMoveList.push([
        mn,
        [i, sanObj.piecestr, sanObj.movestr, i === h.historyindex],
        null,
      ]);
    } else {
      historyMoveList[historyMoveList.length - 1][2] = [
        i,
        sanObj.piecestr,
        sanObj.movestr,
        i === h.historyindex,
      ];
    }
    mn = parseMoveNumber(h.history1[i][0]);
  }
  return historyMoveList;
};

export const historyMove = (v: number) => {
  let h = getHistory();
  var oldindex = h.historyindex;
  if (
    h.historyindex == h.history1.length - 1 &&
    h.history1[h.historyindex][0] != getCurrentFen()
  )
    historyAdd(getCurrentFen());
  h.historyindex += v;
  if (h.historyindex < 0) h.historyindex = 0;
  if (h.historyindex >= h.history1.length) h.historyindex = h.history1.length - 1;
  if (
    v == 0 ||
    oldindex != h.historyindex ||
    getCurrentFen() != h.history1[h.historyindex][0]
  ) {
    updateFen(h.history1[h.historyindex][0]);
    updateHistory(h);
  }
};
