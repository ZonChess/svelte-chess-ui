import type { EngineType } from "../../store/chess/type";
import { sf, sfWasm } from "./wasm";

export const loadEngine = (): EngineType => {
  var engine: EngineType = {
    ready: false,
    kill: false,
    waiting: true,
    depth: 15,
    lastnodes: 0,
  };

  var wasmSupported =
    typeof WebAssembly === "object" &&
    WebAssembly.validate(
      Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
    );
  if (typeof Worker === "undefined") return engine;

  var workerData = new Blob([atob(wasmSupported ? sfWasm : sf)], {
    type: "text/javascript",
  });
  try {
    var worker: Worker = new Worker(window.URL.createObjectURL(workerData));
  } catch (err) {
    return engine;
  }

  worker.onmessage = function (e) {
    if (engine.messagefunc) engine.messagefunc(e.data);
  };

  engine.send = function send(cmd: string, message?: Function) {
    cmd = String(cmd).trim();
    engine.messagefunc = message;
    worker.postMessage(cmd);
  };

  engine.eval = (fen: string, done?: Function, info?: Function) => {
    engine.send && engine.send("position fen " + fen);
    engine.send &&
      engine.send("go depth " + engine.depth, function message(str: string) {
        var matches = str.match(
          /depth (\d+) .*score (cp|mate) ([-\d]+) .*nodes (\d+) .*pv (.+)/
        );
        if (!matches)
          matches = str.match(/depth (\d+) .*score (cp|mate) ([-\d]+).*/);
        if (matches) {
          if (engine.lastnodes == 0) engine.fen = fen;
          if (matches.length > 4) {
            var nodes = Number(matches[4]);
            if (nodes < engine.lastnodes) engine.fen = fen;
            engine.lastnodes = nodes;
          }
          var depth = Number(matches[1]);
          var type = matches[2];
          var score = Number(matches[3]);
          if (type == "mate")
            score = (1000000 - Math.abs(score)) * (score <= 0 ? -1 : 1);
          engine.score = score;
          if (matches.length > 5) {
            var pv = matches[5].split(" ");
            if (info != null && engine.fen == fen) info(depth, score, pv);
          }
        }
        if (
          str.indexOf("bestmove") >= 0 ||
          str.indexOf("mate 0") >= 0 ||
          str == "info depth 0 score cp 0"
        ) {
          if (engine.fen == fen) done && done(str);
          engine.lastnodes = 0;
        }
      });
  };

  engine.send("uci", function onuci(str: string) {
    if (str === "uciok") {
      engine.send &&
        engine.send("isready", function onready(str: string) {
          if (str === "readyok") {
            engine.ready = true;
          }
        });
    }
  });

  return engine;
};
