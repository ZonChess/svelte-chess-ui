<script lang="ts">
  import {
    getChessConfig,
    updateChessConfig,
  } from "../../../store/chess/board";

  const handleFlipClick = () => {
    let config = getChessConfig();
    config.flipped = !config.flipped;
    updateChessConfig(config);
  };
</script>

<div id="board-layout-controls" class="board-layout-controls hide-board-icons">
  <div>
    <button
      id="board-controls-settings"
      aria-label="Settings"
      type="button"
      class="board-layout-icon icon-font-chess circle-gearwheel"
    />
    <button
      id="board-controls-focus"
      aria-label="Zoom"
      type="button"
      class="board-layout-icon icon-font-chess maximize"
    />
    <button
      id="board-controls-theatre"
      aria-label="Theatre View"
      type="button"
      class="board-layout-icon icon-font-chess theatre"
    />
    <button
      id="board-controls-flip"
      aria-label="Flip Board"
      type="button"
      class="board-layout-icon icon-font-chess repeat"
      on:click={handleFlipClick}
    />
  </div>
  <span class="board-layout-icon icon-font-chess resize" />
</div>
