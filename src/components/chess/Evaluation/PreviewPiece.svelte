<script lang="ts">
  import {
    getPreviewPieceImage,
  } from "../../../lib/chess/piece";
  import {
    chessConfig,
    getChessConfig,
  } from "../../../store/chess/board";
  import { FILE_BOARD, RANK_BOARD } from "../../../store/chess/constant";
  import type { PieceType } from "../../../store/chess/type";

  export let pieceType: PieceType;
  export let rank: number;
  export let file: number;
  let flipped: boolean = getChessConfig()?.flipped;

  chessConfig.subscribe((config) => {
    flipped = config?.flipped;
  });

  let imageUrl: string = getPreviewPieceImage(pieceType);
  $: bottom = (flipped ? rank : RANK_BOARD - 1 - rank) * 12.5;
  $: left = (flipped ? FILE_BOARD - 1 - file : file) * 12.5;
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<img
  src={imageUrl}
  width="20"
  height="20"
  class="game-preview-piece"
  style="width: 12.5%; height: 12.5%; bottom: {bottom}%; left: {left}%"
/>

<style>
  .game-preview-piece {
    position: absolute;
  }
</style>
