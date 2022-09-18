<script lang="ts">
  import {
    chessConfig,
    getChessConfig,
  } from "../../../store/chess/board";
  import Lines from "./Lines.svelte";

  let lines: boolean = getChessConfig()?.lines;

  chessConfig.subscribe((config) => {
    lines = config?.lines;
  });
</script>

{#if lines}
  <Lines />
{/if}