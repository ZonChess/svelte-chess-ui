import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { uuid, Token } from "../types";
import type { User } from "../models/User";
import UserService from "../services/UserService";

let timer;

export const useUserStore = defineStore("user", () => {
  const userId = ref<uuid>(null);
  const token = ref<string>(null);
  const tokenExpiration = ref(null);
  const didAutoLogout = ref(false);
  const isLoggedIn = ref(false);

  async function login(context, payload) {
    const tokenData: Token = await UserService.signIn(payload);

    if (tokenData) {
      saveTokenToStorage(context, tokenData);
      token.value = tokenData.token;
      userId.value = tokenData.userId;
      isLoggedIn.value = true;
    }
  }

  async function signUp(context, payload) {
    const tokenData: Token = await UserService.signUp(payload);
    if (tokenData) {
      saveTokenToStorage(context, tokenData);
      token.value = tokenData.token;
      userId.value = tokenData.userId;
      isLoggedIn.value = true;
    }
  }

  const saveTokenToStorage = (context, tokenData: Token) => {
    const expiresIn = +tokenData.expiresIn * 1000;
    const expirationDate: any = new Date().getTime() + expiresIn;

    localStorage.setItem("token", tokenData.token);
    localStorage.setItem("userId", tokenData.userId);
    localStorage.setItem("tokenExpiration", expirationDate);
    localStorage.setItem("refreshToken", tokenData.refreshToken);

    // timer = setTimeout(function () {
    //   autoLogout(context);
    // }, expiresIn);
  };

  const tryLogin = (context) => {
    const currToken = localStorage.getItem("token");
    const currUserId = localStorage.getItem("userId");
    const tokenExpiration: any = localStorage.getItem("tokenExpiration");

    const expiresIn = +tokenExpiration - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }

    // timer = setTimeout(function () {
    //   autoLogout(context);
    // }, expiresIn);

    if (currToken && currUserId) {
      token.value = currToken;
      userId.value = currUserId;
      isLoggedIn.value = true;
    }
  };

  async function logout() {
    try {
      await UserService.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("tokenExpiration");

      if (timer) {
        clearTimeout(timer);
      }

      token.value = null;
      userId.value = null;
      isLoggedIn.value = false;
    } catch (err) {
      const errorCode = err.code;
      const errorMessage = err.message;
      console.log(errorCode, errorMessage);
    }
  }

  const autoLogout = (context) => {
    logout();
    didAutoLogout.value = true;
  };

  async function resetPassword(context, payload) {
    await UserService.resetPassword(payload);
  }

  return {
    userId,
    token,
    tokenExpiration,
    didAutoLogout,
    isLoggedIn,
    login,
    signUp,
    tryLogin,
    logout,
    autoLogout,
    resetPassword,
  };
});
