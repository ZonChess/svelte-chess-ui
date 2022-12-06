<script lang="ts">
  import { Router, Route, Link, useNavigate, useLocation } from "svelte-navigator";
  import { login } from "../store/user";
  import validateEmail from "../lib/utils";
  import axios from "../axios";
  
  const navigate = useNavigate();
  const location = useLocation();

  $: email = "";
  $: password = "";
  $: formIsValid = true;
  $: isLoading = false;
  $: error = null;

  async function submitForm() {
    formIsValid = true;
    error = null;
    if (!validateEmail(email) || password.length < 6) {
      formIsValid = false;
      error =
        "Please enter a valid email and password (must be at least 6 characters long).";
      return;
    }

    isLoading = true;

    const actionPayload = {
      email: email,
      password: password,
    };

    try {
      await login(null, actionPayload);
      const from = ($location.state && $location.state.from) || "/";
      navigate(from, { replace: true });
    } catch (err) {
      error = err.message || "Failed to authenticate, try later.";
    }

    isLoading = false;
  }

  const handleError = () => {
    error = null;
  };
  
  </script>
  <template>
    <default-card>
      <form on:submit|preventDefault={submitForm} class="m-4 p-4">
        <div class="my-2 mx-0">
          <label for="email" class="font-bold mb-2 block">E-Mail</label>
          <input
            type="email"
            id="email"
            bind:value={email}
            class="w-full block border border-solid border-gray-300"
          />
        </div>
        <div class="my-2 mx-0">
          <label for="password" class="font-bold mb-2 block">Password</label>
          <input
            type="password"
            id="password"
            bind:value={password}
            class="w-full block border border-solid border-gray-300"
          />
        </div>
        {#if isLoading}
        <p>Authenticating...</p>
        {/if}
        {#if !!error}
        <p>{{ error }}</p>
        {/if}
        <div class="flex">
          <div class="w-full">
            <button type="submit"> Login </button>
          </div>
        </div>
      </form>
    </default-card>
  </template>
  