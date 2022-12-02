<script lang="ts">
  import type {
    BitMove,
    BoardPos,
    CoordinateType,
  } from "../../../store/chess/type";
  import {
    doMoveHandler,
    getLegalMoves,
    isLegal,
  } from "../../../lib/chess/move";

  import { hasPiece, parseFEN } from "../../../lib/chess/fen";
  import Hightlight from "./Hightlight.svelte";
  import Piece from "./Piece.svelte";
  import Hint from "./Hint.svelte";
  import { FILE_BOARD, RANK_BOARD } from "../../../store/chess/constant";
  import Hover from "./Hover.svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import {
    chessConfig,
    getChessConfig,
    getCurrentFen,
    history,
  } from "../../../store/chess/board";

  export let fenConfig: string;
  let boardElement: HTMLElement;
  let flipped: boolean = false;
  let coordinates: CoordinateType[];

  /**
   * Method used to dispatch custom events.
   */
  const dispatch = createEventDispatcher();

  const mouseDownHandler = (event: Event) => {
    if (
      !(
        (event.target as HTMLElement).classList.contains("piece") ||
        (event.target as HTMLElement).classList.contains("hint")
      )
    ) {
      selectedPos = null;
      legalMoves = null;
    }
  };

  function onFenChange(updatedfen: string, move: BitMove) {
    selectedPos = null;
    legalMoves = null;
    lastmove = move;
    console.log("onFenChange.....chess....");
    dispatch("fen", { fen: updatedfen });
  }

  const hintMouseDownHandler = (file: number, rank: number) => {
    if (isLegal(fen, selectedPos, { x: file, y: rank })) {
      console.log("onFenChange.....chess....case 0....fen", fen);
      // handle move
      doMoveHandler(
        fen,
        { from: selectedPos, to: { x: file, y: rank } },
        onFenChange
      );
    }
  };

  function selectPieceHandlers(piece: HTMLElement, pos: BoardPos) {
    let removeSelectAfterDrop: boolean = false;
    let mouseDownTimeOut = null;
    let chessBounds: DOMRect;
    let pieceSize = 0;

    const onMouseUp = (event: Event) => {};

    function calculatePosition(mouseX: number, mouseY: number) {
      translateX = ((mouseX - chessBounds.x - pieceSize / 2) / pieceSize) * 100;
      translateX = Math.max(Math.min(translateX, FILE_BOARD * 100 - 50), -50);
      translateY = ((mouseY - chessBounds.y - pieceSize / 2) / pieceSize) * 100;
      translateY = Math.max(Math.min(translateY, RANK_BOARD * 100 - 50), -50);
      hover = getHover();
    }

    function handleDragMouseUp(mouseX: number, mouseY: number) {
      console.log("handleDragMouseUp.......chess.....", isDragging);
      if (isDragging) {
        calculatePosition(mouseX, mouseY);
        if (
          mouseX < chessBounds.x ||
          mouseX > chessBounds.x + chessBounds.width ||
          mouseY < chessBounds.y ||
          mouseY > chessBounds.y + chessBounds.height
        ) {
          console.log("hdm.....chess.....case 0.....");
          resetDrag();
        } else if (hover.x === pos.x && hover.y === pos.y) {
          if (removeSelectAfterDrop) {
            console.log("hdm...chess.......case removeSelectAfterDrop.....");
            selectedPos = null;
            legalMoves = null;
          }
          console.log("hdm.....chess.....case 1.....");
          resetDrag();
        } else if (isLegal(fen, pos, { x: hover.x, y: hover.y })) {
          console.log("onFenChange.....chess....case 1");
          // handle move
          doMoveHandler(
            fen,
            { from: selectedPos, to: { x: hover.x, y: hover.y } },
            onFenChange
          );
          console.log("hdm.....chess.....case 2.....");
          resetDrag();
        } else {
          console.log("hdm.....chess.....case 3.....");
          resetDrag();
        }
      }
    }

    function resetDrag() {
      console.log("resetDrag.........chess......");
      isDragging = false;
      translateX = null;
      translateY = null;
      removeSelectAfterDrop = false;
    }

    const onWindowMouseMove = (event: MouseEvent) => {
      console.log("onWindowMouseMove.......CHESS.....", isDragging);
      if (isDragging) {
        calculatePosition(event.clientX, event.clientY);
      }
    };

    const onWindowMouseUp = (event: MouseEvent) => {
      clearTimeout(mouseDownTimeOut);

      if (isDragging) {
        handleDragMouseUp(event.clientX, event.clientY);
      }

      window.removeEventListener("mousemove", onWindowMouseMove);
      window.removeEventListener("mouseup", onWindowMouseUp);
    };

    const onMouseDown = (event: MouseEvent) => {
      if (event.target !== piece || !hasPiece(fen, pos)) {
        return;
      }

      if (
        selectedPos !== null &&
        selectedPos.x == pos.x &&
        selectedPos.y == pos.y
      ) {
        removeSelectAfterDrop = true;
      }

      isDragging = true;
      chessBounds = boardElement && boardElement.getBoundingClientRect();
      pieceSize = chessBounds && chessBounds.width / RANK_BOARD;
      mouseDownTimeOut = setTimeout(() => {
        calculatePosition(event.clientX, event.clientY);
        window.addEventListener("mousemove", onWindowMouseMove);
      }, 120);

      window.addEventListener("mouseup", onWindowMouseUp);
      selectedPos = pos;
      legalMoves = getLegalMoves(fen, pos);
    };

    piece.addEventListener("mousedown", onMouseDown);
    piece.addEventListener("mouseup", onMouseUp);

    return {
      destroy() {
        piece.removeEventListener("mouseup", onMouseUp);
        piece.removeEventListener("mousedown", onMouseDown);
      },
    };
  }

  onMount(() => {
    window.addEventListener("mousedown", mouseDownHandler);

    return () => {
      window.removeEventListener("mousedown", mouseDownHandler);
    };
  });

  chessConfig.subscribe((config) => {
    flipped = config?.flipped;
    let updatedCoordinates: CoordinateType[] = [];
    for (let i = 1; i <= RANK_BOARD; i++) {
      updatedCoordinates.push({
        x: 0.75,
        y: (i - 1) * 12.5 + 3.5,
        classes: i % 2 ? "coordinate-light" : "coordinate-dark",
        text: `${flipped ? i : 9 - i}`,
      });
    }
    for (let i = 1; i <= FILE_BOARD; i++) {
      updatedCoordinates.push({
        x: 10 + (i - 1) * 12.5,
        y: 99,
        classes: i % 2 ? "coordinate-dark" : "coordinate-light",
        text: String.fromCharCode(
          flipped ? "i".charCodeAt(0) - i : "a".charCodeAt(0) + i - 1
        ),
      });
    }
    coordinates = updatedCoordinates;
  });

  history.subscribe((newHistory) => {
    if (!newHistory) {
      lastmove = null;
      return;
    }
    lastmove =
      getCurrentFen() == newHistory.history1[newHistory.historyindex][0] &&
      newHistory.history1[newHistory.historyindex].length > 2
        ? newHistory.history1[newHistory.historyindex][2]
        : null;
  });

  const getHover = (): BoardPos => {
    let hoverFile = Math.max(
      Math.min(translateX && Math.round(translateX / 100), FILE_BOARD - 1),
      0
    );
    let hoverRank = Math.max(
      Math.min(translateY && Math.round(translateY / 100), RANK_BOARD - 1),
      0
    );
    if (getChessConfig()?.flipped) {
      return {
        x: FILE_BOARD - 1 - hoverFile,
        y: RANK_BOARD - 1 - hoverRank,
      };
    } else {
      return {
        x: hoverFile,
        y: hoverRank,
      };
    }
  };

  $: isDragging = false;
  $: fen = parseFEN(fenConfig);
  $: selectedPos = null;
  $: legalMoves = null;
  $: translateX = null;
  $: translateY = null;
  $: hover = getHover();
  $: lastmove = null;
  $: console.log("legalMoves....chess.....console.....", legalMoves);
