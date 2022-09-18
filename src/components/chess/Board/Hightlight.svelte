<script lang="ts">
  import { getFile, getRank } from "../../../lib/chess/piece";

  export let file: number;
  export let rank: number;
  $: position = `${getFile(file) + 1}${getRank(rank) + 1}`;
</script>

<div
  class="highlight square-{position}"
  style="background-color: rgb(255, 255, 0); opacity: 0.5"
  data-test-element="highlight"
/>
