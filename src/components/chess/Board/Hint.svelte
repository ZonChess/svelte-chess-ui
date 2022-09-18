<script lang="ts">
  import { getFile, getRank } from "../../../lib/chess/piece";

  export let file: number;
  export let rank: number;
  export let isCapture: boolean;
  $: position = `${getFile(file) + 1}${getRank(rank) + 1}`;
</script>

{#if isCapture}
  <div
    on:mousedown
    data-test-element="capture-hint"
    class="capture-hint square-{position}"
    style="border-width: 5px;"
  />
{:else}
  <div data-test-element="hint" class="hint square-{position}" on:mousedown />
{/if}