</script>

<chessboard
  class="board"
  class:flipped
  id="board-single"
  bind:this={boardElement}
>
  <svg viewBox="0 0 100 100" class="coordinates">
    {#each coordinates as coord}
      <text x={coord.x} y={coord.y} font-size="2.8" class={coord.classes}
        >{coord.text}</text
      >
    {/each}
  </svg>
  <!--/Coordinates-->
  {#if selectedPos}
    <Hightlight file={selectedPos.x} rank={selectedPos.y} />
  {/if}

  {#if lastmove}
    <Hightlight file={lastmove.from.x} rank={lastmove.from.y} />
    <Hightlight file={lastmove.to.x} rank={lastmove.to.y} />
  {/if}
  <!-- <div
    class="highlight square-54"
    style="background-color: rgb(255, 255, 0); opacity: 0.5"
    data-test-element="highlight"
  />
  <div
    class="highlight square-53"
    style="background-color: rgb(255, 255, 0); opacity: 0.5"
    data-test-element="highlight"
  />
  <div
    class="highlight square-52"
    style="background-color: rgb(255, 255, 0); opacity: 0.5"
    data-test-element="highlight"
  /> -->
  <div class="element-pool" style="" data-test-element="" />
  <!--/Squares--><!--/Blinking Highlights--><!--/Effects-->
  <Hover visibility={!isDragging} file={hover.x} rank={hover.y} />
  <!--/Hover Square--><!--/Effects-->
  {#each fen.b as fItem, f}
    {#each fItem as pieceType, r}
      <Piece
        {pieceType}
        file={f}
        rank={r}
        selectHandlers={selectPieceHandlers}
        dragging={isDragging &&
          selectedPos &&
          f === selectedPos.x &&
          r === selectedPos.y}
        {translateX}
        {translateY}
      />
    {/each}
  {/each}

  {#if legalMoves}
    {#each legalMoves as move}
      <Hint
        file={move.to.x}
        rank={move.to.y}
        isCapture={hasPiece(fen, move.to)}
        on:mousedown={() => hintMouseDownHandler(move.to.x, move.to.y)}
      />
    {/each}
  {/if}
  <!--/Pieces--><!--/Custom Items--><!--/MoveHints--><!--/Capture Hints-->
  <svg viewBox="0 0 100 100" class="arrows" />
  <!--/Arrows--><!--/Promotion Window--><!--/Fade Setup-->
</chessboard>

<style scoped>
  chessboard {
    background-repeat: no-repeat;
    background-size: 100%;
  }
  #board-single {
    background-image: url("@/assets/chess/themes/boards/green/150.png");
  }
  #board-single .piece.bp {
    background-image: url("@/assets/chess/themes/pieces/neo/150/bp.png");
  }
  #board-single .piece.br {
    background-image: url("@/assets/chess/themes/pieces/neo/150/br.png");
  }
  #board-single .piece.bn {
    background-image: url("@/assets/chess/themes/pieces/neo/150/bn.png");
  }
  #board-single .piece.bb {
    background-image: url("@/assets/chess/themes/pieces/neo/150/bb.png");
  }
  #board-single .piece.bk {
    background-image: url("@/assets/chess/themes/pieces/neo/150/bk.png");
  }
  #board-single .piece.bq {
    background-image: url("@/assets/chess/themes/pieces/neo/150/bq.png");
  }
  #board-single .piece.wp {
    background-image: url("@/assets/chess/themes/pieces/neo/150/wp.png");
  }
  #board-single .piece.wr {
    background-image: url("@/assets/chess/themes/pieces/neo/150/wr.png");
  }
  #board-single .piece.wn {
    background-image: url("@/assets/chess/themes/pieces/neo/150/wn.png");
  }
  #board-single .piece.wb {
    background-image: url("@/assets/chess/themes/pieces/neo/150/wb.png");
  }
  #board-single .piece.wk {
    background-image: url("@/assets/chess/themes/pieces/neo/150/wk.png");
  }
  #board-single .piece.wq {
    background-image: url("@/assets/chess/themes/pieces/neo/150/wq.png");
  }

  .coordinate-light {
    fill: #779952;
  }

  .coordinate-dark {
    fill: #edeed1;
  }

    /* body.with-pieces {
    --boardContainerWidthWithPieces: max(
      var(--boardMinWidth),
      min(
        var(--boardMaxWidthWithPieces),
        var(--modifiedBoardWidth, var(--boardMaxHeight)) *
          var(--boardHeightToWidthRatio) * 1.1
      )
    );
    --piecesWidth: calc(var(--boardContainerWidthWithPieces) / 11);
  }
  .board-layout-pieces {
    grid-column: pieces;
  } */
  /* .with-pieces .board-layout-pieces {
    margin-left: calc(var(--boardContainerWidth) - var(--boardWidth));
    width: var(--piecesWidth);
  } */
  .board-layout-main {
    display: flex;
    flex-direction: column;
    grid-column: board-layout;
    margin: 0 auto;
    position: relative;
    width: min-content;
  }
  .board-layout-chessboard {
    display: grid;
    grid-template-columns: [evaluation] var(--evalAndGutter) [pieces] var(
        --piecesWidth
      ) [board] var(--boardContainerWidth) [board-controls] var(
        --boardControlsWidth
      );
    margin: 0 0 0;
    position: relative;
  }
  .board-layout-chessboard > * {
    grid-row: 1;
  }
  .board-layout-chessboard .board {
    grid-column: board;
    height: var(--boardHeight) !important;
    margin-left: calc(var(--boardContainerWidth) - var(--boardWidth));
    padding-bottom: 0;
    width: var(--boardWidth) !important;
  }

  .board-layout-sidebar {
    display: flex;
    flex: 1;
    flex-basis: 0%;
    flex-direction: column;
    margin-top: var(--gutter);
    min-height: var(--sidebarMinHeight);
    min-width: var(--sidebarMinWidth);
    width: 50rem;
  }
  @media (min-width: 960px) {
    .board-layout-sidebar {
      grid-area: top/sidebar;
      margin-top: 0;
    }
  }

  body.with-players {
    --playerHeight: 4rem;
  }
  .board-layout-player {
    flex-shrink: 0;
    height: var(--playerHeight);
    margin: 0 var(--boardControlsWidth) 0 auto;
    position: relative;
    width: var(--boardWidth);
  }

  body {
    --boardContainerWidth: max(
      var(--boardMinWidth),
      min(var(--boardMaxWidth), var(--boardMaxHeight))
    );
    --boardHeight: calc(var(--boardWidth) * var(--boardHeightToWidthRatio));
    --boardHeightToWidthRatio: 1;
    --boardMaxHeight: (
        100vh - 
          var(--horizontalNavHeight) - var(--playerHeight) * 2 -
          var(--gutterTopPlayerToJudo) - var(--gutter) 
      ) / var(--boardHeightToWidthRatio);
    --boardMaxWidthSansOverride: var(--boardMaxWidthWithPieces) - var(--piecesWidth);
    /* --boardMaxWidth: min(
      var(--boardMaxWidthSansOverride),
      var(--modifiedBoardWidth, var(--boardMaxWidthSansOverride))
    ); */
    --boardMaxWidth: var(--boardMaxWidthWithPieces) - var(--piecesWidth);
    --boardMaxWidthWithPieces: 100vw - var(--gutter) * 2 -
      var(--gutterLeftOfBoard) - var(--evalWidth);
    --boardMinWidth: 26.4rem;
    --boardRowHeight: max(
      calc(
        100vh - var(--gutter) - var(--gutterTopPlayerToJudo) -
        var(--horizontalNavHeight)
      ),
      var(--sidebarMinHeight)
    );
    --shf: 4.9406564584124654e-324;
    --divisibleBy: 8;
    --subtractFrom: (0.05rem - 1e-10rem);
    --boardWidth: calc(
      (
          (
              (
                  (var(--boardContainerWidth) / var(--divisibleBy)) -
                    var(--subtractFrom)
                ) * var(--shf)
            ) / var(--shf)
        ) * var(--divisibleBy)
    );
    --evalWidth: 0rem;
    --gutterBoardToNav: var(--gutter);
    --gutterBottomPlayerToAnalysis: 0rem;
    --gutterLeftOfBoard: 0rem;
    --boardControlsWidth: 0rem;
    --piecesWidth: 0rem;
    --playerHeight: 0rem;
    --adWidth: 0rem;
    --analysisHeight: 0rem;
    --evalAndGutter: 0rem;
    --gutter: 1.6rem;
    --gutterSmall: 1rem;
    --gutterTopPlayerToJudo: var(--gutter);
    --horizontalNavHeight: 4rem;
    --sidebarMaxWidth: 50rem;
    --sidebarMinHeight: 50rem;
    --sidebarMinWidth: 30rem;
    --verticalNavWidth: 0rem;
    --videoWidth: 0rem;
    padding: calc(
        var(--gutter) +
          var(--horizontalNavHeight)
      )
      var(--gutter) var(--gutter)
      calc(var(--verticalNavWidth) + var(--gutterBoardToNav));
  }
  .cls-board body {
    --shf: 1 !important;
    --subtractFrom: 0rem !important;
  }
  @media (min-width: 960px) {
    body {
      --boardControlsWidth: calc(var(--gutter) * 2);
      --boardControlsHeight: calc(
        var(--playerHeight) + var(--boardHeight)
      );
      --boardMaxHeight: (
          100vh - var(--playerHeight) *
            2 - var(--gutterTopPlayerToJudo) - var(--gutter) -
            var(--gutterBottomPlayerToAnalysis) - var(--analysisHeight)
        ) / var(--boardHeightToWidthRatio);
      --boardMaxWidthWithPieces: 100vw - var(--verticalNavWidth) -
        var(--gutterBoardToNav) - var(--gutter) - var(--boardControlsWidth) -
        var(--gutterLeftOfBoard) - var(--evalWidth) - var(--sidebarMinWidth) -
        var(--adWidth) - var(--gutterLeftOfTheaterPlayer) -
        var(--theaterPlayerWidth);
      --gutterLeftOfTheaterPlayer: 0rem;
      --gutterBoardToNav: 1.2rem;
      --horizontalNavHeight: 0rem;
      --theaterPlayerWidth: 0rem;
      --verticalNavWidth: var(--navWidth, 14.5rem);
      display: grid;
      grid-template-columns: [left-gutter] 1fr [theater-players] calc(
          var(--gutterLeftOfTheaterPlayer) + var(--theaterPlayerWidth)
        ) [board-layout] min-content [sidebar] minmax(
          var(--sidebarMinWidth),
          var(--sidebarMaxWidth)
        ) [right-gutter] 1fr [ad] var(--adWidth) [videos] var(--videoWidth) [extraneous-dom] 0;
      grid-template-rows: [top] var(--boardRowHeight) [bottom] auto;
    }
  }
  @media (min-resolution: 192dpi) {
    body {
      --divisibleBy: 16;
      --subtractFrom: (0.025rem - 1e-10rem);
    }
  }

</style>
