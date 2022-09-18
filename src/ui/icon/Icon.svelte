<script lang="ts">
  export let classes: string = "";
  export let name: string;
  export let data: string = "";
</script>

<span
  type="button"
  data-cy={data}
  class="{classes} icon-font-chess {name}"
/>

<style>
  .analysis-options-icon {
    cursor: pointer;
    font-size: 2rem;
    height: 2rem;
    margin-left: 0.5rem;
    padding-left: 0.5rem;
    width: 2rem;
  }

  .icon-font-chess {
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    font-family: "Chess New";
    font-weight: 400;
    line-height: 1;
    text-align: center;
  }

  .move-san-figurine {
    font-size: var(--moveSanFigurineFontSize);
    margin-right: 0.15rem;
    margin-top: calc(var(--moveSanFigurineFontSize) / -10);
  }

  .icon-font-primary {
    color: #8c8a88;
  }

  .eco-opening-icon {
    font-size: 2.3rem;
    height: 2.3rem;
    width: 2.3rem;
  }
</style>
