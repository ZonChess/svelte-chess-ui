<script lang="ts">
  import {
    genMoves,
    parseSan,
    sanMove,
  } from "../../../lib/chess/move";
  import type { LineMoveType } from "../../../store/chess/type";
  import Icon from "../../../ui/Icon/Icon.svelte";
  import Preview from "./Preview.svelte";

  export let move: LineMoveType;
  export let showboardPreview: boolean = true;
  export let index: number;

  $: moveInfo = parseSan(sanMove(move.pos, move.move, genMoves(move.pos)));
</script>

<span
  class="move-san-component engine-line-node engine-line-clickable"
  data-cy="engine-line-move-san-{index}"
>
  {#if move.showIndex}
    <span class="move-san-premove">{move.idx}{!move.pos.w ? "..." : "."}</span>
  {/if}
  <span class="move-san-highlight">
    <span data-cy="move-san-san" class="move-san-san" />
    {#if moveInfo.piece !== "-"}
      <Icon
        name={`${moveInfo.piecestr}-${move.pos.w ? "white" : "black"}`}
        classes="move-san-figurine"
      />
    {/if}
    <span class="move-san-afterfigurine">{moveInfo.movestr}</span></span
  >
  <!----></span
>

<style>
  .move-san-premove {
    margin-right: 0.1rem;
  }

  .engine-line-node.engine-line-clickable {
    cursor: pointer;
    padding-right: 0.1rem;
  }

  .move-san-san {
    order: 1;
  }

  .move-san-afterfigurine {
    order: 3;
  }
</style>
