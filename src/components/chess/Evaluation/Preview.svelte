<script lang="ts">
  import { onMount } from "svelte";

  import { doBitMove } from "../../../lib/chess/move";
  import { getFile, getRank } from "../../../lib/chess/piece";
  import { chessConfig, getChessConfig } from "../../../store/chess/board";
  import { FILE_BOARD, RANK_BOARD } from "../../../store/chess/constant";

  import type {
    BoardPos,
    Fen,
    LineMoveType,
    PreviewPositionType,
  } from "../../../store/chess/type";
  import PreviewPiece from "./PreviewPiece.svelte";

  export let move: LineMoveType;

  let flipped: boolean = getChessConfig()?.flipped;
  let hightlightData: PreviewPositionType[] = [];

  const getHightlightPosition = (coord: BoardPos): PreviewPositionType => {
    let horizontal: number = getRank(coord.y);
    let vertical: number = getFile(coord.x);

    if (flipped) {
      return {
        top: horizontal * 12.5,
        bottom: (RANK_BOARD - 1 - horizontal) * 12.5,
        left: vertical * 12.5,
        right: (FILE_BOARD - 1 - vertical) * 12.5,
      };
    } else {
      return {
        top: (RANK_BOARD - 1 - horizontal) * 12.5,
        bottom: horizontal * 12.5,
        left: (FILE_BOARD - 1 - vertical) * 12.5,
        right: vertical * 12.5,
      };
    }
  };

  chessConfig.subscribe(config => {
    flipped = config?.flipped;
    hightlightData = [];
    hightlightData.push(getHightlightPosition(move.move.from));
    hightlightData.push(getHightlightPosition(move.move.to));
    hightlightData = hightlightData;
  })

  onMount(() => {
    hightlightData.push(getHightlightPosition(move.move.from));
    hightlightData.push(getHightlightPosition(move.move.to));
    hightlightData = hightlightData;
  });

  let pos: Fen = doBitMove(move.pos, move.move);
</script>

<div
  class="engine-line-preview"
  style="left: 0px;top: 0px;/* display: none; */"
>
  <div
    class="game-preview-component"
    line-index="0"
    data-cy="analysis-tab-analysis-lines"
    show-figurine="true"
  >
    {#each hightlightData as hightlight}
      <div
        class="game-preview-hightlight"
        style="inset: {hightlight.top}% {hightlight.left}% {hightlight.bottom}% {hightlight.right}%;"
      />
    {/each}
    {#each pos.b as fItem, f}
      {#each fItem as pieceType, r}
        {#if pieceType !== "-"}
          <PreviewPiece {pieceType} rank={r} file={f} />
        {/if}
      {/each}
    {/each}
  </div>
</div>

<style>
  .engine-line-preview {
    background-color: #dad8d6;
    border-radius: 0.2rem;
    box-shadow: 0.2rem 0.8rem 1.5rem rgb(38 33 27 / 15%);
    padding: 1rem;
    /* transform: translate3d(-1rem, 3rem, 0); */
    z-index: 1000;
  }

  .game-preview-component {
    width: 160px;
    height: 160px;
    max-width: none;
    padding-bottom: 0px;
    background-image: url("@/assets/chess/themes/boards/green/40.png");
  }

  .game-preview-component {
    background-size: 100% 100%;
    position: relative;
  }

  .game-preview-hightlight {
    background-color: rgb(255, 255, 51);
    height: 12.5%;
    opacity: 0.5;
    position: absolute;
    width: 12.5%;
  }
</style>
