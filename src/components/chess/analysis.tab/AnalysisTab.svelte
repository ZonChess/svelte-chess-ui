<script lang="ts">
  import EvaluationPanel from "../Evaluation/EvaluationPanel.svelte";
  import HistoryPanel from "../History/HistoryPanel.svelte";
  import OpeningText from "../Opening/OpeningText.svelte";
  import SettingsPanel from "../Settings/SettingsPanel.svelte";
</script>

<div data-cy="analysis-tab-analysis" class="analysis-view-component">
  <SettingsPanel />
  <EvaluationPanel />
  <!-- <OpeningText /> -->
  <HistoryPanel />
</div>

<style>
  .analysis-view-component {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
</style>
