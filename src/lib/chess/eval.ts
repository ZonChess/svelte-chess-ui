import {
  getCurrentFen,
  getCurrentMoves,
  getEngine,
  getHistory,
  updateCurrentMoves,
} from "../../store/chess/board";
import type { BitMove, HistoryMove } from "../../store/chess/type";
import { checkPosition, generateFEN, parseFEN } from "./fen";
import { addHistoryEval } from "./history";
import { doBitMove, doMove, genMoves, parseBestMove, sanMove } from "./move";

export const evalNext = () => {
  let _curmoves = getCurrentMoves();
  const _engine = getEngine();
  if (!_engine) return;
  for (var i = 0; i < _curmoves.length; i++) {
    if (_curmoves[i].depth < _engine.depth) {
      var curpos = _curmoves[i].fen;
      _engine.score = null;
      if (!_engine.waiting) return;
      _engine.waiting = false;
      var initialdepth = _engine.depth;
      var savedpv: string[] = [];
      _engine.eval &&
        _engine.eval(
          curpos,
          function done(str: string) {
            _engine.waiting = true;
            let currentpos = parseFEN(getCurrentFen());
            let currentfen = generateFEN(doBitMove(currentpos, _curmoves[i].move));
            if (currentfen != curpos) return;
            if (i >= _curmoves.length || _curmoves[i].fen != curpos) return;
            if (_engine.score != null && _engine.depth == initialdepth) {
              _curmoves[i].eval = _curmoves[i].w
                ? _engine.score
                : -_engine.score;
              _curmoves[i].depth = _engine.depth;
              var m = str.match(/^bestmove\s(\S+)(?:\sponder\s(\S+))?/) ?? [];
              _curmoves[i].answer =
                m &&
                m.length > 1 &&
                m[1] != null &&
                (m[1].length == 4 || m[1].length == 5)
                  ? m[1]
                  : null;
              _curmoves[i].answerpv = [];
              var pvtext = "";
              if (_curmoves[i].answer != null) {
                if (savedpv.length < 1 || savedpv[0] != m[1]) savedpv = [m[1]];
                if (
                  m.length > 2 &&
                  m[2] != null &&
                  m[2].length != 4 &&
                  m[2].length != 5
                ) {
                  if (savedpv.length < 2 || savedpv[1] != m[2])
                    savedpv = [m[1], m[2]];
                }
                var nextpos = parseFEN(curpos);
                for (var j = 0; j < savedpv.length; j++) {
                  if (pvtext.length > 0) pvtext += " ";
                  var move = parseBestMove(savedpv[j]);
                  if (move) {
                    pvtext += sanMove(nextpos, move, genMoves(nextpos));
                    _curmoves[i].answerpv.push(savedpv[j]);
                    if (j + 1 < savedpv.length)
                      nextpos = doMove(nextpos, move.from, move.to, move.p);
                  }
                }
              }
              _curmoves[i].pvtext = pvtext.length > 0 ? pvtext : "-";
              // showEvals();
              updateCurrentMoves(_curmoves);
            }
            if (!_engine.kill) evalNext();
          },
          function info(depth: number, score: number, pv: string[]) {
            savedpv = pv;
          }
        );
      return;
    }
  }
  const history = getHistory();
  if (
    _curmoves.length > 0 &&
    history.history1[history.historyindex][0] == getCurrentFen()
  )
    addHistoryEval(
      history.historyindex,
      (_curmoves[0].w
        ? -(_curmoves[0].eval as number)
        : _curmoves[0].eval) as number,
      _engine.depth,
      _curmoves[0].move
    );
  for (var i = history.history1.length - 1; i >= 0; i--) {
    if (
      history.history1[i].length < 2 ||
      history.history1[i][1] == null ||
      (history.history1[i][1] != null &&
        (history.history1[i][1] as HistoryMove).depth < _engine.depth - 1)
    ) {
      var curpos = history.history1[i][0];
      _engine.score = null;
      if (!_engine.waiting) return;
      if (checkPosition(parseFEN(curpos)).length > 0) {
        addHistoryEval(i, null, _engine.depth - 1);
        if (!_engine.kill) evalNext();
      } else {
        _engine.waiting = false;
        _engine.eval && _engine.eval(curpos, function done(str: string) {
          _engine.waiting = true;
          if (i >= history.history1.length || history.history1[i][0] != curpos) return;
          if (_engine.score != null) {
            var m = str.match(/^bestmove\s(\S+)(?:\sponder\s(\S+))?/);
            var answer =
              m && m.length > 1 && (m[1].length == 4 || m[1].length == 5)
                ? m[1]
                : null;
            addHistoryEval(i, _engine.score, _engine.depth - 1, parseBestMove(answer as string) as BitMove);
          }
          if (!_engine.kill) evalNext();
        });
      }
      return;
    }
  }
//   historySave();
};

