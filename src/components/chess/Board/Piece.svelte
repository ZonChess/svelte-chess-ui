<script lang="ts">
  import {
    getFile,
    getPlayerFromPiece,
    getRank,
  } from "../../../lib/chess/piece";
  import type { PieceType } from "../../../store/chess/type";

  export let file: number;
  export let rank: number;
  export let pieceType: PieceType;
  export let selectHandlers = null;
  export let dragging: boolean;
  export let translateX: number | null = null;
  export let translateY: number | null = null;

  $: player = getPlayerFromPiece(pieceType);
  $: pText = pieceType.toLocaleLowerCase();
  $: position = `${getFile(file) + 1}${getRank(rank) + 1}`;
  $: boardPos = { x: file, y: rank };
  $: {
    if (selectHandlers === null) {
      selectHandlers = () => {};
    }
  }

  $: pieceStyle = (): string => {
    if (translateX !== null && translateY !== null && dragging) {
      return `transform: translate(${translateX.toFixed(
        3
      )}%, ${translateY.toFixed(3)}%)`;
    }
    return "";
  };
</script>

{#if pieceType !== "-"}
  <div
    class="piece {player}{pText} square-{position} {dragging ? 'dragging' : ''}"
    style={pieceStyle()}
    use:selectHandlers={boardPos}
  />
{/if}

<style scoped>
  .piece.bp {
    background-image: url("@/assets/chess/themes/pieces/neo/150/bp.png");
  }
  .piece.br {
    background-image: url("@/assets/chess/themes/pieces/neo/150/br.png");
  }
  .piece.bn {
    background-image: url("@/assets/chess/themes/pieces/neo/150/bn.png");
  }
  .piece.bb {
    background-image: url("@/assets/chess/themes/pieces/neo/150/bb.png");
  }
  .piece.bk {
    background-image: url("@/assets/chess/themes/pieces/neo/150/bk.png");
  }
  .piece.bq {
    background-image: url("@/assets/chess/themes/pieces/neo/150/bq.png");
  }
  .piece.wp {
    background-image: url("@/assets/chess/themes/pieces/neo/150/wp.png");
  }
  .piece.wr {
    background-image: url("@/assets/chess/themes/pieces/neo/150/wr.png");
  }
  .piece.wn {
    background-image: url("@/assets/chess/themes/pieces/neo/150/wn.png");
  }
  .piece.wb {
    background-image: url("@/assets/chess/themes/pieces/neo/150/wb.png");
  }
  .piece.wk {
    background-image: url("@/assets/chess/themes/pieces/neo/150/wk.png");
  }
  .piece.wq {
    background-image: url("@/assets/chess/themes/pieces/neo/150/wq.png");
  }
</style>
