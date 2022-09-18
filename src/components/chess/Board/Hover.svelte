<script lang="ts">
  import { getFile, getRank } from "../../../lib/chess/piece";

  export let file: number;
  export let rank: number;
  export let visibility: boolean = true;
  $: position = `${getFile(file) + 1}${getRank(rank) + 1}`;
</script>

<div
  class="hover-square square-{position}"
  style="border-width: 3px; {visibility && 'visibility: hidden;'}"
/>
