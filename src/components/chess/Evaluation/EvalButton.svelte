<script lang="ts">
  import { getEvalText } from "../../../lib/chess/eval";

  export let evaluation: number;
</script>

<a
  target="_blank"
  href="#"
  class="score-text-score"
  class:score-text-negative={evaluation < 0}
  >{evaluation >= 0 ? "+" : ""}{getEvalText(evaluation, false)}</a
>

<style>
  .score-text-score {
    align-items: center;
    background-color: #fff;
    border-radius: 0.3rem;
    color: #312e2b;
    display: inline-flex;
    font-weight: 700;
    justify-content: center;
    margin-right: 0.4rem;
    padding: 0.1rem 0.5rem;
    vertical-align: middle;
    width: 4.5rem;
  }

  .score-text-score.score-text-negative {
    background-color: #312e2b;
    color: #fff;
  }
</style>
