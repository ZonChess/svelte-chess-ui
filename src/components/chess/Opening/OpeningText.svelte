<script lang="ts">
  import Icon from "../../../ui/Icon/Icon.svelte";

  let title: string = "Starting Position";
  let links: { icon: string; classes: string }[] = [
    {
      icon: "chess-book",
      classes: "eco-opening-opening",
    },
    {
      icon: "circle-compass",
      classes: "eco-opening-explorer",
    },
  ];
</script>

<eco-opening
  board-id="board-single"
  link-to-explorer="true"
  class="eco-opening-panel analysis-view-opening"
>
  <span class="eco-opening-name">{title}</span>
  <div class="eco-opening-links">
    {#each links as link}
      <a class={link.classes} href="#"
        ><Icon name={link.icon} classes="eco-opening-icon" /></a
      >
    {/each}
  </div>
</eco-opening>

<style>
  .analysis-view-opening {
    border-bottom: 1px solid var(--globalBorder);
  }

  .eco-opening-panel {
    color: var(--globalColorThemeMid);
    height: 4rem;
    justify-content: space-between;
  }

  .eco-opening-panel,
  .eco-opening-panel .eco-opening-links {
    align-items: center;
    display: flex;
    flex-shrink: 0;
  }

  .eco-opening-panel .eco-opening-name {
    display: inline-block;
    font-size: 1.3rem;
    line-height: 2rem;
    overflow: hidden;
    padding-left: 1.6rem;
    padding-right: 1rem;
    position: relative;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: pre;
  }

  .eco-opening-panel .eco-opening-explorer,
  .eco-opening-panel .eco-opening-opening {
    padding-left: 0.5rem;
    color: inherit;
  }

  .eco-opening-panel .eco-opening-explorer {
    padding-right: 1rem;
  }
</style>
