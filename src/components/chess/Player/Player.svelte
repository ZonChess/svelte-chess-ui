<script lang="ts">
    export let position: string;
    export let name: string;
    export let time: string;
</script>
<div id="board-layout-player-{position}" class="shrink-0 relative board-layout-player">
  <div class="player-component player-{position}">
    <div class="player-avatar">
      <img
        data-cy="avatar"
        alt="{name}"
        src="@assets/chess/noavatar_l.webpp"
        width="40"
        height="40"
        class="avatar-component player-image"
      />
      <div class="online-status-component" />
    </div>
    <div class="player-tagline">
      <div class="user-tagline-component">
        <a href="#" class="user-username-component user-username-dark user-username-link user-tagline-username"
          data-test-element="user-tagline-username">{name}</a
        >
        <span class="user-tagline-rating user-tagline-dark"> (800) </span>
        <div class="country-flags-component country-xx" />
      </div>
      <captured-pieces board-id="board-single" color="1" class="player-pieces">
        <div>
          <span class="captured-pieces-cpiece captured-pieces-score" />
        </div>
      </captured-pieces>
    </div>
    <div class="quick-chat-icon-component quick-chat-icon-top"><!----></div>
    <div
      class="clock-component clock-white clock-top clock-live clock-running player-clock"
    >
      <div class="clock-bar">
        <div class="clock-remainder" style="width: 940%" />
      </div>
      <div class="clock-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          class="clock-timer"
          style="transform: rotate(3240deg)"
        >
          <path
            d="M5.48,9a.93.93,0,0,0-.3.71v.58a.94.94,0,0,0,.3.71,1,1,0,0,0,.71.3h4.58a1,1,0,0,0,.71-.3.94.94,0,0,0,.29-.71V9.7A.92.92,0,0,0,11.48,9a1,1,0,0,0-.71-.27H6.19A1,1,0,0,0,5.48,9Z"
          />
          <path
            d="M19.22,6.1a9.9,9.9,0,0,0-2.14-3.18A10.23,10.23,0,0,0,13.9.78,9.76,9.76,0,0,0,10,0,9.86,9.86,0,0,0,6.1.78,10,10,0,0,0,.78,6.1,9.81,9.81,0,0,0,0,10a9.81,9.81,0,0,0,.78,3.9A10,10,0,0,0,6.1,19.22,9.86,9.86,0,0,0,10,20a9.76,9.76,0,0,0,3.89-.78,10.23,10.23,0,0,0,3.18-2.14,9.9,9.9,0,0,0,2.14-3.18A9.81,9.81,0,0,0,20,10,9.81,9.81,0,0,0,19.22,6.1ZM17.07,13a7.65,7.65,0,0,1-1.65,2.42A7.81,7.81,0,0,1,13,17.06a7.46,7.46,0,0,1-3,.6,7.51,7.51,0,0,1-3-.6,7.74,7.74,0,0,1-2.43-1.65A8,8,0,0,1,2.94,13a7.46,7.46,0,0,1-.6-3,7.46,7.46,0,0,1,.6-3A8,8,0,0,1,4.58,4.59,7.74,7.74,0,0,1,7,2.94a7.51,7.51,0,0,1,3-.6,7.45,7.45,0,0,1,3,.6,7.74,7.74,0,0,1,2.43,1.65A7.65,7.65,0,0,1,17.07,7a7.46,7.46,0,0,1,.6,3A7.46,7.46,0,0,1,17.07,13Z"
          />
        </svg>
      </div>
      <span data-cy="clock-time">{time}</span>
    </div>
  </div>
</div>
