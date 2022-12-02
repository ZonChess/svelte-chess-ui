import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import type { User } from "../models/User";
import type { uuid, Token } from "../types";
import config from "../config/config";

async function signInWithFirebaseLink(payload: {
  email: string;
  password: string;
}): Promise<Token> {
  const url =
    config.firebaseLinkConfig.loginUrl + config.firebaseLinkConfig.key;

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      returnSecureToken: true,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const error = new Error(
      responseData.message || "Failed to authenticate. Check your login data."
    );
    throw error;
  }

  const expiresIn = +responseData.expiresIn * 1000;
  // const expiresIn = 5000;
  const expirationDate: any = new Date().getTime() + expiresIn;

  // localStorage.setItem("token", responseData.idToken);
  // localStorage.setItem("userId", responseData.localId);
  // localStorage.setItem("tokenExpiration", expirationDate);

  const token: Token = {
    token: responseData.idToken,
    userId: responseData.localId,
    expiresIn: expiresIn,
    tokenExpiration: expirationDate,
    refreshToken: responseData.refreshToken,
  };

  return token;
}

async function signInWithFirebaseEmailAndPassword(payload: {
  email: string;
  password: string;
}): Promise<Token> {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      payload.email,
      payload.password
    );
    // Signed in
    const user = userCredential.user;
    console.log("user.......", user);
    console.log("userCredential.......", userCredential);
    const token: Token = {
      token: await user.getIdToken(),
      userId: user.uid,
      providerId: user.providerId,
      expiresIn: null,
      tokenExpiration: null,
      refreshToken: user.refreshToken,
    };

    return token;
  } catch (e) {
    const errorCode = e.code;
    const errorMessage = e.message;
    throw e;
  }
}

async function signInWithCognitoEmailAndPassword(payload: {
  email: string;
  password: string;
}): Promise<Token> {
  // [Implement later]
  return null;
}

async function signInWithServerEmailAndPassword(payload: {
  email: string;
  password: string;
}): Promise<Token> {
  // [Implement later]
  return null;
}

async function signIn(payload: {
  email: string;
  password: string;
}): Promise<Token> {
  // Login with Firebase Email and Password
  if (config.enableAuthFirebase) {
    return await signInWithFirebaseEmailAndPassword(payload);
  } else if (config.enableAuthFirebaseLink) {
    return await signInWithFirebaseLink(payload);
  } else if (config.enableAuthCognito) {
    // Login with AWS Cognito
    return await signInWithCognitoEmailAndPassword(payload);
  } else if (config.enableAuthServer) {
    // Login with your own server
    return await signInWithServerEmailAndPassword(payload);
  } else {
    return null;
  }
}

async function signUpWithFirebaseLink(payload: {
  email: string;
  password: string;
}): Promise<Token> {
  const url = config.firebaseLinkConfig.signUpUrl + config.firebaseLinkConfig.key;

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      returnSecureToken: true,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const error = new Error(
      responseData.message || "Failed to authenticate. Check your login data."
    );
    throw error;
  }

  const expiresIn = +responseData.expiresIn * 1000;
  const expirationDate: any = new Date().getTime() + expiresIn;

  const token: Token = {
    token: responseData.idToken,
    userId: responseData.localId,
    expiresIn: expiresIn,
    tokenExpiration: expirationDate,
    refreshToken: responseData.refreshToken,
  };

  return token;
}

async function signUpWithFirebaseEmailAndPassword(payload: {
  email: string;
  password: string;
}): Promise<Token> {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      payload.email,
      payload.password
    );

    // Signed in
    const user = userCredential.user;
    console.log("user.......", user);
    console.log("userCredential.......", userCredential);
    const token: Token = {
      token: await user.getIdToken(),
      userId: user.uid,
      providerId: user.providerId,
      expiresIn: null,
      tokenExpiration: null,
      refreshToken: user.refreshToken,
    };

    return token;
    // ...
  } catch (e) {
    const errorCode = e.code;
    const errorMessage = e.message;
    throw e;
  }

  return null;
}

async function signUpWithCognitoEmailAndPassword(payload: {
  email: string;
  password: string;
}): Promise<Token> {
  // [Implement later]
  return null;
}

async function signUpWithServerEmailAndPassword(payload: {
  email: string;
  password: string;
}): Promise<Token> {
  // [Implement later]
  return null;
}

async function signUp(payload: {
  email: string;
  password: string;
}): Promise<Token> {
  if (config.enableAuthFirebase) {
    // Signup with Firebase Email and Password
    return await signUpWithFirebaseEmailAndPassword(payload);
  } else if (config.enableAuthFirebaseLink) {
    // Signup with Firebase via link
    return await signUpWithFirebaseLink(payload);
  } else if (config.enableAuthCognito) {
    // Signup with AWS Cognito Email and Password
    return await signUpWithCognitoEmailAndPassword(payload);
  } else if (config.enableAuthServer) {
    // Signup with your own server
    return await signUpWithServerEmailAndPassword(payload);
  } else {
    return null;
  }
}

async function signOutWithFirebase(): Promise<boolean> {
  const auth = getAuth();
  await signOut(auth);
  // Sign-out successful.
  return true;
}

async function signOutWithFirebaseLink(): Promise<boolean> {
  // Handle later
  return false;
}

async function signOutWithCognito(): Promise<boolean> {
  // Handle later
  return false;
}

async function signOutWithServer(): Promise<boolean> {
  // Handle later
  return false;
}

async function logout(): Promise<boolean> {
  if (config.enableAuthFirebase) {
    // Sign-out with Firebase Email and Password
    return await signOutWithFirebase();
  } else if (config.enableAuthFirebaseLink) {
    // Sign-out with Firebase via link
    return await signOutWithFirebaseLink();
  } else if (config.enableAuthCognito) {
    // Sign-out with AWS Cognito
    return await signOutWithCognito();
  } else if (config.enableAuthServer) {
    // Sign-out with your own server
    return await signOutWithServer();
  } else {
    return false;
  }
}

async function sendFirebasePasswordResetEmail(payload: { email: string }) {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, payload.email);
    // Password reset email sent!
    console.log("Password reset email sent!");
  } catch (e) {
    const errorCode = e.code;
    const errorMessage = e.message;
    console.log("Password reset email.....", errorCode, errorMessage);
    // ..
  }
}

async function resetPassword(payload: { email: string }) {
  if (config.enableAuthFirebase) {
    await sendFirebasePasswordResetEmail(payload);
  }
}

export default {
  // loginWithFirebaseEmail,
  // signUpWithFirebaseEmail,
  signIn,
  signUp,
  logout,
  resetPassword,
};
