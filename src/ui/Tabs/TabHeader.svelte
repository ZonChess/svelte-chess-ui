<script lang="ts">
import Icon from "../Icon/Icon.svelte";

  export let active: boolean;
  export let name: string;
  export let icon: string;
</script>

<!-- <a
  href="#"
  on:click
  data-cy="analysis-tab-button-analysis"
  class="sidebar-tabs-tab"
  class:sidebar-tabs-active={active}
  ><Icon name={icon} classes="sidebar-tabs-icon" />
  <span class="sidebar-tabs-label">{name}</span></a
> -->

<button on:click class:sidebar-tabs-active={active} class="block subscription-tab rounded-b-none rounded-r-md border-l border-gray-600">{name}</button>

<style>
  .sidebar-tabs-tab:first-child {
    border-radius: 0.5rem 0 0 0;
  }

  .sidebar-tabs-tab {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    height: 5rem;
    min-width: 0;
    padding: 0.3rem 0;
    position: relative;
    text-align: center;
  }

  .sidebar-tabs-tab:not(.sidebar-tabs-active) {
    background-color: var(--globalTertiaryBackground);
  }

  .sidebar-tabs-tab:last-child {
    border-radius: 0 0.5rem 0 0;
  }

  .sidebar-tabs-tab :global(.sidebar-tabs-icon) {
    color: var(--globalColorThemeLow);
    display: block;
    font-size: 2.8rem;
    height: 2.6rem;
  }

  .sidebar-tabs-tab .sidebar-tabs-label {
    color: var(--globalColorThemeLow);
    font-size: 1.25rem;
    overflow: hidden;
    padding: 0 0.3rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
