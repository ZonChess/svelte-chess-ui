import { get, writable, type Writable } from "svelte/store";
import type { uuid, Token } from "../types";
import type { User } from "../models/User";
import UserService from "../services/UserService";

let timer;

export let userId: Writable<uuid | null> = writable(null);
export let token: Writable<string | null> = writable(null);
export let tokenExpiration: Writable<number | null> = writable(null);
export let didAutoLogout: Writable<boolean> = writable(false);
export let isLoggedIn: Writable<boolean> = writable(false);

export async function login(context, payload) {
  const tokenData: Token = await UserService.signIn(payload);
  if (tokenData) {
    saveTokenToStorage(context, tokenData);
    token.set(tokenData.token);
    userId.set(tokenData.userId);
    isLoggedIn.set(true);
  }
}

async function signUp(context, payload) {
  const tokenData: Token = await UserService.signUp(payload);
  if (tokenData) {
    saveTokenToStorage(context, tokenData);
    token.set(tokenData.token);
    userId.set(tokenData.userId);
    isLoggedIn.set(true);
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
    token.set(currToken);
    userId.set(currUserId);
    isLoggedIn.set(true);
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

    token.set(null);
    userId.set(null);
    isLoggedIn.set(false);
  } catch (err) {
    const errorCode = err.code;
    const errorMessage = err.message;
    console.log(errorCode, errorMessage);
  }
}

const autoLogout = (context) => {
  logout();
  didAutoLogout.set(true);
};

async function resetPassword(context, payload) {
  await UserService.resetPassword(payload);
}
