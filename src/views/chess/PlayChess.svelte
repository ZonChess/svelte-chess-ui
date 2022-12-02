<script lang="ts">
  import { onMount } from "svelte";
  import {
    fenConfig,
    getEngine,
    loadFen,
    updateChessConfig,
    updateEngine,
    updateFen,
    updateHistory,
  } from "../../store/chess/board";

  import { evalAll } from "../../lib/chess/eval";
  import { refreshMoves } from "../../lib/chess/move";
  import { loadEngine } from "../../lib/chess/engine";
  import { loadHistory } from "../../lib/chess/history";
  import { loadSettings } from "../../lib/chess/settings";
  import MainUI from "../../components/chess/ui/MainUI.svelte";
  import SideUI from "../../components/chess/ui/SideUI.svelte";
  import Player from "../../components/chess/player/Player.svelte";
  import ChessboardUI from "../../components/chess/ui/ChessboardUI.svelte";
  import Board from "../../components/chess/board/Board.svelte";
  import BoardControls from "../../components/chess/board.controls/BoardControls.svelte";
  import SidebarTabs from "../../components/chess/sidebar.tabs/SidebarTabs.svelte";
  import BoardEvaluation from "../../components/chess/board.evaluation/BoardEvaluation.svelte";

  let fen: string | null = null;

  onMount(async () => {
    updateChessConfig(loadSettings());
    updateEngine(loadEngine());
    updateHistory(loadHistory());
    fenConfig.subscribe((fConfig) => {
      if (fen !== fConfig) {
        fen = fConfig;
        refreshMoves();
        const _engine = getEngine();
        if (_engine && !_engine.kill) evalAll();
      }
    });
    setTimeout(() => {
      loadFen();
    }, 100);
  });

  /**
   * Event handler for "fen" event of Chessboard instance
   */
  function onFen(event: CustomEvent) {
    updateFen(event.detail.fen);
  }
</script>

<div class="flex dark-mode">
  {#if fen !== null}
    <MainUI>
      <Player position="top" name="Computer" time="9:23" />
      <ChessboardUI>
        <BoardEvaluation />
        <Board fenConfig={fen} on:fen={onFen} />
        <BoardControls />
      </ChessboardUI>
      <Player position="bottom" name="Tay Dong" time="6:28" />
    </MainUI>
  {/if}
  <SideUI>
    <SidebarTabs />
  </SideUI>
</div>
