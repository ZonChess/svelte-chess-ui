<script lang="ts">
  import { parseFEN } from "../../../lib/chess/fen";
  import { doBitMove, parseBestMove } from "../../../lib/chess/move";

  import { getHistory } from "../../../store/chess/board";

  import type { Fen, LineMoveType, Move } from "../../../store/chess/type";
  import Icon from "../../../ui/Icon/Icon.svelte";
  import EvalButton from "./EvalButton.svelte";
  import LineMove from "./LineMove.svelte";

  export let showboardPreview: boolean = true;
  export let move: Move;
  export let index: number;
  let open: boolean = false;
  let historyObj = getHistory();
  let moveList: LineMoveType[] = [];

  const hanldeOpenLine = () => {
    open = !open;
  };

  $: {
    let currentindex: number = Math.floor(historyObj.historyindex / 2 + 1);
    let currentpos: Fen = parseFEN(
      historyObj.history1[historyObj.historyindex][0]
    );
    moveList = [];
    moveList.push({
      pos: currentpos,
      move: move.move,
      idx: currentindex,
      showIndex: true,
      san: move.san,
    });
    currentpos = doBitMove(currentpos, move.move);
    if (currentpos.w) {
      currentindex++;
    }
    for (let movestr of move.answerpv) {
      const bitmove = parseBestMove(movestr);
      moveList.push({
        pos: currentpos,
        move: bitmove,
        idx: currentindex,
        showIndex: currentpos.w,
        san: movestr,
      });
      currentpos = doBitMove(currentpos, bitmove);
      if (!currentpos.w) {
        currentindex++;
      }
    }
  }

  $: showThinking = move.eval === null;
</script>

<div
  class="engine-line-component engine-line-withicon"
  line-index={index}
  class:engine-line-open={open}
  data-cy="analysis-tab-analysis-lines"
>
  <span class="engine-line-thinking" class:show-thinking={showThinking} />
  {#if !showThinking}
    <EvalButton evaluation={move.eval} />
    {#each moveList as lineMove, index}
      <LineMove move={lineMove} {showboardPreview} {index} />
    {/each}
    <div
      class="icon-font-component engine-line-icon"
      class:engine-line-inverted={open}
      on:click={hanldeOpenLine}
    >
      <Icon name="caret-down" classes="icon-font-primary" />
    </div>
    <div
      class="engine-line-preview"
      style="left: 0px; top: 0px; display: none;"
    >
      <div
        class="game-preview-component"
        line-index="0"
        data-cy="analysis-tab-analysis-lines"
        show-figurine="true"
        style="width: 160px; height: 160px; max-width: none; padding-bottom: 0px; background-image: url(&quot;//images.chesscomfiles.com/chess-themes/boards/green/40.png&quot;);"
      >
        <!---->
        <!---->
      </div>
    </div>
  {/if}
</div>

<style>
  .engine-line-component.engine-line-withicon {
    padding-right: 1.8rem;
  }

  .engine-line-component {
    --moveSanFigurineFontSize: 2rem;
    --moveSanFigurinePinch: 0.3rem;
    border-top: 0.1rem solid var(--globalBorder);
    font-size: 1.5rem;
    font-weight: 600;
    min-height: 2.6rem;
    overflow: hidden;
    padding: 0.2rem 0;
    position: relative;
    text-indent: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    text-align: left;
  }

  .engine-line-component > :global(span) {
    vertical-align: middle;
  }

  .engine-line-component.engine-line-open {
    overflow: visible;
    text-overflow: clip;
    white-space: normal;
  }

  .engine-line-thinking {
    background-image: url(@/assets/chess/themes/chex12.86811052.gif);
    display: none;
    height: 1.2rem;
    margin-left: 0.5rem;
    position: relative;
    width: 1.2rem;
  }

  .show-thinking {
    display: inline-block;
  }

  .icon-font-component {
    align-items: center;
    display: flex;
    justify-content: center;
    overflow: hidden;
  }

  .engine-line-icon {
    align-items: center;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    overflow: visible;
    position: relative;
    position: absolute;
    right: 0.4rem;
    top: 0.5rem;
  }

  .engine-line-icon.engine-line-inverted {
    transform: rotate(180deg);
  }

  .engine-line-icon:after {
    border-radius: 100%;
    content: "";
    display: block;
    height: 1.595rem;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    transition: background 0.2s ease;
    width: 1.595rem;
  }

  .engine-line-icon:hover::after {
    background-color: hsla(0, 0%, 100%, 0.1);
  }
</style>
