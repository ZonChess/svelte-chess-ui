export default {
  enableAuthFirebase: true,
  firebase: {
    apiKey: "",
    authDomain: "zonwow.firebaseapp.com",
    databaseURL: "",
    projectId: "zonwow",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  },
  enableAuthFirebaseLink: false,
  firebaseLinkConfig: {
    key: "",
    loginUrl:
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=",
    signUpUrl: "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=",
  },
  enableAuthServer: false,
};
