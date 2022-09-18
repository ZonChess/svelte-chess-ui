<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let label: string;
  export let id: string;
  export let checked: boolean = false;
  export let classes: string = "";

  /**
   * Method used to dispatch custom events
   */
  const dispatch: Function = createEventDispatcher();

  const handleCheckboxClick = () => {
    checked = !checked;
    dispatch("toggle", {
      id: id,
      checked: checked,
    });
  };
</script>

<div class="switch-component analysis-options-toggle {classes}">
  <label for={id}>{label}</label>
  <div
    class="ui_v5-switch-component switch-switch"
    data-cy="switch-{id}"
    on:click={handleCheckboxClick}
  >
    <input
      {id}
      type="checkbox"
      name="evaluation"
      class="ui_v5-switch-checkbox"
      {checked}
    />
    <label for="evaluation" class="ui_v5-switch-label"
      ><div class="ui_v5-switch-button" /></label
    >
  </div>
</div>

<style>
  .switch-component {
    display: inline-block;
    font-size: 1.2rem;
    height: 2.2rem;
    padding: 0.3rem 0;
  }

  .switch-component .switch-switch {
    display: inline-block;
    left: -0.75rem;
    position: relative;
    top: 0.1rem;
    transform: scale(0.55);
    transform-origin: top;
  }

  .ui_v5-switch-component {
    flex-shrink: 0;
    font-size: 1rem;
    height: 2.6rem;
    width: 4.6rem;
    padding: 0.2rem;
  }

  input {
    color: var(--globalColorThemeMid);
  }

  .ui_v5-switch-checkbox:not(.ui_v5-switch-readonly):checked
    + .ui_v5-switch-label {
    background-color: rgb(119, 155, 77);
  }

  .ui_v5-switch-checkbox {
    clip: rect(0px, 0px, 0px, 0px);
    height: 0.1rem;
    position: absolute;
    width: 0.1rem;
    overflow: hidden;
    background-color: blue;
    z-index: 10000;
  }

  .ui_v5-switch-label {
    background-color: rgba(117, 117, 117, 0.4);
    cursor: pointer;
    display: block;
    height: 100%;
    border-width: 0.1rem;
    border-style: solid;
    border-color: rgba(255, 255, 255, 0.2);
    border-image: initial;
    border-radius: 1.1rem;
  }

  .ui_v5-switch-checkbox:not(.ui_v5-switch-readonly):checked
    + .ui_v5-switch-label
    .ui_v5-switch-button {
    margin-left: 1.9rem;
  }

  .ui_v5-switch-button {
    background-color: rgb(232, 231, 230);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0.1rem;
    height: 2.4rem;
    width: 2.4rem;
    border-width: 0.1rem;
    border-style: solid;
    border-color: rgb(218, 215, 213);
    border-image: initial;
    border-radius: 50%;
    margin: -0.2rem;
  }

  .switch-component > label {
    color: var(--globalColorThemeMid);
    position: relative;
    top: -1.3rem;
  }

  .ui_v5-switch-button,
  .ui_v5-switch-label {
    transition: all 0.3s ease;
  }
</style>
