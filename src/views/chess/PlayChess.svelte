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
  import MainUI from "../../components/chess/UI/MainUI.svelte";
  import SideUI from "../../components/chess/UI/SideUI.svelte";
  import Player from "../../components/chess/Player/Player.svelte";
  import ChessboardUI from "../../components/chess/UI/ChessboardUI.svelte";
  import Board from "../../components/chess/Board/Board.svelte";
  import BoardControls from "../../components/chess/BoardControls/BoardControls.svelte";
  import SidebarTabs from "../../components/chess/SideBarTabs/SidebarTabs.svelte";
  import BoardEvaluation from "../../components/chess/BoardEvaluation/BoardEvaluation.svelte";

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
      <Player position="top" name="Guest0406923677" time="9:23" />
      <ChessboardUI>
        <BoardEvaluation />
        <Board fenConfig={fen} on:fen={onFen} />
        <BoardControls />
      </ChessboardUI>
      <Player position="bottom" name="Guest0883962767" time="6:28" />
    </MainUI>
  {/if}
  <SideUI>
    <SidebarTabs />
  </SideUI>
</div>
