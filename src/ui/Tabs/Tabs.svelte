<script lang="ts">
  import type { TabType } from "../../../store/chess/type";

  import TabHeader from "./TabHeader.svelte";

  export let tabs: TabType[];
  export let classes: string = "";

  const handleTabClick = (name: string) => {
    tabs = tabs.map((t) => {
      return { ...t, isActive: t.name === name };
    });
  };

  $: tab = tabs.find((t) => t.isActive);
</script>

<div class="sidebar-tabs-component">
  {#each tabs as tab}
    <TabHeader
      name={tab.name}
      active={tab.isActive}
      icon={tab.icon}
      on:click={() => handleTabClick(tab.name)}
    />
  {/each}
</div>

<div class="{classes}" data-cy={tab.dataCy} >
  <svelte:component this={tab.content} />
</div>

<style>
  .sidebar-tabs-component {
    background-color: var(--globalSecondaryBackground);
    border-radius: 0.5rem 0.5rem 0 0;
    display: flex;
    flex: 0 0 auto;
  }

  .sidebar-tab-content-component {
    display: flex;
    flex: 1 1 100%;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    min-height: 0;
  }

  .sidebar-view-content > :global(:first-child) {
    flex: 1;
    height: calc(100% - 12rem);
    overflow: auto;
  }
</style>
