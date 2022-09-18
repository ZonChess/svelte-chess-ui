<script lang="ts">
  import { historyMove } from "../../../lib/chess/history";

  import { getHistory } from "../../../store/chess/board";

  import type {
    HistoryPlayerSan,
    Player,
  } from "../../../store/chess/type";
  import Icon from "../../../ui/Icon/Icon.svelte";

  export let move: HistoryPlayerSan;
  export let player: Player;

  const handleHistoryClick = () => {
    if (move[3]) {
      return;
    }

    historyMove(move[0] - getHistory().historyindex);
  };

  let playerText: string = player === "w" ? "white" : "black";
</script>

<div
  class="node {playerText}"
  class:selected={move[3]}
  data-ply={move[0]}
  on:click={handleHistoryClick}
>
  {#if move[1] !== "-"}
    <Icon name={`${move[1]}-${playerText}`} />
  {/if}
  {move[2]}
</div>
