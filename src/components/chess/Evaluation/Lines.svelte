<script lang="ts">
  import { currMoves } from "../../../store/chess/board";
  import type { Move } from "../../../store/chess/type";
  import Line from "./Line.svelte";

  export let showboardPreview: boolean = true;
  let curmoves: Move[] = [];

  currMoves.subscribe((_curmoves) => {
    if (_curmoves.length > 0) {
      var sortfunc = function (a: Move, b: Move) {
        var a0 = a.eval == null ? -2000000 : a.eval * (_curmoves[0].w ? -1 : 1);
        var b0 = b.eval == null ? -2000000 : b.eval * (_curmoves[0].w ? -1 : 1);

        var r = 0;
        if (a0 < b0 || (a0 == b0 && a.san < b.san)) r = 1;
        if (a0 > b0 || (a0 == b0 && a.san > b.san)) r = -1;
        return r;
      };
      _curmoves.sort(sortfunc);
      curmoves = _curmoves.slice(0, 3);
    } else {
      curmoves = [];
    }
  });

  // let lineMove: LineMoveType = {
  //   idx: 1,
  //   move: {from: {x: 4, y: 6}, to: {x: 4, y: 4}},
  //   pos: parseFEN(START_FEN),
  //   showIndex: true
  // }
</script>

<div data-cy="analysis-tab-analysis-lines" class="analysis-view-lines">
  {#each curmoves as move, index}
    <Line {showboardPreview} {move} {index} />
  {/each}
</div>

<style>
  .analysis-view-lines {
    background-color: var(--globalSecondaryBackground);
    color: var(--globalColorThemeHigh);
    padding: 0 0.5rem;
  }

  .analysis-view-lines :global(.engine-line-component:first-child) {
    border-top: none;
  }
</style>
