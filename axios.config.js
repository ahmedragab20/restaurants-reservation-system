// setup axios config
import axios from "axios";

axios.defaults.baseURL = "http://localhost:4000";

axios.interceptors.request.use((req) => {
  req.headers.set("Content-Type", "application/json");
  req.headers.set("Accept", "application/json");
  req.headers.set(
    "Authorization",
    `Bearer ${process.env.VUE_APP_API_ACCESS_TOKEN}`
  );
  return req;
});
