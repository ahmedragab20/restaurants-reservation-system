import { vSetupConfig } from "very-good-fetch";

vSetupConfig({
  config: {
    baseUrl: "http://localhost:4000",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${process.env.VUE_APP_API_ACCESS_TOKEN}`,
    },
  },
});
