<script lang="ts">
  import { Router, Route, Link } from "svelte-navigator";
  import Homepage from "./views/Homepage.svelte";
  import PlayChess from "./views/chess/PlayChess.svelte";
  import LoginView from "./views/LoginView.svelte";
</script>

<main>
  <Router primary={false}>
    <Route path="/"><Homepage /></Route>
    <Route path="chess"><PlayChess /></Route>
    <Route path="/login"><LoginView /></Route>
  </Router>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