export const applyEval = (m: string, s: number, d: number) => {
  const _engine = getEngine();
  if (!_engine) return;
  let _curmoves = getCurrentMoves();
  if (s == null || m.length < 4 || _engine.depth == 0) return;
  for (var i = 0; i < _curmoves.length; i++) {
    if (
      _curmoves[i].move.from.x == "abcdefgh".indexOf(m[0]) &&
      _curmoves[i].move.from.y == "87654321".indexOf(m[1]) &&
      _curmoves[i].move.to.x == "abcdefgh".indexOf(m[2]) &&
      _curmoves[i].move.to.y == "87654321".indexOf(m[3])
    ) {
      if (d > _curmoves[i].depth) {
        _curmoves[i].eval = _curmoves[i].w ? -s : s;
        _curmoves[i].depth = d;
        updateCurrentMoves(_curmoves);
        // showEvals();
      }
      break;
    }
  }
};

export const evalAll = () => {
  const _engine = getEngine();

  if (_engine == null || !_engine.ready || !_engine.waiting) {
    if (_engine) _engine.kill = true;
    window.setTimeout(evalAll, 50);
    return;
  }
  _engine.kill = false;
  _engine.waiting = false;

  let _curmoves = getCurrentMoves();
  for (var i = 0; i < _curmoves.length; i++) {
    _curmoves[i].eval = null;
    _curmoves[i].depth = 0;
  }
  if (_engine.depth == 0) {
    _engine.waiting = true;
    return;
  }
  var fen = getCurrentFen();
  _engine.send && _engine.send("stop");
  _engine.send && _engine.send("ucinewgame");
  _engine.send && _engine.send("setoption name Skill Level value 20");
  _engine.score = null;
  if (_curmoves.length == 0) {
    _engine.waiting = true;
    if (!_engine.kill) evalNext();
    return;
  }
  _engine.eval &&
    _engine.eval(
      fen,
      function done(str: string) {
        const history = getHistory();
        _engine.waiting = true;
        if (fen != getCurrentFen()) return;
        var matches = str.match(/^bestmove\s(\S+)(?:\sponder\s(\S+))?/);
        if (matches && matches.length > 1) {
          applyEval(matches[1], _engine.score as number, _engine.depth - 1);
          if (history.history1[history.historyindex][0] == fen)
            addHistoryEval(
              history.historyindex,
              _engine.score as number,
              _engine.depth - 1,
              parseBestMove(matches[1]) as BitMove
            );
        }
        if (!_engine.kill) evalNext();
      },
      function info(depth: number, score: number, pv: string[]) {
        const history = getHistory();
        if (fen != getCurrentFen() || depth <= 10) return;
        applyEval(pv[0], score, depth - 1);
        if (history.history1[history.historyindex][0] == fen)
          addHistoryEval(
            history.historyindex,
            score,
            depth - 1,
            parseBestMove(pv[0]) as BitMove
          );
      }
    );
};

export const getEvalText = (e: number, s: boolean): string => {
  if (e == null) return s ? "" : "?";
    var matein = Math.abs(Math.abs(e) - 1000000);
    if (Math.abs(e) > 900000) {
        if (s) return (e > 0 ? "+M" : "-M") + matein;
        else return (e > 0 ? "white mate in " : "black mate in ") + matein;
    }
    return (e / 100).toFixed(2);
}