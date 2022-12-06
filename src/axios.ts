import axios from "axios";
import type { App } from "vue";

interface AxiosOptions {
  baseUrl?: string;
  token?: string;
}

export default {
  install: (app: App, options: AxiosOptions) => {
    console.log("options.baseUrl..........", options.baseUrl);
    app.config.globalProperties.$axios = axios.create({
      baseURL: options.baseUrl,
      headers: {
        Authorization: options.token ? `Bearer ${options.token}` : "",
        "content-type": "application/json",
        Accept: "application/json",
      },
    });
  },
};
