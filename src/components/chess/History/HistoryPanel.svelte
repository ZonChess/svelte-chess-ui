<script lang="ts">
  import { getHistoryMoveList } from "../../../lib/chess/history";
  import { history } from "../../../store/chess/board";
  import type { HistoryMoveType } from "../../../store/chess/type";
  import HistoryMove from "./HistoryMove.svelte";

  let historyMoveList: HistoryMoveType[] = getHistoryMoveList();

  history.subscribe((h) => {
    historyMoveList = getHistoryMoveList();
  });
</script>

<vertical-move-list
  board-id="board-vs-personalities"
  class="play-controller--updated-bot-chat-moveList vertical-move-list"
>
  {#each historyMoveList as m}
    <div class="move" data-whole-move-number={m[0]} data-ply={m[0]}>
      {m[0]}.
      <HistoryMove move={m[1]} player="w" />
      {#if m[2]}
        <HistoryMove move={m[2]} player="b" />
      {/if}
    </div>
  {/each}
</vertical-move-list>

<style>
  .vertical-move-list .move {
    text-align: left;
  }
</style>
