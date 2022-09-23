<script lang="ts">
  import { onMount } from "svelte";

  import {
    chessConfig,
    getChessConfig,
    updateChessConfig,
  } from "../../../store/chess/board";
  import Icon from "../../../ui/Icon/Icon.svelte";
  import Switch from "../../../ui/Switch/Switch.svelte";

  let settings = getChessConfig();
  let toggleData: {
    label: string;
    id: string;
    classes?: string;
    checked: boolean;
  }[] = [];

  const handleChangeToggle = (event: CustomEvent) => {
    settings = getChessConfig();
    settings[event.detail.id] = event.detail.checked;
    updateChessConfig(settings);
  };

  const updateToggleData = () => {
    toggleData = [
      // {
      //   label: "Evaluation",
      //   id: "evaluation",
      //   classes: "analysis-options-toggle",
      //   checked: settings?.evaluation,
      // },
      {
        label: "Lines",
        id: "lines",
        classes: "analysis-options-toggle",
        checked: settings?.lines,
      },
    ];
  };

  chessConfig.subscribe((config) => {
    settings = config;
    updateToggleData();
  });

  onMount(() => {
    updateToggleData();
  });
</script>

<div class="analysis-options-component" data-cy="analysis-tab-analysis-options">
  <div class="analysis-options-bar">
    <div class="analysis-options-toggles">
      {#each toggleData as item}
        <Switch
          label={item.label}
          id={item.id}
          classes={item.classes}
          on:toggle={handleChangeToggle}
          checked={item.checked}
        />
      {/each}
      <!---->
    </div>
    <div class="analysis-options-right">
      <!---->
      <div class="analysis-options-depth">Stockfish</div>
      <!-- <Icon
        name="circle-gearwheel"
        classes="analysis-options-icon"
        data="analysis-options-settings-button"
        tooltipData="Settings"
        disabledTooltip={false}
      /> -->
    </div>
  </div>
</div>

<style>
  .analysis-options-component,
  .analysis-options-component:global(label) {
    color: var(--globalColorThemeMid);
  }

  .analysis-options-component {
    background-color: var(--globalSecondaryBackground);
    border-bottom: 0.1rem solid var(---globalBorder);
    font-size: 1.2rem;
  }

  .analysis-options-bar {
    display: flex;
    justify-content: space-between;
    min-height: 0;
    padding: 1rem 1.5rem;
  }

  .analysis-options-toggles {
    display: flex;
    flex: 1 0;
    flex-wrap: wrap;
    margin-right: -2rem;
  }

  .analysis-options-right {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
</style>
